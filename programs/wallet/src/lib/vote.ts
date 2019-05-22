import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, MAX_VOTE_CANDIDATES } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

const FUNC_NAME = 'vote';

// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

export async function vote(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length !== 2) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        if (!checkFee(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee"
            });
            return;
        }
        let candidates;
        try {
            candidates = JSON.parse(args[0]);
        } catch (e) {
            console.log();
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong candidates"
            });
        }

        if (candidates.length > MAX_VOTE_CANDIDATES) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong candidates num"
            });
        }

        let fee = args[1];

        let tx = new ValueTransaction();
        tx.method = FUNC_NAME;
        tx.fee = new BigNumber(fee);
        tx.input = candidates;

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
export function prnVote(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
