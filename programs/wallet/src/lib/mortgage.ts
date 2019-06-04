import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, checkAmount, sendAndCheckTx, strAmountPrecision } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

const FUNC_NAME = 'mortgage';

export async function mortgage(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length !== 2) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        let amount = strAmountPrecision(args[0], 0);

        if (!checkAmount(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
            });
            return;
        }

        // check fee
        if (!checkFee(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee value"
            });
            return;
        }

        let tx = new ValueTransaction();
        tx.method = FUNC_NAME;
        tx.fee = new BigNumber(args[1]);
        tx.value = new BigNumber(amount);
        tx.input = amount;

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);

    });
}
export function prnMortgage(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
