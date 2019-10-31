
import { RPCClient } from '../client/client/rfc_client';
import * as colors from 'colors';
import { ValueTransaction, BigNumber } from '../core';
import { checkReceipt } from '../lib/common';

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

    let tx = new ValueTransaction();
    tx.method = 'transferTo';
    tx.value = new BigNumber(1);
    tx.fee = new BigNumber(0.1);
    tx.input = { to: "17xT51Hw6oXBVKbYmmJt7t4TJRX8RSant3" };

    // get nonce
    let { err, nonce } = await ctx.client.getNonce({ address: ctx.sysinfo.address });

    console.log(colors.yellow('------------------ get nonce ------------'))
    if (err) {
        console.log(colors.red('get nonce failed'));
        return;
    } else {
        console.log('nonce: ', nonce)
    }

    tx.nonce = nonce! + 1;

    // tx sign
    tx.sign(ctx.sysinfo.secret);

    console.log(colors.yellow('------------------ sign tx ------------'))
    console.log('')
    console.log(tx)

    // send out 
    let sendRet = await ctx.client.sendTransaction({ tx });
    if (sendRet.err) {
        console.log(colors.red('Sign failed'))
        return;
    }

    // check if succeed

    console.log(colors.yellow('------------------ check receipt ------------'))
    let receiptResult = await checkReceipt(ctx, tx.hash);

    console.log(receiptResult)

    console.log('')
    if (receiptResult.ret !== 0) {
        console.log(colors.red('tx not processed'));
        return;
    } else {
        console.log(colors.blue('tx processed'))
    }

}

main();