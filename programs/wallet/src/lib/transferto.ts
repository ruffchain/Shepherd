import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, check_address, check_amount, check_fee } from './common';
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

        if (!check_address(args[0])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong address"
            });
            return;
        }

        if (!check_amount(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong amount"
            });
            return;
        }

        if (!check_fee(args[2])) {
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
        console.log('nonce is:', tx.nonce);
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

        // 需要查找receipt若干次，直到收到回执若干次，才确认发送成功, 否则是失败
        let receiptResult = await checkReceipt(ctx, tx.hash);

        resolve(receiptResult); // {resp, ret}
    });
}
export function prnTransferTo(obj: IfResult) {
    console.log(obj.resp);
}
