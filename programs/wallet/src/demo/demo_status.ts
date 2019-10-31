import { RPCClient } from '../client/client/rfc_client';
import * as colors from 'colors';

let SYSINFO: any = {};
SYSINFO.secret = "6d23e5ab295b296079c9885056e71981042dc829517343c5c4af19ebac9436a1";
SYSINFO.host = "40.73.1.241";
SYSINFO.port = 18089;
SYSINFO.address = "1jPTj1YjuaWtYviYaNhTRYewyVttvz5wA";
SYSINFO.verbose = true;

let clientHttp: RPCClient;

clientHttp = new RPCClient(
    SYSINFO.host,
    SYSINFO.port,
    SYSINFO
);

let ctx = {
    client: clientHttp,
    sysinfo: SYSINFO
}


async function main() {
    // get balance
    let funcName = 'view'
    let funcArgs = {
        method: 'getBalance',
        params: {
            address: "1jPTj1YjuaWtYviYaNhTRYewyVttvz5wA"
        }
    }

    let cr = await ctx.client.callAsync(funcName, funcArgs);
    console.log(colors.yellow('----------------- gebalance ----------------------'))
    console.log(cr);

    // get block
    let funcName2 = 'getBlock'
    let funcArgs2 = {
        which: 'latest',
        transactions: false,
        eventLog: false,
        receipts: false
    }

    cr = await ctx.client.callAsync(funcName2, funcArgs2);
    console.log(colors.yellow('----------------- getblock -----------------------'))
    console.log(cr);

    // get block 1
    funcName2 = 'getBlock'
    funcArgs2 = {
        which: 'latest',
        transactions: true,
        eventLog: true,
        receipts: true
    }

    cr = await ctx.client.callAsync(funcName2, funcArgs2);
    console.log(colors.yellow('------------------- getblock 1 ---------------------'))
    console.log(cr);

    // get tx
    let funcName3 = 'getTransactionReceipt'
    let funcArgs3 = {
        tx: "254f0cd0ab6c4203e9518f16da7bb3ca7e71c04e24596b0724845a63678c4f05",  // tx hash
    }
    cr = await ctx.client.callAsync(funcName3, funcArgs3);
    console.log(colors.yellow('------------------ get tx ----------------------'))
    console.log(cr);
}

main();