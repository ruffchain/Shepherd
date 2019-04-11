import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkTokenid, checkAddress, checkAmount, checkFee } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'


// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

export async function transferTokenTo(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 4) {
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
        if (!checkAddress(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong address"
            });
            return;
        }
        if (!checkAmount(args[2])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
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
        let address = args[1];
        let amount = args[2];
        let fee = args[3];

        let tx = new ValueTransaction();
        tx.method = 'transferTokenTo';
        tx.fee = new BigNumber(fee);
        tx.input = {
            tokenid: tokenid.toUpperCase(),
            to: address,
            amount: amount
        };

        let { err, nonce } = await ctx.client.getNonce({ address: ctx.sysinfo.address });

        if (err) {
            console.error(`transferTokenTo getNonce failed for ${err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `transferTokenTo getNonce failed for ${err}`
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
            console.error(`transferTokenTo failed for ${sendRet.err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `transferTokenTo failed for ${sendRet.err}`
            });
            return;
        }
        console.log(`Send transferTokenTo tx: ${tx.hash}`);

        // 需要查找receipt若干次，直到收到回执若干次，才确认发送成功, 否则是失败
        let receiptResult = await checkReceipt(ctx, tx.hash);

        resolve(receiptResult); // {resp, ret}
    });
}
export function prnTransferTokenTo(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
