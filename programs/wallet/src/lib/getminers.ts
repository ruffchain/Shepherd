import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext } from './common';

const FUNC_NAME = 'view';

export async function getMiners(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args

        let params =
        {
            method: 'getMiners',
            params: {}
        }

        let cr = await ctx.client.callAsync(FUNC_NAME, params);
        console.log(cr);
        resolve(cr);
    });
}
export function prnGetMiners(obj: IfResult) {
    console.log(obj);
    console.log('');

    if (!obj.resp) {
        console.log('Wrong result: ');
        return;
    }
    let objJson: any;
    try {
        objJson = JSON.parse(obj.resp);
        //console.log('Ruff: ', objJson.value.replace(/n/g, ''))
        if (objJson.err === 0) {
            objJson.value.forEach((element: string) => {
                console.log(element.slice(1));
            });
        }
    } catch (e) {
        console.log(e);
    }
}
