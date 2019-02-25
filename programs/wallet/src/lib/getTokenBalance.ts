import { ErrorCode } from "../core";
import { IfResult, IfContext, checkTokenid , formatNumber} from './common';

const FUNC_NAME = 'view';

export async function getTokenBalance(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

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

        let params =
        {
            method: 'getTokenBalance',
            params: {
                address: args[1],
                tokenid: args[0]
            }
        }

        let cr = await ctx.client.callAsync(FUNC_NAME, params);
        if (ctx.sysinfo.verbose) {
            console.log(cr);
        }

        resolve(cr);
    });
}
export function prnGetTokenBalance(ctx: IfContext, obj: IfResult) {
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
            console.log('Balance: ', formatNumber(objJson.value));
        } else {
            console.log('Error:', objJson.err);
        }

    } catch (e) {
        console.log(e);
    }
}
