import { RPCClient } from '../client/client/rfc_client';
import { resolve } from 'path';
import { ErrorCode } from '../core';

const MAX_CONFIRM_TIMES = 3;
const BLOCK_INTERVAL = 10;

export interface IfResult { resp: string | null, ret: number };

export interface IfSysinfo {
    secret: string;
    address: string;
    port: string;
    host: string;
}

export interface IfContext { sysinfo: IfSysinfo, client: RPCClient }

export async function waitSeconds(seconds: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('*');
            resolve('0');
        }, 1000 * seconds);
    });
}

export const sysTokenSym = 'sys';

export async function checkReceipt(ctx: IfContext, txhash: string): Promise<{ resp: string | null, ret: number }> {
    return new Promise<{ resp: string | null, ret: number }>(async (resolve, reject) => {
        let counter = 0;

        for (let i = 0; i < MAX_CONFIRM_TIMES; i++) {
            console.log('Wait to confirm');
            await waitSeconds(1 * BLOCK_INTERVAL);

            let result = await ctx.client.callAsync('getTransactionReceipt', { tx: txhash });

            console.log(result);
            let obj = JSON.parse(result.resp!);

            if (result.ret !== 200 || obj.err !== 0) {
                continue;
            }
            // check if receipt valid


            if (obj.receipt.returnCode === 0) {
                counter++;
                console.log('.');
            }

            if (counter >= 2) {
                console.log('confirmed');
                resolve({
                    ret: ErrorCode.RESULT_OK,
                    resp: 'TX confirmed'
                });
                return;
            }
        }
        // error!
        resolve({
            ret: ErrorCode.RESULT_FAILED,
            resp: 'Not confimred'
        });

    });
}
