import { ErrorCode } from "../core";
import { IfResult, IfContext, formatNumber } from './common';

const METHOD_NAME = 'view';
const FUNC_NAME = 'getZeroBalance';

export async function getZeroBalance(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args

        let params =
        {
            method: FUNC_NAME,
            params: {

            }
        }

        let cr = await ctx.client.callAsync(METHOD_NAME, params);
        if (ctx.sysinfo.verbose) {
            console.log(cr);
        }

        resolve(cr);
    });
}
export function prnGetZeroBalance(ctx: IfContext, obj: IfResult) {
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
            console.log('RUFF: ', formatNumber(objJson.value));
        } else {
            console.log('Error:', objJson.err);
        }

    } catch (e) {
        console.log(e);
    }
}
