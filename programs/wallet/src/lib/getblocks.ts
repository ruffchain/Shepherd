import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext } from './common';

const FUNC_NAME = 'getBlocks';


export async function getBlocks(ctx: IfContext, args: string[]): Promise<IfResult> {
  return new Promise<IfResult>(async (resolve) => {

    // check args
    if (args.length < 3) {
      resolve({
        ret: ErrorCode.RESULT_WRONG_ARG,
        resp: "Wrong args"
      });
      return;
    }


    let params =
    {
      min: (args[0].length < 64) ? parseInt(args[0]) : args[0],
      max: (args[1].length < 64) ? parseInt(args[1]) : args[1],
      transactions: (args[2] === undefined) ? false : ((args[2].toLowerCase() === 'true') ? true : false)
    }

    let cr = await ctx.client.callAsync(FUNC_NAME, params);

    resolve(cr);
  });
}
export function prnGetBlocks(ctx: IfContext, obj: IfResult) {
  console.log(obj.resp);
}
