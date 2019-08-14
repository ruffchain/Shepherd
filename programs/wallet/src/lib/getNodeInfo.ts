
import { IfResult, IfContext } from './common';
import { BigNumber } from 'bignumber.js';
import { MapFromObject } from '../core/serializable';
import * as colors from 'colors';

const FUNC_NAME = 'view';

export async function getNodeInfo(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        let params = {
            method: 'getNodeInfo',
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
export function prnGetNodeInfo(ctx: IfContext, obj: IfResult) {
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
        //console.log(objJson);
        if (objJson.err === 0) {
            let obj = objJson.value;
            for (let v of Object.keys(obj)) {
                if (typeof obj[v] === 'string') {
                    obj[v] = obj[v].substr(1);
                }
            }
        } else {
            console.log(colors.red('Wrong feedback'));
        }
        console.log(objJson.value);
    } catch (e) {
        console.log(e);
    }
}
