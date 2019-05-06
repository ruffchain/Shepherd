import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, checkTokenid, checkPrecision, checkTokenAmount} from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

// tokenid: string, preBalances: string { address: string, amount: string }[], cost: string, fee: string

export async function createToken(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length !== 4) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }

        // check token id
        if (!checkTokenid(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong token id length [3-12]"
            });
            return;
        }

        if (!checkPrecision(args[2])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong precision"
            });
            return;
        }

        if (!checkFee(args[3])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee"
            });
            return;
        }


        let tokenid = args[0];

        if (ctx.sysinfo.verbose) {
            console.log(args[1]);
            console.log(typeof args[1]);
        }

        try {
            let objPrebalances = JSON.parse(args[1]);
            console.log(objPrebalances);
        } catch (e) {
            console.log(e);
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong preBanlances"
            });
            return;
        }

        let preBalances = JSON.parse(args[1]);
        let precision = args[2];
        let fee = args[3];

        let amount = preBalances.map((x: {address: string, amount: string}) => x.amount)
            .reduce((accumulator: BigNumber, currentValue: string) => {
                return accumulator.plus(currentValue);
            }, new BigNumber(0));

        if (!checkTokenAmount(amount.toString())) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
            });
            return;
        }

        let tx = new ValueTransaction();
        tx.method = 'createToken';
        tx.fee = new BigNumber(fee);
        tx.input = { tokenid: tokenid.toUpperCase(), preBalances, precision };

        let { err, nonce } = await ctx.client.getNonce({ address: ctx.sysinfo.address });
        if (err) {
            console.error(`transferTo getNonce failed for ${err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `transferTo getNonce failed for ${err}`
            });
            return;
        }

        tx.nonce = nonce! + 1;
        tx.sign(ctx.sysinfo.secret);

        let sendRet = await ctx.client.sendTransaction({ tx });
        if (sendRet.err) {
            console.error(`transferTo failed for ${sendRet.err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `transferTo failed for ${sendRet.err}`
            });
            return;
        }

        console.log(`send transferTo tx: ${tx.hash}`);


        // 需要查找receipt若干次，直到收到回执若干次，才确认发送成功, 否则是失败
        let receiptResult = await checkReceipt(ctx, tx.hash);

        resolve(receiptResult); // {resp, ret}
    });
}
export function prnCreateToken(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
