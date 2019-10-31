import { randomBytes } from "crypto";
import { addressFromSecretKey, isValidAddress } from "../core";
const secp256k1 = require('secp256k1');
import * as colors from 'colors';

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

    if (isValidAddress(address!)) {
        console.log(colors.blue('Valid address: ') + address)
    } else {
        console.log(colors.red('Invalid address: ') + address)
    }
}

function main() {
    createKey();

}

main();