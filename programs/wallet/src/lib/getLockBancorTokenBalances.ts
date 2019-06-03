import { ErrorCode } from "../core";
import { IfResult, IfContext, checkTokenid, checkAddress, formatNumber, checkAddressArray } from './common';

const METHOD_NAME = 'view';
const FUNC_NAME = 'getBancorTokenBalances';

export async function getLockBancorTokenBalances(ctx: IfContext, args: string[]): Promise<IfResult> {
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
        if (!checkAddressArray(args[1])) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong address "
            });
            return;
        }

        let addrs: any;
        try {
            addrs = JSON.parse(args[1]);
        } catch (e) {
            resolve({
                ret: ErrorCode.RESULT_WRONG_ARG,
                resp: "Wrong addressrd "
            });
            return;
        }

        let token = args[0].toUpperCase();

        let params =
        {
            method: 'getBancorTokenBalances',
            params: {
                tokenid: token,
                addresses: addrs
            }
        }

        let cr = await ctx.client.callAsync(METHOD_NAME, params);
        if (ctx.sysinfo.verbose) {
            console.log(cr);
        }

        resolve(cr);
    });
}
export function prnGetLockBancorTokenBalances(ctx: IfContext, obj: IfResult) {
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
            // console.log('Balance: ', formatNumber(objJson.value));
            objJson.value.forEach((ele: any) => {
                console.log(ele);
            });
        } else {
            console.log('Error:', objJson.err);
        }

        // console.log(objJson);

    } catch (e) {
        console.log(e);
    }
}
