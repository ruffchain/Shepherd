#!/usr/bin/env node

/**
* Action according to arg input
*/
import * as readline from 'readline';
import * as process from 'process';
import * as colors from 'colors';
import { addressFromSecretKey } from './core/address';
import { RPCClient } from './client/client/rfc_client';

import { testcmd } from './lib/testcmd';

import { IfResult } from './lib/common';
import { ErrorCode } from './core/error_code';
import { getBlock, prnGetBlock } from './lib/getblock';
import { getBalance, prnGetBalance } from './lib/getbalance';
import { createToken, prnCreateToken } from './lib/createtoken';
import { getReceipt, prnGetReceipt } from './lib/getreceipt';
import { transferTo, prnTransferTo } from './lib/transferto';
import { getNonce, prnGetNonce } from './lib/getNonce';
import { getTokenBalance, prnGetTokenBalance } from './lib/getTokenBalance';
import { transferTokenTo, prnTransferTokenTo } from './lib/transferTokenTo';
import { getStake, prnGetStake } from './lib/getstake';
import { getCandidates, prnGetCandidates } from './lib/getCandidates';
import { getPeers, prnGetPeers } from './lib/getpeers';
import { getMiners, prnGetMiners } from './lib/getminers';
import { register, prnRegister } from './lib/register';
import { mortgage, prnMortgage } from './lib/mortgage';
import { unmortgage, prnUnmortgage } from './lib/unmortgage';
import { vote, prnVote } from './lib/vote';
import { getVote, prnGetVote } from './lib/getvote';

const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');

const VERSION = '0.1';
const PROMPT = '> ';

let SYSINFO: any = {};
SYSINFO.secret = "";
SYSINFO.host = "";
SYSINFO.port = "";
SYSINFO.address = "";

// let chainClient: NewChainClient;
let clientHttp: RPCClient;



process.on('unhandledRejection', (err) => {
    console.log(colors.red('unhandledRrejection'));
    console.log(err);
})
process.on('uncaughtException', (err) => {
    console.log(colors.red('uncaughtException'));
    console.log(err);
})
process.on('warning', (warning) => {
    console.log(colors.red('warning'));
    console.log(warning);

    console.log('\n');
    console.log(colors.yellow('Please change the file mentioned below:'));
    console.log('/node_modules/sqlite3-transactions/sqlite3-transactions.js:1:73 Change sys to util');
    console.log('line 1: var sys = require(\'sys\'),');
    console.log('to: var sys = require(\'util\'),');
});

let keyin = readline.createInterface(process.stdin, process.stdout);

let checkArgs = (SYSINFO: any) => {
    if (SYSINFO.secret === "") {
        console.log(colors.red("No secret\n"));
        process.exit(1);
    }
    if (SYSINFO.host === "") {
        console.log(colors.red("No host\n"));
        process.exit(1);
    }
    if (SYSINFO.port === "") {
        console.log(colors.red("No port\n"));
        process.exit(1);
    }

    SYSINFO.address = addressFromSecretKey(SYSINFO.secret);
    // console.log(SYSINFO);
}
interface ifCMD {
    name: string;
    content: string;
    example: string;
}
const CMDS: ifCMD[] = [
    {
        name: 'help',
        content: 'help COMMAND',
        example: ''
    },
    {
        name: 'info',
        content: 'print public address, secret, rpchost, rpcport',
        example: ''
    },
    {
        name: 'createKey',
        content: 'create address, public key, secrete key',
        example: ''
    },
    {
        name: 'getAddress',
        content: 'print public address',
        example: ''
    },
    {
        name: 'getBalance',
        content: 'get balance under address',
        example: '\ngetbalance\n'
            + '\targ  -  address:string\n'
            + 'Example:\n'
            + '\t$ getbalance 1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J'
    },
    {
        name: 'getTokenBalance',
        content: 'get Token balance under address',
        example: '\ngetTokenbalance\n'
            + '\targ1  -  tokenid:string\n'
            + '\targ2  -  address:string\n'
            + 'Example:\n'
            + '\t$ getTokenBalance tokenid 1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J'
    },
    {
        name: 'getStake',
        content: 'get stake ',
        example: '\n' +
            '\targ1  -  address\n'
            + '\n\nExample:\n$ getstake 1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J'
    },
    {
        name: 'getCandidates',
        content: 'get candidates ',
        example: '\n'
            + '\n\nExample:\n$ getCandidates'
    },
    {
        name: 'getMiners',
        content: 'get miners ',
        example: '\n'
            + '\n\nExample:\n$ getMiners'
    },
    {
        name: 'getPeers',
        content: 'get peers ',
        example: '\n'
            + '\n\nExample:\n$ getPeers'
    },
    {
        name: 'getBlock',
        content: 'get Block',
        example: '\n' +
            '\targ1  -  block number | hash value | \'latest\'\n'
            + '\targ2  -  contain transactions?'
            + '\n\nExample:\n$ getblock 1 false'
    },
    {
        name: 'getReceipt',
        content: 'get transaction receipt',
        example: '\n' +
            '\targ1  -  tx hash\n'
            + '\n\nExample:\n$ getReceipt c6f697ee409e40db10bbd2533cea35f8e95dc9e92ef360ee5bbd0a2638be98b7'
    },
    {
        name: 'transferTo',
        content: 'Transfer RUFF to some address',
        example: '\n' +
            '\targ1  -  address\n'
            + '\targ2  -  amount\n'
            + '\targ3  -  fee\n'
            + '\n\nExample:\n$ transferTo 16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg 1000 1'
    },
    {
        name: 'transferTokenTo',
        content: 'Transfer Token to some address',
        example:
            '\n\targ1  -  tokenid\n'
            + '\targ2  -  address\n'
            + '\targ3  -  amount\n'
            + '\targ3  -  fee\n'
            + '\n\nExample:\n$ transferTokenTo tokenid 16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg 1000 1'
    },
    {
        name: 'createToken',
        content: 'create a token',
        example:
            '\n\targ1  -  token-name\n'
            + '\targ2  -  preBalance\n'
            + '\targ3  -  cost\n'
            + '\targ4  -  fee\n'
            + '\n\ncreatetoken token2 [{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000"}] 100 1'
    },
    {
        name: 'getNonce',
        content: 'get nonce of some address',
        example: '\n' +
            '\targ1  -  address\n'
            + '\n\nExample:\n$ getNonce 16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg'
    },
    {
        name: 'createKey',
        content: 'create a new address',
        example: ''
    },
    {
        name: 'register',
        content: 'register to be a candidate with caller\'s address',
        example: '\n' +
            '\targ1  -  fee\n'
            + '\n\nExample:\n$ register 5'
    },
    {
        name: 'mortgage',
        content: 'mortgage some balance',
        example: '\n' +
            '\targ1  -  amount\n'
            + '\targ2 -  fee\n'
            + '\n\nExample:\n$ mortgage 1000 5'
    },
    {
        name: 'unmortgage',
        content: 'unmortgage back to balance',
        example: '\n' +
            '\targ1  -  amount\n'
            + '\targ2 -  fee\n'
            + '\n\nExample:\n$ unmortgage 1000 5'
    },
    {
        name: 'vote',
        content: 'vote to candidates',
        example: '\n' +
            '\targ1  -  [candidate1, candidate2]\n'
            + '\targ2 -  fee\n'
            + '\n\nExample:\n$ vote ["13dhmGDEuaoV7QvwbTm4gC6fx7CCRM7VkY","xxx"] 5'
    },
    {
        name: 'getVote',
        content: 'getVote',
        example: '\n'
            + '\n\nExample:\n$ getVote'
    },
    {
        name: 'test',
        content: 'just for test, will be deleted later',
        example: ''
    },
    {
        name: 'testcmd',
        content: 'just for testcmd, will be deleted later',
        example: ''
    },
    {
        name: '----',
        content: '',
        example: ''
    },
    {
        name: 'exit',
        content: 'quit',
        example: ''
    },
    {
        name: 'quit',
        content: 'quit',
        example: ''
    },
    {
        name: 'q',
        content: 'quit',
        example: ''
    }
];
let getMaxCmdWidth = (cmds: any) => {
    let arr: number[] = [];
    CMDS.forEach((item) => {
        arr.push(item.name.length);
    })
    return Math.max(...arr);
}
const showPrompt = () => {
    process.stdout.write(PROMPT);
};
let printHelpHeader = () => {
    console.log('');
    console.log('NAME:');
    console.log('\trfccli - the command line intrface for Shepherd');
    console.log('');
    console.log('\tCopyright 2019');
    console.log('');
    console.log('USAGE:');
    // console.log('\trfccli [options] command [command options] [arguments ...]');
    // console.log('\trfccli [options] ');
    console.log('\t$rfccli --secret xxxxxxxx --host 10.0.0.1 --port 18089')
    console.log('');
    console.log('VERSION:')
    console.log('\t', VERSION);
    console.log('');
};

let printContent = (words: string[], offset: number, cols: number) => {
    let pos = offset;
    words.forEach((word) => {
        if ((pos + word.length) >= cols) {
            console.log('');
            pos = offset;
            process.stdout.write(' '.repeat(offset));
            process.stdout.write(word + ' ');
            pos = pos + word.length + 1;
        } else {
            process.stdout.write(word + ' ');
            pos = pos + word.length + 1;
        }
    })
    console.log('');
};
let printCmd = (cmd: ifCMD, cols: number, width: number) => {
    let widthCmd = width + 5;
    let widthRight = cols - widthCmd - 1;
    let wordsArray = cmd.content.split(' ');

    process.stdout.write(' ' + cmd.name);
    for (let i = 0; i < widthCmd - cmd.name.length - 1; i++) {
        process.stdout.write(' ');
    }
    printContent(wordsArray, widthCmd, cols);
};
let printCmds = (arr: ifCMD[], cols: number, width: number) => {
    arr.forEach((item: ifCMD) => {
        printCmd(item, cols, width);
    })
};
let printHelpList = () => {
    let COLUMNS = process.stdout.columns;
    let maxCmdWidth = getMaxCmdWidth(CMDS);
    // console.log(maxCmdWidth);
    // printHelpHeader();

    console.log(colors.underline("\nCOMMANDS:\n"));
    printCmds(CMDS, COLUMNS!, maxCmdWidth);
}
let printHelp = (args: string[]) => {
    if (args[0]) {
        let index = CMDS.find((item) => {
            return (item.name.toLowerCase() === args[0].toLowerCase());
        });
        if (index) {
            console.log(index.example);
        } else {
            console.log(args[0] + ' not found');
        }
    } else {
        printHelpList();
    }
};
/**
 * Expected args
 *
 * rpchost
 * rpcpost
 * secret
 *
 */
const initArgs = () => {

    printHelpHeader();

    let currentArg = "";

    process.argv.forEach((val, index, array) => {
        // console.log(index + ": " + val);
        if ([0, 1].indexOf(index) !== -1) {
            return;
        }
        let result = val.match(/--(.*)/);
        if (result) {
            currentArg = result[1];

        } else if (Object.keys(SYSINFO).indexOf(currentArg) !== -1) {
            SYSINFO[currentArg] = val;

            currentArg = "";
        } else {
            console.log(colors.red('Wrong arg: ' + val));
            process.exit(1);
        }

    });

    checkArgs(SYSINFO);

    console.log('');
}
let initChainClient = (sysinfo: any) => {
    // chainClient = new NewChainClient({
    //     host: sysinfo.host,
    //     port: sysinfo.port
    // });
    clientHttp = new RPCClient(
        sysinfo.host,
        sysinfo.port
    );
};
let handleResult = (f: (result: IfResult) => void, arg: IfResult) => {
    if (arg.ret === ErrorCode.RESULT_WRONG_ARG || arg.ret === ErrorCode.RESULT_FAILED) {
        console.log(arg.resp);
    }
    else if (arg.ret !== 200 && arg.ret !== ErrorCode.RESULT_OK) {
        console.log(colors.red('No result'));
    } else {// arg.ret === 200
        f(arg);
    }
}
let handleCmd = async (cmd: string) => {
    let words = cmd.replace(/\s+/g, ' ').split(' ');
    // Remove continuous space , or other blank character
    // 

    if (words.length < 1) {
        return;
    }

    const cmd1 = words[0].toLowerCase();

    const args: string[] = words.splice(1, words.length - 1);

    let ctx = {
        client: clientHttp,
        sysinfo: SYSINFO
    }
    let result: any;

    switch (cmd1) {
        case 'info':

            console.log(colors.gray(' host    : ') + SYSINFO.host);
            console.log(colors.gray(' port    : ') + SYSINFO.port);
            console.log(colors.gray(' address : ') + SYSINFO.address);
            console.log(colors.gray(' secret  : ') + SYSINFO.secret);
            break;
        case 'testcmd':
            result = await testcmd(args);
            console.log(result);
            break;
        case 'test':
            console.log('Do some test');
            // result = await getBlock(ctx, args);
            // handleResult(prnGetBlock, result);
            // ctx.client.on();
            break;
        case 'getblock':
            result = await getBlock(ctx, args);
            handleResult(prnGetBlock, result);
            break;
        case 'getbalance':
            result = await getBalance(ctx, args);
            handleResult(prnGetBalance, result);
            break;
        case 'gettokenbalance':
            result = await getTokenBalance(ctx, args);
            handleResult(prnGetTokenBalance, result);
            break;
        case 'getreceipt':
            result = await getReceipt(ctx, args);
            handleResult(prnGetReceipt, result);
            break;
        case 'getstake':
            result = await getStake(ctx, args);
            handleResult(prnGetStake, result);
            break;
        case 'getcandidates':
            result = await getCandidates(ctx, args);
            handleResult(prnGetCandidates, result);
            break;
        case 'getpeers':
            result = await getPeers(ctx, args);
            handleResult(prnGetPeers, result);
            break;
        case 'getminers':
            result = await getMiners(ctx, args);
            handleResult(prnGetMiners, result);
            break;
        case 'transferto':
            result = await transferTo(ctx, args);
            handleResult(prnTransferTo, result);
            break;
        case 'transfertokento':
            result = await transferTokenTo(ctx, args);
            handleResult(prnTransferTokenTo, result);
            break;
        case 'createtoken':
            result = await createToken(ctx, args);
            handleResult(prnCreateToken, result);
            break;
        case 'getnonce':
            result = await getNonce(ctx, args);
            handleResult(prnGetNonce, result);
            break;
        case 'register':
            result = await register(ctx, args);
            handleResult(prnRegister, result);
            break;
        case 'mortgage':
            result = await mortgage(ctx, args);
            handleResult(prnMortgage, result);
            break;
        case 'unmortgage':
            result = await unmortgage(ctx, args);
            handleResult(prnUnmortgage, result);
            break;
        case 'vote':
            result = await vote(ctx, args);
            handleResult(prnVote, result);
            break;
        case 'getvote':
            result = await getVote(ctx, args);
            handleResult(prnGetVote, result);
            break;
        case 'getaddress':
            console.log(SYSINFO.address);
            break;
        case 'createkey':
            let privateKey;

            do {
                privateKey = randomBytes(32);
            } while (!secp256k1.privateKeyVerify(privateKey));

            const pkey = secp256k1.publicKeyCreate(privateKey, true);

            let address = addressFromSecretKey(privateKey);

            console.log(colors.green('address   : '), address);
            console.log(colors.green('public key: '), pkey.toString('hex'));
            console.log(colors.green('secret key: '), privateKey.toString('hex'));
            break;
        case 'help':
            printHelp(args);
            break;
        case 'exit':
            console.log('Bye\n');
            process.exit(0);
            break;
        case 'q':
            console.log('Bye\n');
            process.exit(0);
            break;
        case 'quit':
            console.log('Bye\n');
            process.exit(0);
            break;
        case '':
            break;
        default:
            process.stdout.write(colors.red('Unknown cmds: '));
            console.log(cmd);
            break;
    }

    console.log('');
    showPrompt();
};

//////////////////////////////////////////
keyin.on('line', (cmd: string) => {
    handleCmd(cmd);
})

initArgs();
initChainClient(SYSINFO);
showPrompt();



