#!/usr/bin/env node

/**
* Action according to arg input
*/
//import * as readline from 'readline';
import * as process from 'process';
import * as colors from 'colors';
import * as path from 'path';
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
const prompt = require('prompts-ex');
const keyStore = require('../js/key-store');
import { createLockBancorToken, prnCreateLockBancorToken } from './lib/createLockBancorToken';


const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');
const fs = require('fs');

import { parseTesterJson } from './lib/parsetesterjson';
var pjson = require('../package.json');
import { IfContext } from './lib/common';
import { prnTransferLockBancorTokenTo, transferLockBancorTokenTo } from './lib/transferLockBancorTokenTo';
import { prnGetLockBancorTokenBalance, getLockBancorTokenBalance } from './lib/getLockBancorTokenBalance';
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
import { unregister, prnUnregister } from './lib/unregister';
import { getTicket, prnGetTicket } from './lib/getticket';
import { prnGetBancorTokenBalance, getBancorTokenBalance } from './lib/getBancorTokenBalance';
import { prnTransferBancorTokenTo, transferBancorTokenTo } from './lib/transferBancorTokenTo';
import { createBancorToken, prnCreateBancorToken } from './lib/createBancorToken';
import { buyLockBancorToken, prnBuyLockBancorToken } from './lib/buyLockBancorToken';
import { sellLockBancorToken, prnSellLockBancorToken } from './lib/sellLockBancorToken';
import { getCandidateInfo, prnGetCandidateInfo } from './lib/getCandidateInfo';
import { transferLockBancorTokenToMulti, prnTransferLockBancorTokenToMulti } from './lib/transferLockBancorTokenToMulti';
import { getLockBancorTokenBalances, prnGetLockBancorTokenBalances } from './lib/getLockBancorTokenBalances';

import * as program from 'commander';
import { getNodeInfo, prnGetNodeInfo } from './lib/getNodeInfo';
import { getConnInfo, prnGetConnInfo } from './lib/getConnInfo';
import { getProcessInfo, prnGetProcessInfo } from './lib/getProcessInfo';
import { getContribInfo, prnGetContribInfo } from './lib/getContribInfo';

const VERSION = pjson.version;
const SECRET_TIMEOUT = 5 * 60 * 1000;
const PROMPT = '> ';

let SYSINFO: any = {};
SYSINFO.secret = "";
SYSINFO.host = "";
SYSINFO.port = 18089;
SYSINFO.address = "";
SYSINFO.verbose = false;
SYSINFO.keystore = "";

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


let checkArgs = (SYSINFO: any) => {
    if (SYSINFO.keystore === "") {
        console.log(colors.red("No secret\n"));

        console.log('\tPlease create your own secret with command:\n')
        console.log('\t$rfccli --createKeyStore <keyStore_path> \n')

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
        name: 'getCandidateInfo',
        content: 'get a candidate info ',
        example: '\n'
            + '\n\nExample:\n$ getCandidateInfo 1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J'
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
            + '\targ3  -  contain eventlogs?'
            + '\targ4  -  contain receipts?'
            + '\n\nExample:\n$ getblock 1 false'
    },
    {
        name: 'getBlocks',
        content: 'get Blocks, max number is 20 blocks',
        example: '\n' +
            '\targ1  -  block  min number\n'
            + '\targ2  -  block max number\n'
            + '\targ3  -  contain transactions?'
            + '\targ4  -  contain eventlogs?'
            + '\targ5  -  contain receipts?'
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
            + '\n\nExample:\n$ transferTo 16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg 1000 0.1'
    },
    {
        name: 'transferTokenTo',
        content: 'Transfer Token to some address',
        example:
            '\n\targ1  -  tokenid\n'
            + '\targ2  -  address\n'
            + '\targ3  -  amount\n'
            + '\targ3  -  fee\n'
            + '\n\nExample:\n$ transferTokenTo tokenid 16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg 1000 0.1'
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
            + '\n\n $ setUserCode path 0.1'
    },
    {
        name: 'getUserCode',
        content: 'get user code(!!Experiment)',
        example: '\n'
            + '\targ1 - address (user address)\n'
            + '\n\n$ getUserCode 1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79'
    },
    {
        name: 'runUserMethod',
        content: ' run user method (!!Experiment)',
        example:
            '\n\targs1 - to account address\n'
            + '\targs2 - DApp address\n'
            + '\targs3 - amount the amount send to DApp Address\n'
            + '\targs4 - action to run\n'
            + '\targs5 - params\n'
            + '\n\n$ runUserMethod DAppAddress amount fee action params'
    },
    // {
    //     name: 'createBancorToken',
    //     content: 'create a BancorToken',
    //     example:
    //         '\n\targ1  -  token-name\n'
    //         + '\targ2  -  preBalance\n'
    //         + '\targ3  -  factor (0,1)\n'
    //         + '\targ4  -  nonliquidity\n'
    //         + '\targ5  -  cost\n'
    //         + '\targ6  -  fee\n'
    //         + '\n\ncreatebancortoken token2 [{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000"}] 0.5 10000000000 100 0.1'
    // },
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
    // {
    //     name: 'getBancorTokenBalance',
    //     content: 'get BancorToken balance under address',
    //     example: '\ngetBancorTokenbalance\n'
    //         + '\targ1  -  tokenid:string\n'
    //         + '\targ2  -  address:string\n'
    //         + 'Example:\n'
    //         + '\t$ getBancorTokenBalance tokenid 1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J'
    // },
    {
        name: 'createBancorToken',
        content: 'create a BancorToken; time_expiration minutes after which lock_amount will be freed',
        example:
            '\n\targ1  -  token-name\n'
            + '\targ2  -  preBalance\n'
            + '\targ3  -  factor (0,1)\n'
            + '\targ4  -  nonliquidity\n'
            + '\targ5  -  cost\n'
            + '\targ6  -  fee\n'
            + '\n\ncreatebancortoken token2 [{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000", "lock_amount":"1000","time_expiration":"240"},{"address":"16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg","amount":"10000", "lock_amount":"0","time_expiration":"0"}]  0.5 0 100 0.1'
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
        name: 'transferBancorTokenToMulti',
        content: 'transfer BancorToken to multi address',
        example:
            '\n\targ1  -  token-name\n'
            + '\targ2  -  preBalances | airdrop.json\n'
            + '\targ3  -  fee\n'
            + '\n\ntransferBancorTokenToMulti token2 [{"address":"16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg","amount":"10000"},{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"100"}] 0.1'
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
        content: 'sell LockBancorToken',
        example: '\nsellBancorToken\n'
            + '\targ1  -  tokenid\n'
            + '\targ2  -  amount\n'
            + '\targ3  -  fee\n'
            + 'Example:\n'
            + '\t$ sellBancorToken tokenid amount fee'
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
    // {
    //     name: 'getBancorTokenBalances',
    //     content: 'get BancorToken balances under address',
    //     example: '\ngetBancorTokenbalances\n'
    //         + '\targ1  -  tokenid:string\n'
    //         + '\targ2  -  [address]:string[]\n'
    //         + 'Example:\n'
    //         + '\t$ getBancorTokenBalances tokenid ["1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J"]'
    // },
    // {
    //     name: 'buyBancorToken',
    //     content: 'buy BancorToken',
    //     example: '\nbuyBancorToken\n'
    //         + '\targ1  -  tokenid\n'
    //         + '\targ2  -  cost\n'
    //         + '\targ3  -  fee\n'
    //         + 'Example:\n'
    //         + '\t$ buyBancorToken tokenid cost fee'
    // },
    // {
    //     name: 'sellBancorToken',
    //     content: 'sell BancorToken',
    //     example: '\nsellBancorToken\n'
    //         + '\targ1  -  tokenid\n'
    //         + '\targ2  -  amount\n'
    //         + '\targ3  -  fee\n'
    //         + 'Example:\n'
    //         + '\t$ sellBancorToken tokenid amount fee'
    // },
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
        content: 'register to be a candidate with caller\'s address, you should have at least 300000 SYS',
        example: '\n' +
            '\targ1  -  amount\n' +
            '\targ2  -  name\n' +
            '\targ3  -  ip\n' +
            '\targ4  -  url\n' +
            '\targ5  -  location\n' +
            '\targ6  -  fee\n'
            + '\n\nExample:\n$ register 3000000 node-test 10.23.23.103 http://bigboss.com Shanghai 0.1'
    },
    {
        name: 'unregister',
        content: 'unregister, not to be a candidate any more, with caller\'s own address. Can not unregister other address',
        example: '\n' +
            '\targ1  -  address\n' +
            '\targ2  -  fee\n'
            + '\n\nExample:\n$ unregister 154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r 0.1'
    },
    {
        name: 'freeze',
        content: 'freeze some balance, so you can vote for candidates',
        example: '\n' +
            '\targ1  -  amount\n' +
            '\targ2  -  fee\n'
            + '\n\nExample:\n$ freeze 1000 0.1'
    },
    {
        name: 'mortgage',
        content: 'mortgage some balance, so you can vote for candidates',
        example: '\n' +
            '\targ1  -  amount\n' +
            '\targ2  -  fee\n'
            + '\n\nExample:\n$ mortgage 1000 0.1'
    },
    {
        name: 'unfreeze',
        content: 'unfreeze back to balance',
        example: '\n' +
            '\targ1  -  amount\n' +
            '\targ2  -  fee\n'
            + '\n\nExample:\n$ unfreeze 1000 0.1'
    },
    {
        name: 'unmortgage',
        content: 'unmortgage back to balance',
        example: '\n' +
            '\targ1  -  amount\n' +
            '\targ2  -  fee\n'
            + '\n\nExample:\n$ unmortgage 1000 0.1'
    },
    {
        name: 'vote',
        content: 'vote to candidates',
        example: '\n' +
            '\targ1  -  [candidate1, candidate2]\n' +
            '\targ2  -  fee\n'
            + '\n\nExample:\n$ vote ["13dhmGDEuaoV7QvwbTm4gC6fx7CCRM7VkY","xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"] 0.1'
    },
    {
        name: 'getVote',
        content: 'getVote',
        example: '\n'
            + '\n\nExample:\n$ getVote'
    },
    {
        name: 'getTicket',
        content: 'getTicket',
        example: '\n'
            + '\targ1 - [address]\n'
            + '\n\nExample:\n$ getTicket 13dhmGDEuaoV7QvwbTm4gC6fx7CCRM7VkY'
    },
    {
        name: 'getUserTable',
        content: 'get value from user table',
        example: '\n' +
            '\targ1 - contractAddress\n'
            + '\targ2 - table name\n'
            + '\targ3 - key name\n'
            + '\n\n$ getUserTable contractaddress table key'
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
        name: 'getNodeInfo',
        content: 'getNodeInfo',
        example: ''
    },
    {
        name: 'getConnInfo',
        content: 'getConnInfo',
        example: ''
    },
    {
        name: 'getProcessInfo',
        content: 'getProcessInfo',
        example: '\n'
            + '\targ1 - [index, 0~23] \n'
            + '\n\nExample:\n$ getProcessInfo 0'
    },
    {
        name: 'getContribInfo',
        content: 'getContribInfo',
        example: '\n'
            + '\targ1 - [index, 0~23] \n'
            + '\n\nExample:\n$ getContribInfo 0'
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
        name: 'unlock',
        content: 'unlock the keyStore',
        example: '\n' +
            '\t[arg1] - timeout (0 to disable)'
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
    console.log('\t$rfccli --keyStore xxxxxxxx --host 10.0.0.1 --port 18089 [-v|--verbose]')
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

async function genKeyStore(keyFile: string, secretKey: string | null) {
    const response = await prompt({
        type: 'password',
        name: 'secret',
        message: 'password',
        validate: (value: string) => value.length < 8 ? 'password length must >= 8' : true
    });

    let privateKey;

    if (secretKey) {
        privateKey = Buffer.from(secretKey, 'hex');
    } else {
        do {
            privateKey = randomBytes(32);
        } while (!secp256k1.privateKeyVerify(privateKey));
    }

    const pkey = secp256k1.publicKeyCreate(privateKey, true);

    let address = addressFromSecretKey(privateKey);

    let keyJson = keyStore.toV3Keystore(privateKey.toString('hex'), address, response.secret);

    let keyPath;

    if (path.isAbsolute(keyFile)) {
        keyPath = keyFile;
    } else {
        keyPath = path.join(process.cwd(), keyFile);
    }

    fs.writeFileSync(keyPath, JSON.stringify(keyJson, null, 4));

    //console.log('openkeyb', keyStore.fromV3Keystore(keyJson, response.secret));
}
/**
 * Expected args
 *
 * rpchost
 * rpcpost
 * secret
 *
 */
const initArgs = async () => {

    // console.log(process.argv);
    // console.log(process.argv.length);

    // console.log('****************');
    program
        .version('2.1.0')
        .option('-v, --verbose', 'Enable Verbose log output')
        .option('-s, --secret <value>', 'secret key')
        .option('-h, --host <value>', 'host address')
        .option('-p, --port <value>', 'host port')
        .option('--createKey', 'createKey')
        .option('--keyStore <value>', 'key store file')
        .option('--createKeyStore <value>', 'create key store')
        .parse(process.argv);

    if (program.verbose) {
        SYSINFO['verbose'] = true;
    }

    if (program.createKey) {
        createKey();
        process.exit(0);
    }

    const outKeyFile = program.createKeyStore;
    if (outKeyFile) {
        await genKeyStore(outKeyFile, program.secret);
        process.exit(0);
    }

    const keyStoreFile = program.keyStore;
    if (keyStoreFile) {
        let keyPath = keyStoreFile;
        if (!path.isAbsolute(keyStoreFile)) {
            keyPath = path.join(process.cwd(), keyStoreFile);
        }
        if (!fs.existsSync(keyPath)) {
            console.log(`keystore file ${keyPath} not exist`);
            process.exit(1);
        }
        SYSINFO['keystore'] = fs.readFileSync(keyPath).toString();
        try {
            let info = JSON.parse(SYSINFO['keystore']);
            SYSINFO['address'] = info.address;
        } catch (err) {
            console.log('invalid keystore file');
            process.exit(1);
        }
    }

    if (program.host) {
        SYSINFO['host'] = program.host;
    }

    if (program.port) {
        SYSINFO['port'] = program.port;
    }

    printHelpHeader();

    let currentArg = "";

    checkArgs(SYSINFO);

    console.log('');
}

let unlockTimer: NodeJS.Timer | any;

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
        case 'getcandidateinfo':
            result = await getCandidateInfo(ctx, args);
            handleResult(prnGetCandidateInfo, ctx, result);
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
        // case 'createbancortoken':
        //     result = await createBancorToken(ctx, args);
        //     handleResult(prnCreateBancorToken, ctx, result);
        //     break;
        case 'createbancortoken':
            result = await createLockBancorToken(ctx, args);
            handleResult(prnCreateLockBancorToken, ctx, result);
            break;
        // case 'transferbancortokento':
        //     result = await transferBancorTokenTo(ctx, args);
        //     handleResult(prnTransferBancorTokenTo, ctx, result);
        //     break;
        case 'transferbancortokento':
            result = await transferLockBancorTokenTo(ctx, args);
            handleResult(prnTransferLockBancorTokenTo, ctx, result);
            break;
        case 'transferbancortokentomulti':
            result = await transferLockBancorTokenToMulti(ctx, args);
            handleResult(prnTransferLockBancorTokenToMulti, ctx, result);
            break;
        // case 'getbancortokenbalance':
        //     result = await getBancorTokenBalance(ctx, args);
        //     handleResult(prnGetBancorTokenBalance, ctx, result);
        //     break;
        case 'getbancortokenbalance':
            result = await getLockBancorTokenBalance(ctx, args);
            handleResult(prnGetLockBancorTokenBalance, ctx, result);
            break;
        case 'getbancortokenbalances':
            result = await getLockBancorTokenBalances(ctx, args);
            handleResult(prnGetLockBancorTokenBalances, ctx, result);
            break;
        // case 'getbancortokenbalances':
        //     result = await getBancorTokenBalances(ctx, args);
        //     handleResult(prnGetBancorTokenBalances, ctx, result);
        //     break;
        // case 'buybancortoken':
        //     result = await buyBancorToken(ctx, args);
        //     handleResult(prnBuyBancorToken, ctx, result);
        //     break;
        case 'buybancortoken':
            result = await buyLockBancorToken(ctx, args);
            handleResult(prnBuyLockBancorToken, ctx, result);
            break;
        // case 'sellbancortoken':
        //     result = await sellBancorToken(ctx, args);
        //     handleResult(prnSellBancorToken, ctx, result);
        //     break;
        case 'sellbancortoken':
            result = await sellLockBancorToken(ctx, args);
            handleResult(prnSellLockBancorToken, ctx, result);
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
        case 'unregister':
            handleResult(prnUnregister, ctx, await unregister(ctx, args));
            break;
        case 'freeze':
            result = await mortgage(ctx, args);
            handleResult(prnMortgage, ctx, result);
            break;
        case 'unfreeze':
            result = await unmortgage(ctx, args);
            handleResult(prnUnmortgage, ctx, result);
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
        case 'getticket':
            result = await getTicket(ctx, args);
            handleResult(prnGetTicket, ctx, result);
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
        case 'getnodeinfo':
            result = await getNodeInfo(ctx, args);
            handleResult(prnGetNodeInfo, ctx, result);
            break;
        case 'getconninfo':
            result = await getConnInfo(ctx, args);
            handleResult(prnGetConnInfo, ctx, result);
            break;
        case 'getprocessinfo':
            result = await getProcessInfo(ctx, args);
            handleResult(prnGetProcessInfo, ctx, result);
            break;
        case 'getcontribinfo':
            result = await getContribInfo(ctx, args);
            handleResult(prnGetContribInfo, ctx, result);
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
        case 'unlock':
            let ts;
            if (args.length >= 1) {
                ts = parseInt(args[0]) * 1000;
            }

            if (ts === undefined) {
                ts = SECRET_TIMEOUT;
            }
            if (SYSINFO['keystore'].length > 0) {
                const response = await prompt({
                    type: 'password',
                    name: 'secret',
                    message: 'password',
                    validate: (value: string) => value.length < 8 ? 'password length must >= 8' : true
                });

                try {
                    if (response.secret) {
                        SYSINFO['secret'] = keyStore.fromV3Keystore(SYSINFO['keystore'], response.secret);
                        SYSINFO['address'] = addressFromSecretKey(SYSINFO['secret']);
                        if (ts && ts > 0) {
                            if (SYSINFO.verbose) {
                                console.log(`in set timeout ts is ${ts} ms`);
                            }
                            if (unlockTimer) {
                                clearTimeout(unlockTimer);
                            }
                            unlockTimer = setTimeout(() => {
                                if (SYSINFO.verbose) {
                                    console.log('unlock timer tiggered');
                                }
                                SYSINFO['secret'] = null;
                            }, ts);
                        } else {
                            if (unlockTimer) {
                                if (SYSINFO.verbose) {
                                    console.log('clear unlock timer');
                                }
                                clearTimeout(unlockTimer);
                                unlockTimer = null;
                            }
                        }
                    }
                } catch (err) {
                    console.log('invalid passwd');
                }
            }
            break;
        case '':
            break;
        default:
            process.stdout.write(colors.red('Unknown cmds: '));
            console.log(cmd);
            break;
    }
};

//////////////////////////////////////////

async function main() {

    let ret = await initArgs();
    initChainClient(SYSINFO);

    while (1) {
        const onCancel = (prompt: any) => {
            console.log('exit rfccli');
            process.exit(1);
        }
        const response = await prompt([{
            type: 'textex',
            name: 'cmd',
            message: '>'
        }], { onCancel });

        if (response.cmd) {
            await handleCmd(response.cmd);
        }
    }
}

main();
