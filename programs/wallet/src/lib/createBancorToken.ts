import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, checkTokenid, checkTokenFactor, checkTokenNonliquidity, checkCost, checkTokenAmount, sendAndCheckTx } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

export async function createBancorToken(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        if (args.length !== 6) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args number"
            });
            return;
        }
        if (!checkTokenid(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong token id length [3-12]"
            });
            return;
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

        if (!checkTokenFactor(args[2])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong factor"
            });
            return;
        }

        // let nonliquidity = undefined;
        // let preBanlances = JSON.parse(args[1]);
        // let cost:

        // no nonliquidity
        if (!checkTokenNonliquidity(args[3])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong nonliquidity"
            });
            return;
        }

        // check cost
        if (!checkCost(args[4])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong cost value"
            });
            return;
        }

        // check fee
        if (!checkFee(args[5])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee value"
            });
            return;
        }

        let tokenid = args[0];
        if (ctx.sysinfo.verbose) {
            console.log(args[1]);
            console.log(typeof args[1]);
        }
        let preBalances = JSON.parse(args[1]);
        let factor = args[2];

        let nonliquidity: string = args[3];

        let amount = preBalances.map((x: { address: string, amount: string }) => x.amount)
            .reduce((accumulator: BigNumber, currentValue: string) => {
                return accumulator.plus(currentValue);
            }, new BigNumber(nonliquidity));

        if (!checkTokenAmount(amount.toString())) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
            });
            return;
        }

        let tx = new ValueTransaction();
        tx.method = 'createBancorToken';

        tx.value = new BigNumber(args[4]);
        tx.fee = new BigNumber(args[5]);
        tx.input = { tokenid: tokenid.toUpperCase(), preBalances, factor, nonliquidity };

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}

export function prnCreateBancorToken(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
