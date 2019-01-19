import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext } from './common';
import { strict } from 'assert';

const FUNC_NAME = 'view';

export async function getCandidates(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args

        let params =
        {
            method: 'getCandidates',
            params: {}
        }

        let cr = await ctx.client.callAsync(FUNC_NAME, params);
        console.log(cr);
        resolve(cr);
    });
}
export function prnGetCandidates(obj: IfResult) {
    console.log(obj);
    console.log('');

    if (!obj.resp) {
        console.log('Wrong result: ');
        return;
    }
    let objJson: any;
    try {
        objJson = JSON.parse(obj.resp);
        if (objJson.err === 0) {
            objJson.value.forEach((element: string) => {
                console.log(element);
            });
        }
    } catch (e) {
        console.log(e);
    }
}
