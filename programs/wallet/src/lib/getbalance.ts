import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext, sysTokenSym, checkAddress ,formatNumber} from './common';
import * as colors from 'colors';

const FUNC_NAME = 'view';

export async function getBalance(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {
        let params: any;
        // check args
        if (args.length < 1) {
            params = {
                method: 'getBalance',
                params: { address: ctx.sysinfo.address }
            };
        } else {
            if (!checkAddress(args[0])) {
                resolve({
                    ret: ErrorCode.RESULT_WRONG_ARG,
                    resp: "Wrong address"
                });
                return;
            }
            params =
                {
                    method: 'getBalance',
                    params: { address: args[0] }
                }
        }

        let cr = await ctx.client.callAsync(FUNC_NAME, params);

        if (ctx.sysinfo.verbose) {
            console.log(cr);
        }

        resolve(cr);
    });
}
export function prnGetBalance(ctx: IfContext, obj: IfResult) {
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
        console.log(colors.green(`${sysTokenSym}`), ":", formatNumber(objJson.value))
    } catch (e) {
        console.log(e);
    }
}
