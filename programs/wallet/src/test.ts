#!/usr/bin/env node
import { addressFromSecretKey } from './core/address';

process.on('warning', (warning) => {
    console.log(warning);
});

console.log('hello world');
let addr = addressFromSecretKey("054898c1a167977bc42790a3064821a2a35a8aa53455b9b3659fb2e9562010f7");
console.log(addr);
console.log('after world');
