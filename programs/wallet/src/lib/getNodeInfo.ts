
import { IfResult, IfContext } from './common';
import { BigNumber } from 'bignumber.js';
import { MapFromObject } from '../core/serializable';
import * as colors from 'colors';

const FUNC_NAME = 'getNodeInfo';

export async function getNodeInfo(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        let params = {}

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

        console.log(objJson);
    } catch (e) {
        console.log(e);
    }
}
