import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkTokenid, checkAddress, checkAmount, checkFee, sendAndCheckTx } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

export async function transferLockBancorTokenTo(ctx: IfContext, args: string[]): Promise<IfResult> {
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
        tx.method = 'transferBancorTokenTo';
        tx.fee = new BigNumber(fee);
        tx.input = {
            tokenid: tokenid.toUpperCase(),
            to: address,
            amount: amount
        };

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}
export function prnTransferLockBancorTokenTo(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
