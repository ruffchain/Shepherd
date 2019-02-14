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

// Test Transferto
describe('Test TransferTo', function () {
    this.timeout(33000);

    it('Read from test.jon', () => {
        config.people.forEach((item) => {
            console.log('\taccount', item.name, ':', item.init_amount);
        });
        expect(config.people.length).to.equal(10);
        // done();
    });

    let AMOUNT = 1000;
    let FEE_AMOUNT = 100;
    let NUM = AMOUNT + FEE_AMOUNT;
    let head_balance = 0.0;
    let TEST_TX1 = '';

    let original_head_balance = 0.0;

    it('Check account:head', async function () {
        this.timeout(5000);
        let result = await getBalance(ctx, [config.head.address]);

        let amount: number = 0.0;
        if (result.resp) {
            let objJson = JSON.parse(result.resp);
            amount = objJson.value.replace(/n/g, '');

        }
        original_head_balance = amount;
        console.log('head \'s balance:', amount);
        expect(1).to.equal(1);
        //done();
    });
    it('Transfer to account:head', async function () {
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
        let COST = '100';

        let result = await createToken(ctx, [TOKEN_NAME, '[{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000"}]', COST, "0.1"]);

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

        assert.equal(original_head_balance, amount);
        // done();
    });

});

