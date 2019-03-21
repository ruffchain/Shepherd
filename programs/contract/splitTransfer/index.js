const BigNumber = require('bignumber.js');
const assert = require('assert');

function doTransfer(amount) {
    const accountA = '12nD5LgUnLZDbyncFnoFB43YxhSFsERcgQ';
    const accountB = '1LuwjNj8wkqo237N7Gh8nZSSvUa6TZ5ds4';

    //assert.equal(this.getReceiver(), '1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79', 'invalid receiver');
    //assert.equal(this.getCaller(), '1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79', 'invalid caller');

    var amountValue = new BigNumber(amount);
    let toAValue = amountValue.div(2).toString();
    let toBValue = amountValue.div(2).toString();

    assert.equal(bcTransfer(accountA, toAValue), true);
    assert.equal(bcTransfer(accountB, toAValue), true);
    return true;
}

function Contract(receiver, caller) {
    var that = this;

    that._receiver = receiver;
    that._caller = caller;
}

Contract.prototype.getReceiver = function() {
    return this._receiver;
}

Contract.prototype.getCaller = function() {
    return this._caller;
}

Contract.prototype.doTransfer = doTransfer;

global.Contract = Contract;
