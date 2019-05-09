const BigNumber = require('bignumber.js');
const assert = require('assert');

function doTransfer(amount) {
    const accountA = '12nD5LgUnLZDbyncFnoFB43YxhSFsERcgQ';
    const accountB = '1LuwjNj8wkqo237N7Gh8nZSSvUa6TZ5ds4';

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

function doSetDB() {
    assert.equal(this.getReceiver(), this.getCaller());

    assert.equal(bcDBCreate('IotDemo'), true);
    return true;
}

function doUnlock() {
    let owner = bcDBGet('IotDemo', 'owner');
    //bcLog('##### Owner is', owner);
    assert.equal(owner, this.getCaller());
    assert.equal(bcDBSet('IotDemo', 'state', 'unlock'), true);
    return true;
}

function doLock() {
    let owner = bcDBGet('IotDemo', 'owner');
    assert.equal(owner, this.getCaller());
    assert.equal(bcDBSet('IotDemo', 'state', 'lock'), true);
    return true;
}

function doSetOwner() {
    assert.equal(bcDBSet('IotDemo', 'owner', this.getCaller()), true);
    assert.equal(bcDBSet('IotDemo', 'state', 'lock'), true);
    return true;
}

Contract.prototype.getReceiver = function() {
    return this._receiver;
}

Contract.prototype.getCaller = function() {
    return this._caller;
}

Contract.prototype.doTransfer = doTransfer;

Contract.prototype.doSetDB = doSetDB;
Contract.prototype.doSetOwner = doSetOwner;
Contract.prototype.doUnlock = doUnlock;
Contract.prototype.doLock = doLock;

global.Contract = Contract;
