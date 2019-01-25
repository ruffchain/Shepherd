import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, check_fee } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

const FUNC_NAME = 'createToken';

// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

export async function register(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 1) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        let fee = args[0];

        if (!check_fee(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee"
            });
            return;
        }

        let tx = new ValueTransaction();
        tx.method = 'register';
        tx.fee = new BigNumber(fee);
        tx.input = '';

        let { err, nonce } = await ctx.client.getNonce({ address: ctx.sysinfo.address });

        if (err) {
            console.error(`${tx.method} getNonce failed for ${err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `${tx.method} getNonce failed for ${err}`
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
            console.error(`${tx.method} failed for ${sendRet.err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `${tx.method} failed for ${sendRet.err}`
            });
            return;
        }
        console.log(`Send ${tx.method} tx: ${tx.hash}`);



        // 需要查找receipt若干次，直到收到回执若干次，才确认发送成功, 否则是失败
        let receiptResult = await checkReceipt(ctx, tx.hash);

        resolve(receiptResult); // {resp, ret}
    });
}
export function prnRegister(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
