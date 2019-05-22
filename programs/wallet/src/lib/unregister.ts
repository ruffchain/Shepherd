import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, checkAmount, sendAndCheckTx } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

const FUNC_NAME = 'unregister';

export async function unregister(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 1) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        // 

        if (args[0] !== ctx.sysinfo.address) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong input " + args[0]
            });
            return;
        }
        let tx = new ValueTransaction();
        tx.method = FUNC_NAME;
        tx.input = '';

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}
export function prnUnregister(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
