import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkAddress, checkAmount, checkFee, sendAndCheckTx } from './common';
import { BigNumber } from 'bignumber.js';
import { ValueTransaction } from '../core/value_chain/transaction'

//const FUNC_NAME = 'createToken';


export async function transferTo(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 3) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }

        if (!checkAddress(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong address"
            });
            return;
        }

        if (!checkAmount(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
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

        let address = args[0];
        let amount = args[1];
        let fee = args[2];

        let tx = new ValueTransaction();
        tx.method = 'transferTo';
        tx.value = new BigNumber(amount);
        tx.fee = new BigNumber(fee);
        tx.input = { to: address };

        if (ctx.sysinfo.verbose) {
            console.log('tx:');
            console.log(tx);
        }


        let rtn = await sendAndCheckTx(ctx, tx);
        resolve(rtn);
    });
}
export function prnTransferTo(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}

// Without receipt checking
export async function transferToNoWait(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 3) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }

        if (!checkAddress(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong address"
            });
            return;
        }

        if (!checkAmount(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
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

        let address = args[0];
        let amount = args[1];
        let fee = args[2];

        let tx = new ValueTransaction();
        tx.method = 'transferTo';
        tx.value = new BigNumber(amount);
        tx.fee = new BigNumber(fee);
        tx.input = { to: address };

        let { err, nonce } = await ctx.client.getNonce({ address: ctx.sysinfo.address });

        if (err) {
            console.error(`transferTo getNonce failed for ${err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `transferTo getNonce failed for ${err}`
            });
            return;
        }

        tx.nonce = nonce! + 1;
        if (ctx.sysinfo.verbose) {
            console.log('nonce is:', tx.nonce);
        }

        tx.sign(ctx.sysinfo.secret);

        let sendRet = await ctx.client.sendTransaction({ tx });
        if (sendRet.err) {
            console.error(`transferTo failed for ${sendRet.err}`);
            resolve({
                ret: ErrorCode.RESULT_FAILED,
                resp: `transferTo failed for ${sendRet.err}`
            });
            return;
        }
        console.log(`Send transferTo tx: ${tx.hash}`);

        resolve({
            ret: ErrorCode.RESULT_OK,
            resp: `${tx.hash}`
        }); // {resp, ret}
    });
}
