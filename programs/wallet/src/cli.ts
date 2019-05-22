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

import { IfResult, IfSysinfo } from './lib/common';
import { ErrorCode } from './core/error_code';
import { getBlock, prnGetBlock } from './lib/getblock';
import { getBalance, prnGetBalance } from './lib/getbalance';
import { createToken, prnCreateToken } from './lib/createtoken';
import { setUserCode, prnSetUserCode } from './lib/setusercode';
import { getUserCode, prnGetUserCode } from './lib/getusercode';
import { runUserMethod, prnRunUserMethod } from './lib/runusermethod';
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
import { getUserTable, prnGetUserTable } from './lib/getusertable';
import { createBancorToken, prnCreateBancorToken } from './lib/createBancorToken';

const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');
const fs = require('fs');

import { parseTesterJson } from './lib/parsetesterjson';
var pjson = require('../package.json');
import { IfContext } from './lib/common';
import { transferBancorTokenTo, prnTransferBancorTokenTo } from './lib/transferBancorTokenTo';
import { getBancorTokenBalance, prnGetBancorTokenBalance } from './lib/getBancorTokenBalance';
import { buyBancorToken, prnBuyBancorToken } from './lib/buyBancorToken';
import { sellBancorToken, prnSellBancorToken } from './lib/sellBancorToken';
import { getBancorTokenFactor, prnGetBancorTokenFactor } from './lib/getBancorTokenFactor';
import { getBancorTokenReserve, prnGetBancorTokenReserve } from './lib/getBancorTokenReserve';
import { getBancorTokenSupply, prnGetBancorTokenSupply } from './lib/getBancorTokenSupply';
import { getZeroBalance, prnGetZeroBalance } from './lib/getZeroBalance';
import { getLastIrreversibleBlockNumber, prnGetLastIrreversibleBlockNumber } from './lib/getLIBNumber';
import { getBalances, prnGetBalances } from './lib/getbalances';
import { getTokenBalances, prnGetTokenBalances } from './lib/getTokenBalances';
import { getBancorTokenBalances, prnGetBancorTokenBalances } from './lib/getBancorTokenBalances';
import { getBancorTokenParams, prnGetBancorTokenParams } from './lib/getBancorTokenParams';
import { getBlocks, prnGetBlocks } from './lib/getblocks';

const VERSION = pjson.version;
const PROMPT = '> ';

let SYSINFO: any = {};
SYSINFO.secret = "";
SYSINFO.host = "";
SYSINFO.port = "";
SYSINFO.address = "";
SYSINFO.verbose = false;



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

        console.log('\tPlease create your own secret with command:\n')
        console.log('\t$rfccli createkey\n')

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

    if (SYSINFO.verbose === "1") {
        // open log print
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
        name: 'getBalances',
        content: 'get balances under address',
        example: '\ngetbalances\n'
            + '\targ  -  [address]:string[]\n'
            + 'Example:\n'
            + '\t$ getbalances ["1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J"]'
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
        name: 'getTokenBalances',
        content: 'get Token balances under address',
        example: '\ngetTokenbalances\n'
            + '\targ1  -  tokenid:string\n'
            + '\targ2  -  [address]:string[]\n'
            + 'Example:\n'
            + '\t$ getTokenBalances tokenid ["1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J"]'
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
        name: 'getLIBNumber',
        content: 'get last irreversible block number ',
        example: '\n'
            + '\n\nExample:\n$ getLibNumber'
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
        name: 'getBlocks',
        content: 'get Blocks, max number is 20 blocks',
        example: '\n' +
            '\targ1  -  block  min number\n'
            + '\targ2  -  block max number\n'
            + '\targ3  -  contain transactions?'
            + '\n\nExample:\n$ getblocks 1 10 false'
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
            + '\targ3  -  precision\n'
            + '\targ4  -  fee\n'
            + '\n\ncreatetoken token2 [{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000"}] 9 0.1'
    },
    {
        name: 'setUserCode',
        content: 'set user code (!!Experiment)',
        example:
            '\n\targs1 - user code path\n'
            + '\targs2 - fee\n'
    },
    {
        name: 'getUserCode',
        content: 'get user code(!!Experiment)',
        example: '\n'
            + '\n\nExample:\n$ getUserCode'
    },
    {
        name: 'runUserMethod',
        content: ' run user method (!!Experiment)',
        example:
            '\n\targs1 - to account address\n'
            + '\targs2 - amount systoken to send to account address\n'
            + '\targs3 - fee\n'
            + '\targs4 - action to run\n'
            + '\targs5 - params\n'
    },
    {
        name: 'createBancorToken',
        content: 'create a BancorToken',
        example:
            '\n\targ1  -  token-name\n'
            + '\targ2  -  preBalance\n'
            + '\targ3  -  factor (0,1)\n'
            + '\targ4  -  nonliquidity\n'
            + '\targ5  -  cost\n'
            + '\targ6  -  fee\n'
            + '\n\ncreatebancortoken token2 [{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000"}] 0.5 10000000000 100 0.1'
    },
    {
        name: 'transferBancorTokenTo',
        content: 'transfer BancorToken to address',
        example:
            '\n\targ1  -  token-name\n'
            + '\targ2  -  address\n'
            + '\targ3  -  amount\n'
            + '\targ4  -  fee\n'
            + '\n\ntransferBancorTokenTo token2 1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79 1000 0.1'
    },
    {
        name: 'getBancorTokenBalance',
        content: 'get BancorToken balance under address',
        example: '\ngetBancorTokenbalance\n'
            + '\targ1  -  tokenid:string\n'
            + '\targ2  -  address:string\n'
            + 'Example:\n'
            + '\t$ getBancorTokenBalance tokenid 1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J'
    },
    {
        name: 'getBancorTokenBalances',
        content: 'get BancorToken balances under address',
        example: '\ngetBancorTokenbalances\n'
            + '\targ1  -  tokenid:string\n'
            + '\targ2  -  [address]:string[]\n'
            + 'Example:\n'
            + '\t$ getBancorTokenBalances tokenid ["1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J"]'
    },
    {
        name: 'buyBancorToken',
        content: 'buy BancorToken',
        example: '\nbuyBancorToken\n'
            + '\targ1  -  tokenid\n'
            + '\targ2  -  cost\n'
            + '\targ3  -  fee\n'
            + 'Example:\n'
            + '\t$ buyBancorToken tokenid cost fee'
    },
    {
        name: 'sellBancorToken',
        content: 'sell BancorToken',
        example: '\nsellBancorToken\n'
            + '\targ1  -  tokenid\n'
            + '\targ2  -  amount\n'
            + '\targ3  -  fee\n'
            + 'Example:\n'
            + '\t$ sellBancorToken tokenid amount fee'
    },
    {
        name: 'getBancorTokenFactor',
        content: 'get BancorToken factor',
        example: '\ngetBancorTokenFactor\n'
            + '\targ1  -  tokenid:string\n'
            + 'Example:\n'
            + '\t$ getBancorTokenFactor tokenid '
    },
    {
        name: 'getBancorTokenReserve',
        content: 'get BancorToken reserve',
        example: '\ngetBancorTokenReserve\n'
            + '\targ1  -  tokenid:string\n'
            + 'Example:\n'
            + '\t$ getBancorTokenReserve tokenid '
    },
    {
        name: 'getBancorTokenSupply',
        content: 'get BancorToken supply',
        example: '\ngetBancorTokenSupply\n'
            + '\targ1  -  tokenid:string\n'
            + 'Example:\n'
            + '\t$ getBancorTokenSupply tokenid '
    },
    {
        name: 'getBancorTokenParams',
        content: 'get BancorToken params',
        example: '\ngetBancorTokenParams\n'
            + '\targ1  -  tokenid:string\n'
            + 'Example:\n'
            + '\t$ getBancorTokenParams tokenid '
    },
    {
        name: 'getZeroBalance',
        content: 'get Zero account balance',
        example: '\ngetZeroBalance\n'
            + 'Example:\n'
            + '\t$ getZeroBalance '
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
            + '\n\nExample:\n$ register 0.001'
    },
    {
        name: 'mortgage',
        content: 'mortgage some balance, so you can vote for candidates',
        example: '\n' +
            '\targ1  -  amount\n'
            + '\n\nExample:\n$ mortgage 1000'
    },
    {
        name: 'unmortgage',
        content: 'unmortgage back to balance',
        example: '\n' +
            '\targ1  -  amount\n'
            + '\n\nExample:\n$ unmortgage 1000'
    },
    {
        name: 'vote',
        content: 'vote to candidates',
        example: '\n' +
            '\targ1  -  [candidate1, candidate2]\n'
            + '\targ2 -  fee\n'
            + '\n\nExample:\n$ vote ["13dhmGDEuaoV7QvwbTm4gC6fx7CCRM7VkY","xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"] 0.001'
    },
    {
        name: 'getVote',
        content: 'getVote',
        example: '\n'
            + '\n\nExample:\n$ getVote'
    },
    {
        name: 'getUserTable',
        content: 'get value from user table',
        example: '\n' +
            '\targ1 - contractName\n'
            + '\targ2 - table name\n'
            + '\targ3 - key name\n'
    },
    {
        name: 'sendToTesters',
        content: 'Send token according to prebalance json file',
        example: '\n'
            + '\n\nExample:\n$ sendToTesters'
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
    console.log('\t$rfccli --secret xxxxxxxx --host 10.0.0.1 --port 18089 [--v|--verbose]')
    console.log('');
    console.log('VERSION:')
    console.log('\t', VERSION);
    console.log('');
    // console.log('To create a secret key pair: $rfccli createkey');
    console.log('')
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
let createKey = function () {
    let privateKey;

    do {
        privateKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey));

    const pkey = secp256k1.publicKeyCreate(privateKey, true);

    let address = addressFromSecretKey(privateKey);

    console.log('');
    console.log(colors.green('address   : '), address);
    console.log(colors.green('public key: '), pkey.toString('hex'));
    console.log(colors.green('secret key: '), privateKey.toString('hex'));
    console.log('');
}
/**
 * Expected args
 *
 * rpchost
 * rpcpost
 * secret
 *
 */
const initArgs = () => {

    // console.log(process.argv);
    // console.log(process.argv.length);

    // console.log('****************');

    if (process.argv.length === 3 && process.argv[2].toLowerCase() === 'createkey') {
        createKey();
        process.exit(0);
    }

    printHelpHeader();

    let currentArg = "";

    process.argv.forEach((val, index, array) => {
        // console.log(index + ": " + val);
        if ([0, 1].indexOf(index) !== -1) {
            return;
        }
        let result = val.match(/--(.*)/);

        if (result) {
            if (result[1].toLowerCase() === 'v'
                || result[1].toLowerCase() === 'verbose') {
                SYSINFO['verbose'] = true;
            } else {
                currentArg = result[1];
            }


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
        sysinfo.port,
        SYSINFO
    );
};
let handleResult = (f: (ctx: IfContext, result: IfResult) => void, ctx: IfContext, arg: IfResult) => {
    if (arg.ret === ErrorCode.RESULT_WRONG_ARG || arg.ret === ErrorCode.RESULT_FAILED) {
        console.log(arg.resp);
    }
    else if (arg.ret !== 200 && arg.ret !== ErrorCode.RESULT_OK) {
        console.log(colors.red('No result'));
    } else {// arg.ret === 200
        f(ctx, arg);
    }
}
let handleCmd = async (cmd: string) => {

    // Remove continuous space , or other blank characte
    let words = cmd.replace(/\s+/g, ' ').split(' ');
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
            handleResult(prnGetBlock, ctx, result);
            break
        case 'getblocks':
            result = await getBlocks(ctx, args);
            handleResult(prnGetBlocks, ctx, result);
            break;
        case 'getbalance':
            result = await getBalance(ctx, args);
            handleResult(prnGetBalance, ctx, result);
            break;
        case 'getbalances':
            result = await getBalances(ctx, args);
            handleResult(prnGetBalances, ctx, result);
            break;
        case 'gettokenbalance':
            result = await getTokenBalance(ctx, args);
            handleResult(prnGetTokenBalance, ctx, result);
            break;
        case 'gettokenbalances':
            result = await getTokenBalances(ctx, args);
            handleResult(prnGetTokenBalances, ctx, result);
            break;
        case 'getreceipt':
            result = await getReceipt(ctx, args);
            handleResult(prnGetReceipt, ctx, result);
            break;
        case 'getstake':
            result = await getStake(ctx, args);
            handleResult(prnGetStake, ctx, result);
            break;
        case 'getcandidates':
            result = await getCandidates(ctx, args);
            handleResult(prnGetCandidates, ctx, result);
            break;
        case 'getpeers':
            result = await getPeers(ctx, args);
            handleResult(prnGetPeers, ctx, result);
            break;
        case 'getlibnumber':
            result = await getLastIrreversibleBlockNumber(ctx, args);
            handleResult(prnGetLastIrreversibleBlockNumber, ctx, result);
            break;
        case 'getminers':
            result = await getMiners(ctx, args);
            handleResult(prnGetMiners, ctx, result);
            break;
        case 'transferto':
            result = await transferTo(ctx, args);
            handleResult(prnTransferTo, ctx, result);
            break;
        case 'transfertokento':
            result = await transferTokenTo(ctx, args);
            handleResult(prnTransferTokenTo, ctx, result);
            break;
        case 'createtoken':
            result = await createToken(ctx, args);
            handleResult(prnCreateToken, ctx, result);
            break;
        case 'createbancortoken':
            result = await createBancorToken(ctx, args);
            handleResult(prnCreateBancorToken, ctx, result);
            break;
        case 'transferbancortokento':
            result = await transferBancorTokenTo(ctx, args);
            handleResult(prnTransferBancorTokenTo, ctx, result);
            break;
        case 'getbancortokenbalance':
            result = await getBancorTokenBalance(ctx, args);
            handleResult(prnGetBancorTokenBalance, ctx, result);
            break;
        case 'getbancortokenbalances':
            result = await getBancorTokenBalances(ctx, args);
            handleResult(prnGetBancorTokenBalances, ctx, result);
            break;
        case 'buybancortoken':
            result = await buyBancorToken(ctx, args);
            handleResult(prnBuyBancorToken, ctx, result);
            break;
        case 'sellbancortoken':
            result = await sellBancorToken(ctx, args);
            handleResult(prnSellBancorToken, ctx, result);
            break;
        case 'getbancortokenfactor':
            result = await getBancorTokenFactor(ctx, args);
            handleResult(prnGetBancorTokenFactor, ctx, result);
            break;
        case 'getbancortokenreserve':
            result = await getBancorTokenReserve(ctx, args);
            handleResult(prnGetBancorTokenReserve, ctx, result);
            break;
        case 'getbancortokensupply':
            result = await getBancorTokenSupply(ctx, args);
            handleResult(prnGetBancorTokenSupply, ctx, result);
            break;
        case 'getbancortokenparams':
            result = await getBancorTokenParams(ctx, args);
            handleResult(prnGetBancorTokenParams, ctx, result);
            break;
        case 'getzerobalance':
            result = await getZeroBalance(ctx, args);
            handleResult(prnGetZeroBalance, ctx, result);
            break;

        case 'getnonce':
            result = await getNonce(ctx, args);
            handleResult(prnGetNonce, ctx, result);
            break;
        case 'register':
            result = await register(ctx, args);
            handleResult(prnRegister, ctx, result);
            break;
        case 'mortgage':
            result = await mortgage(ctx, args);
            handleResult(prnMortgage, ctx, result);
            break;
        case 'unmortgage':
            result = await unmortgage(ctx, args);
            handleResult(prnUnmortgage, ctx, result);
            break;
        case 'vote':
            result = await vote(ctx, args);
            handleResult(prnVote, ctx, result);
            break;
        case 'getvote':
            result = await getVote(ctx, args);
            handleResult(prnGetVote, ctx, result);
            break;
        case 'getusertable':
            result = await getUserTable(ctx, args);
            handleResult(prnGetUserTable, ctx, result);
            break;
        case 'getaddress':
            console.log(SYSINFO.address);
            break;
        case 'createkey':
            createKey();
            break;
        case 'sendtotesters':
            let text = fs.readFileSync('./data/tester.json');

            if (!text) {
                console.log("Can not fetch tester.json");
            } else {
                let obj;
                // console.log(text.toString());
                try {
                    obj = JSON.parse(text);
                } catch (e) {
                    console.log(e);
                }
                await parseTesterJson(ctx, obj);
            }

            break;
        case 'setusercode':
            result = await setUserCode(ctx, args);
            handleResult(prnSetUserCode, ctx, result);
            break;
        case 'getusercode':
            result = await getUserCode(ctx, args);
            handleResult(prnGetUserCode, ctx, result);
            break;
        case 'runusermethod':
            result = await runUserMethod(ctx, args);
            handleResult(prnRunUserMethod, ctx, result);
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



