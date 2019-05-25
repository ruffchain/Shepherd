import { RPCClient } from '../client/client/rfc_client';
import { ErrorCode } from '../core/error_code';
import { isValidAddress } from '../core/address';
import { ValueTransaction } from '../core';
const BigNumber = require('bignumber.js');

const MAX_CONFIRM_TIMES = 3;
const BLOCK_INTERVAL = 10;

export const TOKEN_MAX_LENGTH = 12;
export const TOKEN_MIN_LENGTH = 3;
export const FEE_MAX = 0.001;
export const FEE_MIN = 0.001;
export const MAX_NONLIQUIDITY = 1000000000000000000;
export const MAX_TOKEN_AMOUNT = 1000000000000000000;
export const MAX_COST = 1000000000000;
export const MAX_DEPOSIT_SYS = 3000000;
export const MAX_VOTE_CANDIDATES = 7;

const NUM_DIGITS = 12;
const MAX_NORMAL_TOKEN_PRECISION = 9;


export const sysTokenSym = 'SYS';


const REGIP = /^[1-9]{1}\d{0,2}\.[1-9]{1}\d{0,2}\.[1-9]{1}\d{0,2}\.[1-9]{1}\d{0,2}(:\d{5,9})?$/g;

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
export function checkDepositAmount(amount: string): boolean {
    let bn = new BigNumber(amount);
    if (bn.lt(new BigNumber(MAX_DEPOSIT_SYS))) {
        return false;
    } else {
        return true;
    }
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

export function checkFeeForRange(fee: string, min: number, max: number) {
    let bn = new BigNumber(fee);

    if (bn.isNaN() === true) {
        return false;
    }

    let num = JSON.parse(fee);
    return num >= min && num <= max;
}

export function checkAddress(addr: string): boolean {
    //console.log("len:", addr.length)
    // return addr.length >= 30;
    return isValidAddress(addr);
}

export function checkAddressArray(addrStr: string): boolean {
    //console.log("len:", addr.length)
    let addr: any;
    try {
        addr = JSON.parse(addrStr);
        console.log('addr', addr);

        for (let i = 0; i < addr.length; i++) {
            console.log(addr[i])
            if (!isValidAddress(addr[i])) {
                return false;
            }
        }
    } catch (e) {
        return false;
    }

    return addr.length > 0;
}
export function checkRegisterName(name: string): boolean {
    if (name.length > 20) {
        return false;
    } else {
        return true;
    }
}
export function checkRegisterIp(name: string): boolean {
    if (name.match(REGIP) === null) {
        return false;
    } else {
        return true;
    }
}
export function checkRegisterUrl(name: string): boolean {
    if (name.length > 50) {
        return false;
    } else {
        return true;
    }
}
export function checkRegisterAddress(name: string): boolean {
    if (name.length > 50) {
        return false;
    } else {
        return true;
    }
}
//////////////////////////////////////////////////////////////
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

export function strAmountPrecision(num: string, precision: number): string {
    let nTemp = parseFloat(num);
    return nTemp.toFixed(precision);
}


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
    return bn.isLessThanOrEqualTo(1) && bn.isGreaterThan(0);
}

export function checkTokenNonliquidity(nonliquidity: string): boolean {
    let bn = new BigNumber(nonliquidity);

    if (bn.isNaN()) {
        return false;
    }
    return bn.isLessThan(MAX_NONLIQUIDITY) && bn.isGreaterThan(0);
}

export function checkTokenAmount(amount: string): boolean {
    let bn = new BigNumber(amount);

    if (bn.isNaN()) {
        return false;
    }

    return bn.isLessThan(MAX_TOKEN_AMOUNT) && bn.isGreaterThan(0);
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
    // console.log(num);
    try {
        let out = parseFloat(num.replace(/n/g, ''));
        let outString = out.toString(); //.toFixed(NUM_DIGITS);
        return outString;
    } catch (e) {
        return 'error';
    }
}

export function checkPrecision(arg: string) {
    let bn = new BigNumber(arg);

    if (bn.isNaN()) {
        return false;
    }
    let num = parseInt(arg);
    return num >= 0 && num <= MAX_NORMAL_TOKEN_PRECISION;
}
////////////////////////////////////////////////
// functions in common
export async function sendAndCheckTx(ctx: IfContext, tx: ValueTransaction): Promise<IfResult> {
    let { err, nonce } = await ctx.client.getNonce({ address: ctx.sysinfo.address });

    if (err) {
        console.error(`${tx.method} getNonce failed for ${err}`);
        return {
            ret: ErrorCode.RESULT_FAILED,
            resp: `${tx.method} getNonce failed for ${err}`
        };
    }

    tx.nonce = nonce! + 1;
    if (ctx.sysinfo.verbose) {
        console.log('nonce is:', tx.nonce);
    }

    tx.sign(ctx.sysinfo.secret);
    let sendRet = await ctx.client.sendTransaction({ tx });
    if (sendRet.err) {
        console.error(`${tx.method} failed for ${sendRet.err}`);
        return {
            ret: ErrorCode.RESULT_FAILED,
            resp: `${tx.method} failed for ${sendRet.err}`
        };
    }

    console.log(`Send ${tx.method} tx: ${tx.hash}`);
    // 需要查找receipt若干次，直到收到回执若干次，才确认发送成功, 否则是失败
    let receiptResult = await checkReceipt(ctx, tx.hash);

    return receiptResult; // {resp, ret}
} 
