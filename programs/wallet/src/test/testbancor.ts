import { BigNumber } from 'bignumber.js';
import { outputFile } from 'fs-extra';
/**
 * 付出e,能够购买
多少个Token?
R增加了e
S增加了s, T = S0( (1+ e/R0)^F -1)

卖出s个Token, 能够
R减少多少个e, E = R0(1- (1- s/S0)^(1/F) )
S减少了s, s个

exponentiatedBy(n: number, m?: BigNumberValue): BigNumber;
pow(), 最小的单元是多少呢？

SYS的最小单位是多少？10^-6就可以了吧？默认是小数点后18位

minus()
plus()
minus()
multipliedBy()
.toFixed(6)
dividedby()

 */

console.log('Test bancor');

let R = new BigNumber(250);  // reserve
let S = new BigNumber(1000); // supply
let F = 0.5;
let invF = 1 / F;

let funcBuy = (inE: BigNumber | number): BigNumber => {
    let e = new BigNumber(inE);
    let out: BigNumber;

    out = e.dividedBy(R);
    out = out.plus(new BigNumber(1.0));
    // out = out.exponentiatedBy(F);
    let temp1 = out.toNumber();
    out = new BigNumber(Math.pow(temp1, F));
    out = out.minus(new BigNumber(1));
    out = out.multipliedBy(S);
    // out = out.toFixed(12);

    R = R.plus(e);
    S = S.plus(out);

    console.log('Buy ', e.toFixed(12), ' sys of token', out.toFixed(12));

    return out;
}
let funcSell = (inT: BigNumber | number): BigNumber => {
    let e = new BigNumber(inT);
    let out: BigNumber;

    out = e.dividedBy(S);
    out = new BigNumber(1).minus(out);
    let temp1 = out.toNumber();
    out = new BigNumber(Math.pow(temp1, invF));
    out = new BigNumber(1).minus(out);
    out = out.multipliedBy(R);

    R = R.minus(out);
    S = S.minus(e);

    console.log('Sell ', e.toFixed(12), ' token to get:', out.toFixed(12));

    return out;
};
let funcSell2 = (inT: number): number => {
    let t = new BigNumber(inT);
    let out: number;

    out = R.toNumber() * (1 - Math.pow(1 - inT / S.toNumber(), invF));

    R = R.minus(new BigNumber(out));
    S = S.minus(new BigNumber(inT));

    return out;
};
let funcBuy2 = (inE: number): number => {
    let out: number;

    out = 1000 * (Math.pow(1 + inE / R.toNumber(), F) - 1);

    R = R.plus(new BigNumber(out));
    S = S.plus(new BigNumber(inE));

    return out;
}
let printRS = () => {
    console.log('_'.repeat(40));
    console.log('Reserve:', R.toFixed(12));
    console.log('Supply:', S.toFixed(12));
    console.log('-'.repeat(40));
}
// let T = funcBuy(0.5);
// console.log(T.toNumber());

// let T2 = funcBuy2(0.5);
// console.log(T2);

let test1 = () => {

    printRS();

    let T = funcBuy(0.5);

    let E = funcSell(T);

    printRS();

    T = funcBuy(250);

    printRS();

    E = funcSell(T);

    printRS();

    E = funcSell(1000);

    printRS();

}
let test2 = () => {
    printRS();

    let T = funcBuy2(0.5);
    console.log('Buy ', 0.5, ' sys of token', T);

    let E = funcSell2(T);
    console.log('Sell ', T, ' token to get:', E);

    printRS();
}

let test3 = () => {
    let n = new BigNumber("n1000");
    console.log(n.toString());
};
test1();

// console.log("\nTest2\n");
// test3();
