import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFee, checkTokenid, sendAndCheckTx } from './common';

import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'
import * as fs from 'fs';

// tokenid: string, preBalances: string { address: string, amount: string }[], cost: string, fee: string

export async function setUserCode(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {
        // check args
        if (args.length !== 2) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }

        const codePath = args[0];

        const code = fs.readFileSync(codePath, 'utf-8');
        let userCode = Buffer.from(code);

        if (!checkFee(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee min 0.001"
            });
            return;
        }

        if (ctx.sysinfo.verbose) {
            console.log(args[1]);
            console.log(typeof args[1]);
        }

        let fee = args[1];

        let tx = new ValueTransaction();
        tx.method = 'setUserCode';
        tx.fee = new BigNumber(fee);
        tx.input = { userCode };

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}
export function prnSetUserCode(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
