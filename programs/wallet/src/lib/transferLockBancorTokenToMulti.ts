import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkTokenid, checkAddress, checkAmount, checkFee, sendAndCheckTx, checkLockBancorTokenMultiPreBalances } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'
let fs = require('fs');

// tokenid: string, preBalances: { address: string, amount: string }[], cost: string, fee: string

export async function transferLockBancorTokenToMulti(ctx: IfContext, args: string[]): Promise<IfResult> {
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

        if (!checkFee(args[2])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong fee"
            });
            return;
        }

        let tokenid = args[0];
        let addresses: any;
        let fee = args[2];

        if (args[1] === 'airdrop.json') {
            let obj: any;
            try {
                if (!fs.existsSync('./airdrop.json')) {
                    // Do something
                    console.log('No config file')
                    throw new Error();
                }
                let configBuffer = fs.readFileSync('./airdrop.json');
                obj = JSON.parse(configBuffer.toString());

            } catch (e) {
                resolve({
                    ret: ErrorCode.RESULT_WRONG_ARG,
                    resp: "Wrong airdrop.json"
                });
                return;
            }
            addresses = JSON.parse(JSON.stringify(obj));
        } else if (!checkLockBancorTokenMultiPreBalances(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong address amount"
            });
            return;
        } else {
            addresses = JSON.parse(args[1]);
        }

        let tx = new ValueTransaction();
        tx.method = 'transferLockBancorTokenToMulti';
        tx.fee = new BigNumber(fee);
        tx.input = {
            tokenid: tokenid.toUpperCase(),
            to: addresses
        };

        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}
export function prnTransferLockBancorTokenToMulti(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
