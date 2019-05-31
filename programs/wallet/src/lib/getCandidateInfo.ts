
import { ErrorCode } from "../core";
import { IfResult, IfContext, checkAddress } from './common';


const FUNC_NAME = 'view';

export async function getCandidateInfo(ctx: IfContext, args: string[]): Promise<IfResult> {
  return new Promise<IfResult>(async (resolve) => {

    // check args
    if (args.length < 1) {
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

    let params =
    {
      method: 'getCandidateInfo',
      params: { address: args[0] }
    }

    let cr = await ctx.client.callAsync(FUNC_NAME, params);
    if (ctx.sysinfo.verbose) {
      console.log(cr);
    }

    resolve(cr);
  });
}
export function prnGetCandidateInfo(ctx: IfContext, obj: IfResult) {
  if (ctx.sysinfo.verbose) {
    console.log(obj);
  }

  console.log('');

  if (!obj.resp) {
    console.log('Wrong result: ');
    return;
  }
  let objJson: any;

  try {
    objJson = JSON.parse(obj.resp);
    if (objJson.err === 0) {
      // objJson.value.forEach((element: string) => {
      //     console.log(element.slice(1));
      // });

      console.log(objJson.value);
    }
  } catch (e) {
    console.log(e);
  }
}
