import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext } from './common';

const FUNC_NAME = 'getBlock';


export async function getReceipt(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 1) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        let params = {
            tx: args[0]
        };

        let cr = await ctx.client.callAsync('getTransactionReceipt', params);

        resolve(cr);
    });
}
export function prnGetReceipt(ctx: IfContext, obj: IfResult) {

    console.log(obj);



    // print receipt in good format

}
