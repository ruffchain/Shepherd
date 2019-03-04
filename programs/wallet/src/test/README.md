# Test 
## New API
实现Token, bancor算法

### createTokenWithReserve

```
输入参数为:
token-name
F   -  fractional ratio 
R0  -  reserved SYS
S0  -  liquidity token
S1  -  non-liquidity token
fee
```

### getTokenWithReserve

```
输入参数:
token-name

返回参数:
F
R0
S0
S1

```

### buyTokenWithReserve

```
输入参数:
token-name
amount
cost
fee

```

### sellTokenWithReserve

```
输入参数：
token-name
amount
fee

```


### getTokenWithReserveBalance

```
输入参数:
token-name
address

输出参数:
amount
```

### getAllBalance
```
输入参数:
address

输出:
SYS:amount
token1: amount
token2: amount

```

### 

## Test Bignumberjs for Bancor

testbancor.ts

### 把所有的指令都执行一遍
测试步骤

- Test addressFromSecretKey
- Read test.json
- Check Account:head
- Transfer 1100 SYS to Account:head, save TEST_TX1
- Check Account:head balance
- CreateToken, GetTokenBalance
- GetBlock 0
- GetCandidates
- GetMiners
- GetPeers
- GetReceipt from TEST_TX1
- TransferTo back big boss account
- Check Account:head balance

### Phase-2 测试的新命令
- register
- mortgage
- unmortgage
- getstake
- vote
- getvote

### 进行速度测试，交易完成量


