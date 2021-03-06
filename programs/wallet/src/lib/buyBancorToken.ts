import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkTokenid, checkAddress, checkAmount, checkFee, checkCost, sendAndCheckTx } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

const FUNC_NAME = 'buyBancorToken';

export async function buyBancorToken(ctx: IfContext, args: string[]): Promise<IfResult> {
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
        if (!checkCost(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong cost"
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
        let cost = args[1];
        let fee = args[2];

        let tx = new ValueTransaction();
        tx.method = 'buyBancorToken';
        tx.fee = new BigNumber(fee);
        tx.value = new BigNumber(cost);
        tx.input = {
            tokenid: tokenid.toUpperCase()
        };

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}
export function prnBuyBancorToken(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
