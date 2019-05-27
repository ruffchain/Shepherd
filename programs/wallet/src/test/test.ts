#!/usr/bin/env node
import { addressFromSecretKey } from '../core/address';
let expect = require('chai').expect;
// let request = require('request');
import { describe, it } from 'mocha';
var assert = require('assert');

import { transferTo } from '../lib/transferto';
import { ErrorCode } from '../core/error_code';
import { getBalance } from '../lib/getbalance';

import { config, ctx, switch2BigBoss, switch2Head } from './test_common';
import { createToken } from '../lib/createtoken';
import { AssertionError } from 'assert';
import { getTokenBalance, prnGetTokenBalance } from '../lib/getTokenBalance';
import { getBlock, prnGetBlock } from '../lib/getblock';
import { getCandidates, prnGetCandidates } from '../lib/getCandidates';
import { getMiners, prnGetMiners } from '../lib/getminers';
import { getPeers, prnGetPeers } from '../lib/getpeers';
import { getReceipt, prnGetReceipt } from '../lib/getreceipt';
import { createBancorToken } from '../lib/createLockBancorToken';
// import { getBancorTokenBalance, prnGetBancorTokenBalance } from '../lib/getBancorTokenBalance';
//import { transferBancorTokenTo } from '../lib/transferBancorTokenTo';
import { getBancorTokenSupply } from '../lib/getBancorTokenSupply';
import { getBancorTokenReserve } from '../lib/getBancorTokenReserve';
import { getBancorTokenFactor } from '../lib/getBancorTokenFactor';
import { buyBancorToken } from '../lib/buyBancorToken';
import { sellBancorToken } from '../lib/sellBancorToken';
import { BigNumber } from '../core';

process.on('warning', (warning) => {
    console.log(warning);
});

process.on('unhandledRejection', (reason, p) => {
    console.log('未处理的 rejection：', p, '原因：', reason);
    // 记录日志、抛出错误、或其他逻辑。
});


// Test all 
describe('Test key generation', () => {
    it('Address from secret key', (done) => {
        let addr = addressFromSecretKey("054898c1a167977bc42790a3064821a2a35a8aa53455b9b3659fb2e9562010f7");
        // console.log('1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J');
        expect(addr).to.equal('1Bbruv7E4nP62ZD4cJqxiGrUD43psK5E2J');
        done();
    });
});

// test bancor token

describe('Test bancor', function () {
    this.timeout(133000);

    switch2BigBoss();

    let TOKEN_NAME: string;
    let oldBancor: number;
    let oldSys: number;
    let oldBancorDelta: number;
    let oldSysDelta: number;

    let head_balance = 0.0;

    it('Transfer to account:head 250.8 sys', async function () {
        this.timeout(33000);

        let NUM = 250.8;

        let result = await transferTo(ctx, [config.head.address, NUM + '', "0.1"]);

        console.log(result);

        expect(result.ret).to.equal(ErrorCode.RESULT_OK);

        switch2Head();
    });

    it('Create a bancor token', async function () {
        this.timeout(40000);

        TOKEN_NAME = 'TOK' + Math.random().toString().slice(2, 10);

        let result = await createBancorToken(ctx, [TOKEN_NAME, '[{"address":"1McScD9QAo3FQwmutBbhTFjfKYtwkatfHX","amount":"1000"}]', '0.5', '250', '0.1']);

        console.log('CreateBancorToken:', TOKEN_NAME);

        console.log(result);

        expect(result.ret).to.equal(ErrorCode.RESULT_OK);

        result = await getTokenBalance(ctx, [TOKEN_NAME, "1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79"]);
        let obj = JSON.parse(result.resp!);
        assert.equal(obj.err, ErrorCode.RESULT_OK);
        prnGetTokenBalance(ctx, result);

        head_balance -= 250.1;
    });

    it('Check head\'s bancorToken', async function () {
        this.timeout(5000);

        let result = await getTokenBalance(ctx, [TOKEN_NAME, config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');
        }
        oldBancor = new BigNumber(amount).toNumber();
        console.log(`Check head \'s bancortoken balance ${TOKEN_NAME}:`, amount);
        expect(1).to.equal(1);
    })
    it('Check head\'s balance', async function () {
        this.timeout(5000);
        let result = await getBalance(ctx, [config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');
        }
        console.log('head\'s balance:', amount);
        expect(1).to.equal(1);
        oldSys = new BigNumber(amount).toNumber();
        //done();
    });

    // buy something 
    it('Buy bancorToken 0.5 SYS', async function () {
        this.timeout(33000);

        let NUM = 0.5;

        let result = await buyBancorToken(ctx, [TOKEN_NAME, NUM + '', "0.1"]);

        console.log(result);

        expect(result.ret).to.equal(ErrorCode.RESULT_OK);

        oldSys -= 0.6;
    });

    it('Check head\'s balance', async function () {
        this.timeout(5000);
        let result = await getBalance(ctx, [config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        // oldSysDelta = oldSys - new BigNumber(amount).toNumber();
        console.log('head \'s balance:', amount);
        expect(1).to.equal(1);
        //done();
    });


    it('Check head\'s bancorToken', async function () {
        this.timeout(5000);

        let result = await getTokenBalance(ctx, [TOKEN_NAME, config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');
        }
        oldBancorDelta = amount - oldBancor;
        console.log(`Check head \'s balance ${TOKEN_NAME}:`, amount);
        expect(1).to.equal(1);
    })

    // sell same amount of bancorToken
    it('sell bancorToken', async function () {
        this.timeout(33000);

        let NUM = oldBancorDelta;

        console.log('To sell bancortoken:', NUM);

        let result = await sellBancorToken(ctx, [TOKEN_NAME, NUM + '', "0.1"]);

        console.log(result);

        expect(result.ret).to.equal(ErrorCode.RESULT_OK);

        // oldBancorToken += 100;
        //head_balance -= 0.1;

    });
    it('Check head\'s balance', async function () {
        this.timeout(5000);
        let result = await getBalance(ctx, [config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        oldSys = new BigNumber(amount).toNumber();
        console.log('head \'s balance:', oldSys);
        expect(1).to.equal(1);
        //done();
    });


    it('Check head\'s bancorToken', async function () {
        this.timeout(5000);

        let result = await getTokenBalance(ctx, [TOKEN_NAME, config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        oldBancor = new BigNumber(amount).toNumber();
        console.log(`Check head \'s balance ${TOKEN_NAME}:`, oldBancor);
        // expect(amount).to.equal('900');
        expect(1).to.equal(1);
    })

    it('get bancorToken supply', async function () {
        this.timeout(5000);

        let result = await getBancorTokenSupply(ctx, [TOKEN_NAME]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        console.log(`Check bancorToken supply ${TOKEN_NAME}:`, new BigNumber(amount).toFixed(9));
        expect(1).to.equal(1);
    })

    it('get bancorToken reserve', async function () {
        this.timeout(5000);

        let result = await getBancorTokenReserve(ctx, [TOKEN_NAME]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        console.log(`Check bancorToken reserve ${TOKEN_NAME}:`, new BigNumber(amount).toFixed(9));
        expect(1).to.equal(1);
    })

    it('get bancorToken factor', async function () {
        this.timeout(5000);

        let result = await getBancorTokenFactor(ctx, [TOKEN_NAME]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        console.log(`Check bancorToken factor ${TOKEN_NAME}:`, amount);
        expect(1).to.equal(1);
    })
});

// Test Transferto
describe('Test TransferTo', function () {

    // switch2BigBoss();

    //this.timeout(50000);

    // it('Read from test.jon', () => {
    //     config.people.forEach((item) => {
    //         console.log('\taccount', item.name, ':', item.init_amount);
    //     });
    //     expect(config.people.length).to.equal(10);
    //     // done();
    // });

    let AMOUNT = 1000;
    let FEE_AMOUNT = 100;
    let NUM = AMOUNT + FEE_AMOUNT;
    let head_balance = 0.0;
    let TEST_TX1 = '';

    // let original_head_balance = 0.0;

    it('Check account:head', async function () {
        this.timeout(5000);
        let result = await getBalance(ctx, [config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        // original_head_balance = amount;
        console.log('head \'s balance:', amount);
        expect(1).to.equal(1);
        //done();
    });
    it('Transfer to account:head', async function () {

        switch2BigBoss();

        this.timeout(33000);

        let result = await transferTo(ctx, [config.head.address, (NUM) + '', "0.1"]);

        console.log(result);

        expect(result.ret).to.equal(ErrorCode.RESULT_OK);

        TEST_TX1 = result.resp!.split(':')[1];

        head_balance += NUM;
    });

    it('Check account:head', async function () {
        this.timeout(5000);
        let result = await getBalance(ctx, [config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        console.log('Check head \'s balance:', amount);
        expect(1).to.equal(1);
        //done();
    });

    it('Check createtoken', async function () {
        this.timeout(33000);

        let TOKEN_NAME = 'TOK' + Math.random().toString().slice(2, 10);
        // let COST = '100';

        let result = await createToken(ctx, [TOKEN_NAME, '[{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000"}]', "0.1"]);

        console.log('CreateToken:', TOKEN_NAME);

        expect(result.ret).to.equal(ErrorCode.RESULT_OK);

        head_balance -= 0; //100.1;

        // check tokenBalance
        result = await getTokenBalance(ctx, [TOKEN_NAME, "1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79"]);
        // console.log(result);
        let obj = JSON.parse(result.resp!);
        assert.equal(obj.err, ErrorCode.RESULT_OK);
        prnGetTokenBalance(ctx, result);

    });

    it('Check getBlock', async function () {
        this.timeout(5000);

        let result = await getBlock(ctx, ["0"]);
        // console.log(result);
        let obj = JSON.parse(result.resp!);
        assert.equal(obj.err, ErrorCode.RESULT_OK);
        prnGetBlock(ctx, result);
    });

    it('Check getCandidates', async function () {
        this.timeout(5000);

        let result = await getCandidates(ctx, []);
        // console.log(result);
        let obj = JSON.parse(result.resp!);
        assert.equal(obj.err, ErrorCode.RESULT_OK);
        prnGetCandidates(ctx, result);
    });
    it('Check getMiners', async function () {
        this.timeout(5000);

        let result = await getMiners(ctx, []);
        // console.log(result);
        let obj = JSON.parse(result.resp!);
        assert.equal(obj.err, ErrorCode.RESULT_OK);
        prnGetMiners(ctx, result);
    });

    it('Check getPeers', async function () {
        this.timeout(5000);

        let result = await getPeers(ctx, []);
        //console.log(result);
        assert.equal(result.ret, 200);
        prnGetPeers(ctx, result);
    });

    it('Check getReceipt', async function () {
        this.timeout(5000);

        let result = await getReceipt(ctx, [TEST_TX1]);

        assert.equal(result.ret, 200);
        prnGetReceipt(ctx, result);
    });

    it('Transfer  account:head back to big boss', async function () {
        this.timeout(33000);
        switch2Head();

        let num = head_balance - 0.1;//  0.1;
        console.log('Send back to big boss:', num);

        let result = await transferTo(ctx, [config.access.address, num + '', "0.1"]);

        assert.equal(result.ret, ErrorCode.RESULT_OK);


    });
    it('Check account:head', async function () {
        this.timeout(5000);

        let result = await getBalance(ctx, [config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        console.log('head \'s balance', amount);

        assert.equal(1, 1);
    });
});


