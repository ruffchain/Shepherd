import { ErrorCode } from "../core";
import { IfResult, IfContext, checkTokenid, checkAddress } from './common';

const METHOD_NAME = 'view';
const FUNC_NAME = 'getBancorTokenReserve';

export async function getBancorTokenReserve(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args
        if (args.length < 1) {
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

        let params =
        {
            method: FUNC_NAME,
            params: {
                tokenid: args[0]
            }
        }

        let cr = await ctx.client.callAsync(METHOD_NAME, params);
        if (ctx.sysinfo.verbose) {
            console.log(cr);
        }

        resolve(cr);
    });
}
export function prnGetBancorTokenReserve(ctx: IfContext, obj: IfResult) {
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
            console.log('Reserve: ', objJson.value);
        } else {
            console.log('Error:', objJson.err);
        }

    } catch (e) {
        console.log(e);
    }
}
