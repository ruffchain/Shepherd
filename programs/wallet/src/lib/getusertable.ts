import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core/error_code";
import { IfResult, IfContext, checkReceipt, checkFeeForRange, checkTokenid } from './common';

export async function getUserTable(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {
        // check args
        if (args.length !== 3) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong args"
            });
            return;
        }
        const contractAddr = args[0];
        const tableName = args[1];
        const keyName = args[2];

        const params = {
            method: 'getUserTableValue',
            params: {
                contractAddr,
                tableName,
                keyName,
            }
        }

        if (ctx.sysinfo.verbose) {
            console.log(args[1]);
            console.log(typeof args[1]);
        }

        let cr = await ctx.client.callAsync('view', params);

        if (ctx.sysinfo.verbose) {
            console.log(cr);
        }

        resolve(cr); // {resp, ret}
    });
}

export function prnGetUserTable(ctx: IfContext, obj: IfResult) {
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
        console.log('value', objJson.value);
    } catch (e) {
        console.log(e);
    }

}
