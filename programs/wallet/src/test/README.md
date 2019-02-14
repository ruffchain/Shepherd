# Test 
## Method
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

### 进行速度测试，交易完成量
