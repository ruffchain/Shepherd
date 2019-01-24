import { transferTo } from "./transferto";
import { IfContext, sysTokenSym, IfResult } from './common';
import { ErrorCode } from '../core/error_code';
import * as colors from 'colors';
import { getBalance } from "./getbalance";

interface IfTester {
    name: string;
    address: string;
    secret: string;
    amount: number;
}

interface IfTesterJson {
    readme: string;
    testers: IfTester[];
}


export async function parseTesterJson(ctx: IfContext, inObj: any): Promise<IfResult> {
    return new Promise<IfResult>(async (resolve) => {
        let newObj = inObj as IfTesterJson;
        let errorLst: IfTester[] = [];
        //
        console.log('parseTesterJson, It will take several minutes ... ');
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
                return;
            }, 3000);
        });

        for (let i = 0; i < newObj.testers.length; i++) {
            let item = newObj.testers[i];
            console.log(`\n[ ${item.name} of ${newObj.testers.length}]`);
            console.log('\nTransfer ', item.amount, ` ${sysTokenSym} => `, item.address);

            let result = await transferTo(ctx, [item.address, item.amount.toString(), "0.1"]);

            if (result.ret !== ErrorCode.RESULT_OK) {
                errorLst.push(item);
            } else {
                console.log(colors.green('Finished'));
            }
        }
        if (errorLst.length > 0) {
            console.log(colors.red('\nFollowing transfer failed:'));
            console.log(errorLst);
        } else {
            console.log(colors.green('All transfers succeed'))
        }
        console.log('\n');

        // check all balance
        console.log('Check transfers:')
        console.log('It will take several minutes ...')
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
                return;
            }, 3000);
        });
        errorLst = [];

        for (let i = 0; i < newObj.testers.length; i++) {
            let item = newObj.testers[i];

            console.log(`\n[ ${item.name} of ${newObj.testers.length}]`);
            // console.log('\nTransfer ', item.amount, ` ${sysTokenSym} => `, item.address);

            let result = await getBalance(ctx, [item.address]);

            if (result.ret !== ErrorCode.RESULT_OK && result.ret !== 200) {
                errorLst.push(item);
            } else {
                // console.log('Finished');
                try {
                    let objJson = JSON.parse(result.resp!);

                    console.log('\nShould be: ', item.amount);
                    console.log('Got      : ', objJson.value.replace(/n/g, ''));
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        if (errorLst.length > 0) {
            console.log(colors.red('\nFollowing getBalance failed:'));
            console.log(errorLst);
        } else {
            console.log(colors.green('All getBalance succeed'))
        }
        console.log('\n');
        resolve({
            ret: ErrorCode.RESULT_OK,
            resp: '1'
        })
    });
}
