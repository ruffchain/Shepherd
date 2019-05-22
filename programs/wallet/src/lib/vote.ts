import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, MAX_VOTE_CANDIDATES, sendAndCheckTx } from './common';
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

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}
export function prnVote(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
