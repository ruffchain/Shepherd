# Command Line Interface

## Change History
- 1.0.5 Modify package.scripts.preinstall
- 1.0.6 Add getBalance, getBlock
- 1.0.7 Add createToken, getMiners ...
- 1.0.8 Add vote, mortgage, unmortgage ...
- 1.0.9 upload ， modfity README

## dependency
- node.js  (version == 8.11)
- ES2017
- tsc, typescript compiler (version == 3.1.0)
- winston v2.4.2 , 去掉兼容性，想办法，新版本是v3.1.0

## install

```
// under directory, run
npm install

```

## How to use?

### Commands
* getBalance [account address]  
  get account balance (default account: self i.e. specific with --secret)

* getMiners  
  list miners

* getPeers  
  list peers for nodes

* getNonce <account address>  
  get nonce for <account address>

* transferTo <account address> <amount> <fee>  
  transfer `amount` sys token to specific `account address` with gas fee `fee`

* createToken <token symbol> <preaccount address and balance list> <amount>  <fee>   
  issue token with symbol name `token symbol` with prebalances list in 

  `preaccount address and balance list` it will cost `amount` sys token and `fee`

  e.g.

```bash
createToken test [{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000"}] 100 1
```

> issue `test` token with pre balnce `10000` for account address `1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79` cost `100` for sys token and `1` as gas fee 

* getTokenBalance <token symbol> <account address>

  get `token symbol` balance for `account address`

* transferTokenTo <token symbol> <account address> <amount> <fee>

  transfer token `token symbol` with  `amount` to `account address` cost gas fee `fee`

### Example

```
// start cli
./dist/cli.js --secret xxxxxxxxxxxxxxxx --host 139.219.184.44 --port 18089

// get balance for default account
getBalance
// transfer 200 sys token to 16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg with fee 1 sys token
transferTo          16ZJ7mRgkWf4bMmQFoyLkqW8eUCA5JqTHg  1000   0.1
transferTo  12nD5LgUnLZDbyncFnoFB43YxhSFsERcgQ 20 1
transferTo  13dhmGDEuaoV7QvwbTm4gC6fx7CCRM7VkY  1000 1
transferTo  1NsES7YKm8ZbRE4K5LaPGKeSELVtAwzoTw  2000 1

//issue token with token name 'token2'
createToken token2 [{"address":"1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79","amount":"10000"}] 100 1

//get token2 balance for account
getTokenBalance token2 1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79
transferTokenTo token2 1LuwjNj8wkqo237N7Gh8nZSSvUa6TZ5ds4 10 1
getTokenBalance token2  1LuwjNj8wkqo237N7Gh8nZSSvUa6TZ5ds4
getBalance 1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79
getBalance 12nD5LgUnLZDbyncFnoFB43YxhSFsERcgQ
transferTo 


```
## Test





