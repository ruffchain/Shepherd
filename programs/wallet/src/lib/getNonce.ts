import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext } from './common';

const FUNC_NAME = 'getNonce';


export async function getNonce(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 1) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }

        let params =
        {
            address: args[0]
        }

        let cr = await ctx.client.callAsync(FUNC_NAME, params);

        resolve(cr);
    });
}
export function prnGetNonce(obj: IfResult) {
    console.log(obj.resp);
}
