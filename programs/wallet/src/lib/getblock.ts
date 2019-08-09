import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext } from './common';

const FUNC_NAME = 'getBlock';


export async function getBlock(ctx: IfContext, args: string[]): Promise<IfResult> {
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
            which: (args[0] === 'latest') ? args[0] : ((args[0].length < 64) ? parseInt(args[0]) : args[0]),
            transactions: (args[1] === undefined) ? false : ((args[1].toLowerCase() === 'true') ? true : false),
            eventLog: (args[2] === undefined) ? false : ((args[2].toLowerCase() === 'true') ? true : false),
            receipts: (args[3] === undefined) ? false : ((args[3].toLowerCase() === 'true') ? true : false)
        }

        let cr = await ctx.client.callAsync(FUNC_NAME, params);

        resolve(cr);
    });
}
export function prnGetBlock(ctx: IfContext, obj: IfResult) {
    console.log(obj.resp);
}
