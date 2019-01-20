import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from "../core";
import { IfResult, IfContext } from './common';

const FUNC_NAME = 'getPeers';

export async function getPeers(ctx: IfContext, args: string[]): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {

        // check args

        let cr = await ctx.client.callAsync(FUNC_NAME, {});
        console.log(cr);
        resolve(cr);
    });
}
export function prnGetPeers(obj: IfResult) {
    console.log(obj);
    console.log('');

    if (!obj.resp) {
        console.log('Wrong result: ');
        return;
    }
    let objJson: any;
    try {
        objJson = JSON.parse(obj.resp);
        objJson.forEach((element: string) => {
            console.log(element.replace(/<=/g, ''));
        });
    } catch (e) {
        console.log(e);
    }
}
