import * as fs from 'fs';
import { RPCClient } from '../client/client/rfc_client';


interface account {
    name: string;
    address: string;
    secret: string;
    amount: number;
    init_amount: number;
};

interface IfConfig {
    readme: string;
    head: account;
    access: {
        secret: string;
        address: string;
        host: string;
        port: string;
    };
    people: account[];
};

let DATA_FILE = './data/test_local.json';
// let DATA_FILE='./data/test.json'
let text = fs.readFileSync(DATA_FILE);
export let config: IfConfig = Object.create({});
try {
    config = JSON.parse(text.toString());
} catch (e) {
    console.log(e);
    process.exit(1);
}

let SYSINFO: any = {};
SYSINFO.secret = config.access.secret;
SYSINFO.host = config.access.host;
SYSINFO.port = config.access.port;
SYSINFO.address = config.access.address;
SYSINFO.verbose = false;

let clientHttp: RPCClient = new RPCClient(
    SYSINFO.host,
    SYSINFO.port,
    SYSINFO
);
export const ctx = {
    client: clientHttp,
    sysinfo: SYSINFO
}
export function switch2Head() {
    ctx.sysinfo.secret = config.head.secret;
    ctx.sysinfo.address = config.head.address;
}
export function switch2BigBoss() {
    ctx.sysinfo.secret = config.access.secret;
    ctx.sysinfo.address = config.access.address;
}
