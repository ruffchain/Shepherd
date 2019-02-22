import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkTokenid, checkAddress, checkAmount, checkFee, checkCost } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

const FUNC_NAME = 'sellBancorToken';

export async function sellBancorToken(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 3) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }

        if (!checkTokenid(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong tokenid"
            });
            return;
        }
        if (!checkAmount(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
            });
            return;
        }
        if (!checkFee(args[2])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee"
            });
            return;
        }
        let tokenid = args[0];
        let amount = args[1];
        let fee = args[2];

        let tx = new ValueTransaction();
        tx.method = FUNC_NAME;
        tx.fee = new BigNumber(fee);
        tx.input = {
            tokenid: tokenid,
            amount: amount
        };

        let { err, nonce } = await ctx.client.getNonce({ address: ctx.sysinfo.address });

        if (err) {
            console.error(`${FUNC_NAME} getNonce failed for ${err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `${FUNC_NAME} getNonce failed for ${err}`
            });
            return;
        }

        tx.nonce = nonce! + 1;
        if (ctx.sysinfo.verbose) {
            console.log('nonce is:', tx.nonce);
        }

        tx.sign(ctx.sysinfo.secret);

        let sendRet = await ctx.client.sendTransaction({ tx });
        if (sendRet.err) {
            console.error(`${FUNC_NAME} failed for ${sendRet.err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `${FUNC_NAME} failed for ${sendRet.err}`
            });
            return;
        }
        console.log(`Send ${FUNC_NAME} tx: ${tx.hash}`);

        // 需要查找receipt若干次，直到收到回执若干次，才确认发送成功, 否则是失败
        let receiptResult = await checkReceipt(ctx, tx.hash);

        resolve(receiptResult); // {resp, ret}
    });
}
export function prnSellBancorToken(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
