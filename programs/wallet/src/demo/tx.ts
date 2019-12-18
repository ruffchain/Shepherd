import { ValueTransaction, BigNumber, BufferWriter, Transaction } from "../core";


function main() {
    console.log("Test tx sign");
    let amount = 100;
    let fee = 0.1
    let address = "154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r";
    let secret = "6f1df947d7942faf4110595f3aad1f2670e11b81ac9c1d8ee98806d81ec5f591"

    let tx = new ValueTransaction();
    tx.method = 'transferTo';
    tx.value = new BigNumber(amount);
    tx.fee = new BigNumber(fee);
    tx.input = { to: address };
    tx.nonce = 1;

    console.log('\nBefore sign')
    console.log(tx);
    console.log('hash length:', tx.hash.length);
    console.log("publickey length:");

    tx.sign(secret);
    console.log('\nAfter sign')
    console.log(tx)

    let writer = new BufferWriter();

    tx.encode(writer);

    let buf = writer.render();
    console.log('\nAfter encode');

    console.log(buf);

}

main();