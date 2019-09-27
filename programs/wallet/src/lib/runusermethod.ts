import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, checkTokenid } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

export async function runUserMethod(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {
        // check args
        if (args.length !== 5) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        const to = args[0];
        const amount = args[1];
        const fee = args[2];
        const action = args[3];
        const params = args[4];

        if (!checkFee(fee)) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee min 0.1"
            });
            return;
        }

        if (ctx.sysinfo.verbose) {
            console.log(args[1]);
            console.log(typeof args[1]);
        }

        let tx = new ValueTransaction();

        let { err, nonce } = await ctx.client.getNonce({ address: ctx.sysinfo.address });
        if (err) {
            console.error(`transferTo getNonce failed for ${err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `transferTo getNonce failed for ${err}`
            });
            return;
        }
        tx.method = 'runUserMethod';
        tx.fee = new BigNumber(fee);
        tx.value = new BigNumber(amount);
        tx.input = {action, to, params};
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
export function prnRunUserMethod(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
