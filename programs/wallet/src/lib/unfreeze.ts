import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkAmount, checkFee, sendAndCheckTx } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

const FUNC_NAME = 'unmortgage';

// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

export async function unfreeze(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length !== 2) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        if (!checkAmount(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
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
        let amount = args[0];
        let fee = args[1];

        let tx = new ValueTransaction();
        tx.method = FUNC_NAME;
        tx.fee = new BigNumber(fee);
        tx.input = amount;

        let rtn = await sendAndCheckTx(ctx, tx);

        resolve(rtn);
    });
}
export function prnUnfreeze(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
