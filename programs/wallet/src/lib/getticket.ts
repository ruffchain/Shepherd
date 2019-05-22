import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext, sysTokenSym, checkAddress } from './common';
import * as colors from 'colors';

const FUNC_NAME = 'view';

export async function getTicket(ctx: IfContext, args: string[]): Promise<IfResult> {
  return new Promise<IfResult>(async (resolve) => {
    let params: any;

    if (args.length < 1) {
      params =
        {
          method: 'getTicket',
          params: { address: ctx.sysinfo.address }
        }
    } else {
      if (!checkAddress(args[0])) {
        resolve({
          ret: ErrorCode.RESULT_WRONG_ARG,
          resp: "Wrong Address"
        });
        return;
      }

      params =
        {
          method: 'getTicket',
          params: { address: args[0] }
        }
    }
    // check args

    let cr = await ctx.client.callAsync(FUNC_NAME, params);
    if (ctx.sysinfo.verbose) {
      console.log(cr);
    }

    resolve(cr);
  });
}
export function prnGetTicket(ctx: IfContext, obj: IfResult) {
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
    console.log(colors.green('On stake:'));

    // if (objJson.value) {
    //     console.log(`${sysTokenSym}:`, objJson.value.replace(/n/g, ''))
    // }
    if (!objJson.err) {
      console.log(objJson.value);
    }
  } catch (e) {
    console.log(e);
  }
}
