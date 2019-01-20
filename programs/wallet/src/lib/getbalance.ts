import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext, sysTokenSym } from './common';

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
            params =
                {
                    method: 'getBalance',
                    params: { address: args[0] }
                }
        }

        let cr = await ctx.client.callAsync(FUNC_NAME, params);
        console.log(cr);
        resolve(cr);
    });
}
export function prnGetBalance(obj: IfResult) {
    console.log(obj);
    console.log('');

    if (!obj.resp) {
        console.log('Wrong result: ');
        return;
    }
    let objJson: any;
    try {
        objJson = JSON.parse(obj.resp);
        console.log(`${sysTokenSym}:`, objJson.value.replace(/n/g, ''))
    } catch (e) {
        console.log(e);
    }
}
