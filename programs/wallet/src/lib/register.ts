import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, checkAmount, sendAndCheckTx, checkDepositAmount, strAmountPrecision, checkRegisterName, checkRegisterIp, checkRegisterUrl, checkRegisterAddress } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

const FUNC_NAME = 'register';

// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

export async function register(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 6) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        // 

        if (!checkAmount(args[0]) || !checkDepositAmount(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
            });
            return;
        }

        if (!checkRegisterName(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong arg: name"
            });
            return;
        }

        if (!checkRegisterIp(args[2])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong arg: ip"
            });
            return;
        }
        if (!checkRegisterUrl(args[3])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong arg: url"
            });
            return;
        }
        if (!checkRegisterAddress(args[4])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong arg: address"
            });
            return;
        }

        if (!checkFee(args[5])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee"
            });
            return;
        }

        let amount = strAmountPrecision(args[0], 0);

        let tx = new ValueTransaction();
        tx.method = FUNC_NAME;
        tx.value = new BigNumber(amount);
        tx.fee = new BigNumber(args[5]);
        tx.input = {
            name: args[1],
            ip: args[2],
            url: args[3],
            location: args[4]
        };

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}
export function prnRegister(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
