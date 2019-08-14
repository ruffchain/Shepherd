
import { IfResult, IfContext } from './common';
import { BigNumber } from 'bignumber.js';
import { MapFromObject } from '../core/serializable';
import * as colors from 'colors';

const FUNC_NAME = 'view';

export async function getConnInfo(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        let params = {
            method: 'getConnInfo',
            params: {}
        }
        // check args
        let cr = await ctx.client.callAsync(FUNC_NAME, params);
        if (ctx.sysinfo.verbose) {
            console.log(cr);
        }

        resolve(cr);
    });
}
export function prnGetConnInfo(ctx: IfContext, obj: IfResult) {
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
        // let vote: Map<string, BigNumber> = MapFromObject(objJson.value!);
        // console.log(colors.green('Votes:'));
        // for (let [k, v] of vote) {
        //     console.log(`${k}:  ${v.toString().replace(/n/g, '')}`);
        // }
        console.log(objJson);
    } catch (e) {
        console.log(e);
    }
}
