import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext } from './common';
import { BigNumber } from 'bignumber.js';
import { MapFromObject } from '../core/serializable';
import * as colors from 'colors';

const FUNC_NAME = 'view';

export async function getVote(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        let params = {
            method: 'getVote',
            params: {}
        }
        // check args
        let cr = await ctx.client.callAsync(FUNC_NAME, params);
        console.log(cr);
        resolve(cr);
    });
}
export function prnGetVote(obj: IfResult) {
    console.log(obj);
    console.log('');

    if (!obj.resp) {
        console.log('Wrong result: ');
        return;
    }
    let objJson: any;
    try {
        objJson = JSON.parse(obj.resp);
        let vote: Map<string, BigNumber> = MapFromObject(objJson.value!);
        console.log(colors.green('Votes:'));
        for (let [k, v] of vote) {
            console.log(`${k}:  ${v.toString().replace(/n/g, '')}`);
        }
    } catch (e) {
        console.log(e);
    }
}
