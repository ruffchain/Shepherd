import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from '../core/error_code';
const BigNumber = require('bignumber.js');

const MAX_CONFIRM_TIMES = 3;
const BLOCK_INTERVAL = 10;

export const TOKEN_MAX_LENGTH = 12;
export const TOKEN_MIN_LENGTH = 3;
export const FEE_MAX = 2;
export const FEE_MIN = 0.01;
export const MAX_NONLIQUIDITY = 1000000000000;
export const MAX_COST = 1000000000000;
const NUM_DIGITS = 12;

/**
 * 
 * @param amount: amount of token
 * 
 * - it should be a BigNumber
 */
export function checkAmount(amount: string): boolean {

    let bn = new BigNumber(amount);

    if (bn.isNaN() === true) {
        return false;
    }
    let num = JSON.parse(amount);
    return num > 0;
}
export function checkTokenid(token: string): boolean {
    return token.length >= TOKEN_MIN_LENGTH && token.length <= TOKEN_MAX_LENGTH;
}
export function checkFee(fee: string): boolean {
    let bn = new BigNumber(fee);

    if (bn.isNaN() === true) {
        return false;
    }

    let num = JSON.parse(fee);
    return num >= FEE_MIN && num <= FEE_MAX;
}

export function checkAddress(addr: string): boolean {
    //console.log("len:", addr.length)
    return addr.length >= 30;
}

export interface IfResult { resp: string | null, ret: number };

export interface IfSysinfo {
    secret: string;
    address: string;
    port: string;
    host: string;
    verbose: boolean;
}

export interface IfContext { sysinfo: IfSysinfo, client: RPCClient }

export async function waitSeconds(seconds: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log('*');
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
            await waitSeconds(1.1 * BLOCK_INTERVAL);

            let result = await ctx.client.callAsync('getTransactionReceipt', { tx: txhash });

            if (ctx.sysinfo.verbose) {
                console.log(result);
            }

            let obj = JSON.parse(result.resp!);

            if (result.ret !== 200 || obj.err !== 0) {
                continue;
            }
            // check if receipt valid


            if (obj.receipt.returnCode === 0) {
                counter++;
                console.log('.');
            }

            if (counter >= 1) {
                // console.log('Confirmed');
                resolve({
                    ret: ErrorCode.RESULT_OK,
                    resp: 'TX confirmed:' + txhash
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

export function checkTokenFactor(factor: string): boolean {
    let bn = new BigNumber(factor);

    if (bn.isNaN()) {
        return false;
    }
    let num = JSON.parse(factor);
    return num > 0 && num < 1;
}

export function checkTokenNonliquidity(nonliquidity: string): boolean {
    let bn = new BigNumber(nonliquidity);

    if (bn.isNaN()) {
        return false;
    }
    let num = JSON.parse(nonliquidity);
    return num >= 0 && num < MAX_NONLIQUIDITY;
}

export function checkCost(cost: string): boolean {
    let bn = new BigNumber(cost);

    if (bn.isNaN()) {
        return false;
    }
    let num = JSON.parse(cost);
    return num > 0 && num < MAX_COST;
}

export function formatNumber(num: string): string {
    try {
        let out = JSON.parse(num.replace(/n/g, ''));
        out = out.toFixed(NUM_DIGITS);
        return out.toSring();
    } catch (e) {
        return 'error';
    }
}



