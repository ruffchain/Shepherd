import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext, sysTokenSym, checkAddress, formatNumber, checkAddressArray, checkTokenid } from './common';
import * as colors from 'colors';

const FUNC_NAME = 'view';

export async function getBancorTokenBalances(ctx: IfContext, args: string[]): Promise<IfResult> {
  return new Promise<IfResult>(async (resolve) => {
    let params: any;
    // check args
    if (args.length < 2) {
      resolve({
        ret: ErrorCode.RESULT_WRONG_ARG,
        resp: "Wrong args"
      });
      return;
    }

    if (!checkTokenid(args[0])) {
      resolve({
        ret: ErrorCode.RESULT_WRONG_ARG,
        resp: "Wrong tokenid , length [3-12]"
      });
      return;
    }
    if (!checkAddressArray(args[1])) {
      resolve({
        ret: ErrorCode.RESULT_WRONG_ARG,
        resp: "Wrong addresses"
      });
      return;
    }
    let addrs = JSON.parse(args[1]);
    let token = args[0].toUpperCase();

    params =
      {
        method: 'getBancorTokenBalances',
        params: {
          tokenid: token,
          addresses: addrs
        }
      }


    let cr = await ctx.client.callAsync(FUNC_NAME, params);

    if (ctx.sysinfo.verbose) {
      console.log(cr);
    }

    resolve(cr);
  });
}
export function prnGetBancorTokenBalances(ctx: IfContext, obj: IfResult) {
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
    // console.log(colors.green(`${sysTokenSym}`), ":", formatNumber(objJson.value))
    console.log(objJson);
  } catch (e) {
    console.log(e);
  }
}
