import { ValueTransaction, BufferWriter } from '../core'
import { BigNumber } from '../core';

let toAddr = "1FHbEdgcrkQnVDEEJUzGaxkkRYPmdzKo6q";
let amount = "9999999990.0010001";
let fee = "0.1";
let secret = "560b11af06fe73674d80ebb6bcefd593711e28fbdf4cd087fefb1e17140021a0";
let nonce = 21;

async function main() {
    console.log("hello world");

    let tx = new ValueTransaction();
    tx.method = "transferTo";
    tx.value = new BigNumber(amount);
    tx.fee = new BigNumber(fee);
    tx.input = { to: toAddr };
    tx.nonce = nonce;

    console.log('tx:');
    console.log(tx);

    tx.sign(secret);

    let outTx = { tx };

    console.log("\nShow tx");
    console.log(JSON.stringify(outTx));

    console.log("\nafter encoding")
    let writer = new BufferWriter();
    let err = tx.encode(writer);
    if (err) {
        console.log(`send invalid transactoin`);
        return { err };
    }
    let outBufTx = { tx: writer.render() };
    console.log(JSON.stringify(outBufTx));
}

main();