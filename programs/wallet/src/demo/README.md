# Demo说明

源代码地址: https://github.com/ruffchain/Shepherd/programs/wallet

Demo提供的程序使用了TypeScript语言。 可在programs/wallet/下执行程序的安装和编译。示例程序在src/demo目录下，编译后的js程序在dist/demo/目录下面。

```
// 安装
npm install

// 编译
npm run compile

```


# Demo代码

## 1 状态查询
需提供节点接口调用详细说明文档，包含查询当前块高度、查询块消息和交易详情等。

使用http post和节点交互，端口为 18089

```
// demo_status.ts
// node dist/demo/demo_status.js

// http post
let url = 'http://' + ipaddr + ':' + port + '/rpc'
xmlhttp.open('POST', url, true);
xmlhttp.setRequestHeader('Content-Type', 'application/json');

let sendObj = {
    funName: funcName,
    args: funcArgs
}

xmlhttp.send(JSON.stringify(sendObj));

```

所有的命令都是以sendObj的格式发送的，不同的命令的funName和args有所不同。

### 1.1 查询账户余额

输入参数:

```
funcName='view'
funcArgs={
    method:'getBalance',
    params: {
        address: mAddress
    }
}

```

返回值:

```
// 正常返回
{ resp: '{"err":0,"value":"n9.9"}', ret: 200 }

// 非正常返回，ret!=200 || err != 0
// 返回的账户余额为 "n9.9", 需将开头的字母n去除，精度为小数点后9位

```

### 1.2 查询当前高度

输入参数:

```
funcName='getBlock'
funcArgs={
    which:'latest',
    transactions: false,
    eventLog: false,
    receipts: false
}

```

返回值:

```
// 正常返回
{
    "err": 0,
    "block":        
    {
        "hash":"f46b078472158484f6803eb5e9adc6dc7dee074747708fb387024caa7cb1ce37",
        "number":15818,
        "timestamp":1572414391,"preBlock":"875a34b45216f9572a66a994d4a833166669d8e0e5ac27bc0a81c92241bcd830","merkleRoot":"0000000000000000000000000000000000000000000000000000000000000000","storageHash":"303d2445ffa8eb0e87510ecce56ea34457ee6375189ddb59a61db5fa8f834e9c","m_receiptHash":"0000000000000000000000000000000000000000000000000000000000000000","coinbase":"168JPuqCa2ZWepPcjq8SowyduUnZjtEtG5","reward":12,"creator":"168JPuqCa2ZWepPcjq8SowyduUnZjtEtG5"
    }
}

// 非正常返回， err != 0
// 返回的高度为 block.number

```

### 1.3 查询块消息

输入参数:

```
funcName='getBlock'
funcArgs={
    which: 15134,  // block number or block hash
    transactions: true,
    eventLog: true,
    receipts: true
}

```

返回值:

```
// 正常返回
{
    "err":0,
    "block":{
        "hash":"628ae3a003cf32da4f3db12449a4fcbcaca7f11e05caf8d7084a8341a2b872e9",
        "number":104833,
        "timestamp":1572264614,"preBlock":"86b9fe551f1e1a3c10c12c6e80a7ebf5e6f3ca29791d308c3a5304f77256d020","merkleRoot":"a48b2c8ef19f94d43dc3456409d9a4252b882b8ebaa68833c90a63f981870e50","storageHash":"b53bfc0b966b6e160c0ed4079bbbac950fcf4181532c13d95c213e3dd2b66da0","m_receiptHash":"ed53c304e7b5b828b3468dbf8ab89f82add7f265169ad75a2ff2da74f79acebb","coinbase":"135xQBv3yRjrvbNxmPWLkyAuzBjbmhZXRA",
        "reward":12,
        "creator":"135xQBv3yRjrvbNxmPWLkyAuzBjbmhZXRA"
        },
    "transactions":
    [   
        {
        "hash":"a48b2c8ef19f94d43dc3456409d9a4252b882b8ebaa68833c90a63f981870e50",
        "method":"transferTo",
        "input":
        {
            "to":"16SRLTkoFFjpg175mGLwkiqkUCUeUHt1Xp"
        },
        "nonce":0,
        "caller":"1771gp7nh3Fq8wF8BjkTfRWa7zycHy5GK9","value":"0.00001",
        "fee":"0.1"}
    ],
    "eventLogs":
    [
        {
            "name":"transfer",
            "param":
                {
                    "from":"1771gp7nh3Fq8wF8BjkTfRWa7zycHy5GK9","to":"16SRLTkoFFjpg175mGLwkiqkUCUeUHt1Xp","value":"0.00001"
                }
        }
    ],
    "receipts":
    [{
        "transactionHash":"a48b2c8ef19f94d43dc3456409d9a4252b882b8ebaa68833c90a63f981870e50",
        "returnCode":0,
        "logs":
        [
            {
                "name":"transfer",
                "param":
                    {
                        "from":"1771gp7nh3Fq8wF8BjkTfRWa7zycHy5GK9","to":"16SRLTkoFFjpg175mGLwkiqkUCUeUHt1Xp","value":"0.00001"
                    }
        }],
        "cost":"0.1"
    }]
}

// 非正常返回， err != 0 
```


### 1.4 查询交易详情

输入参数:

```
funcName='getTransactionReceipt'
funcArgs={
    tx: "a48b2c8ef19f94d43dc3456409d9a4252b882b8ebaa68833c90a63f981870e50",  // tx hash
}

```

返回值:

```
// 正常返回
{ resp:
   '
   {
    "err":0,
    "block":{
       "hash":"628ae3a003cf32da4f3db12449a4fcbcaca7f11e05caf8d7084a8341a2b872e9",
       "number":104833,
       "timestamp":1572264614,"preBlock":"86b9fe551f1e1a3c10c12c6e80a7ebf5e6f3ca29791d308c3a5304f77256d020","merkleRoot":"a48b2c8ef19f94d43dc3456409d9a4252b882b8ebaa68833c90a63f981870e50","storageHash":"b53bfc0b966b6e160c0ed4079bbbac950fcf4181532c13d95c213e3dd2b66da0","m_receiptHash":"ed53c304e7b5b828b3468dbf8ab89f82add7f265169ad75a2ff2da74f79acebb","coinbase":"135xQBv3yRjrvbNxmPWLkyAuzBjbmhZXRA",
       "reward":12,
       "creator":"135xQBv3yRjrvbNxmPWLkyAuzBjbmhZXRA"},
       "tx":{
           "hash":"a48b2c8ef19f94d43dc3456409d9a4252b882b8ebaa68833c90a63f981870e50",
           "method":"transferTo",
           "input":{
               "to":"16SRLTkoFFjpg175mGLwkiqkUCUeUHt1Xp"},
               "nonce":0,
               "caller":"1771gp7nh3Fq8wF8BjkTfRWa7zycHy5GK9","value":"0.00001",
               "fee":"0.1"
               },
            "receipt":{"transactionHash":"a48b2c8ef19f94d43dc3456409d9a4252b882b8ebaa68833c90a63f981870e50",
            "returnCode":0,
            "logs":[
                {"name":"transfer",
                "param":{
                    "from":"1771gp7nh3Fq8wF8BjkTfRWa7zycHy5GK9","to":"16SRLTkoFFjpg175mGLwkiqkUCUeUHt1Xp","value":"0.00001"
                    }
                }
            ],
        "cost":"0.1"}
      }',
     ret: 200 }

// 非正常返回， ret!= 200 || err != 0 || block.tx.returnCode != 0

```

## 2 地址生成
需提供生成公司钥对，生成地址，地址合法性校验方法，激活地址的文档和 Java/JavaScript Demo

```
// demo_address.ts
// 测试运行: node dist/demo/demo_address.js

// 采用了比特币的地址生成方式, secp256k1算法; 地址不需激活

// 生成密钥，公钥，地址
let privateKey;

do {
    privateKey = randomBytes(32);
} while (!secp256k1.privateKeyVerify(privateKey));

const pubkey = secp256k1.publicKeyCreate(privateKey, true);

let address = addressFromSecretKey(privateKey);

// 判断地址的有效性
function isValidAddress(address: string): boolean {
    let buf;
    try {
        buf = base58.decode(address);
        if (buf.length !== 25) {
            return false;
        }
    } catch (e) {
        return false;
    }
    let br = new BufferReader(buf);
    br.readU8();
    br.readBytes(20);
    try {
        verifyChecksum();
    } catch (error) {
        return false;
    }

    return true;
}

verifyChecksum(): number {
    const chk = createChecksum();
    const checksum = this.readU32();
    this.enforce(chk === checksum, 'Checksum mismatch.');
    return checksum;
}

createChecksum(): number {
    let start = 0;

    if (this.stack.length > 0) {
        start = this.stack[this.stack.length - 1];
    }
            
    const data = this.data.slice(start, this.offset);

    return digest.hash256(data).readUInt32LE(0, true);
}


```


## 3 转账流程
 需要提供详细的通过节点接口同步和分析处理地址成功转账的逻辑

 流程为获取账户nonce； nonce= nonce+1, 生成新的交易，发送；查询交易是否成功；结束

```
// demo_transfer.ts
node dist/demo/demo_transfer.js

```

### 3.1 获取账户地址的当前nonce值
账户每发送一次交易，nonce值会加1。交易字段中的nonce值必须等于链上账户的nonce值+1，否则交易会被拒绝。保证交易的唯一性。

输入参数:

```
funcName='getNonce'
funcArgs={
    address: "125yhbpdLjW9NrZA5vM6s6URDT9cLAAgHZ"
}

```

返回值:

```
// 正常返回
{"err":0,"nonce":2}

// 非正常返回
// err != 0

```


### 3.2 发送转账交易
将交易发送给链节点的rpc端口

输入参数:

```
// 转账交易的数据结构
let tx = {
  m_hash:
   '0000000000000000000000000000000000000000000000000000000000000000',
  m_publicKey:
   <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
  m_signature:
   <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... >,
  m_method: 'transferTo',
  m_nonce: -1,
  m_value: 10,
  m_fee: 0.1,
  m_input: 
    { 
        to: '1CKTBdV7E8DfRPSknLLvLfgWqnrfeFWLGx' 
    } 
}

// 填入publicKey, method, nonce, value, fee, input


// 需要 hash的部分
let content = writer: BufferWriter;
writer.writeVarString(this.m_method);
writer.writeU32(this.m_nonce);
writer.writeBytes(this.m_publicKey);
writer.writeVarString(JSON.stringify(toStringifiable(this.m_input, true));)

// 计算hash
let contentBuf = writer.render();
this.m_hash = digest.hash256(contentBuf).toString('hex');

// 签名
this.m_signature = Address.sign(this.m_hash, privatekey);

// 如前述操作，将交易发送出去
funcName='sendTransaction'
funcArgs={
    tx: tx.encode(writer)
}


```
交易的完成时间在10秒~2分钟不等，根据BFT确认还是DPOS_BFT pipeline确认，以及链上业务是否繁忙而有所不同。需要通过主动查询来确认转账交易是否完成？

返回值

```
// 正常返回
{ resp: '0', ret: 200 }

// 非正常返回
// ret != 200 || resp != 0

```


### 3.3 轮询交易是否成功
发送交易完成后，每隔10秒钟(出块周期)查询一次交易是否完成？如果长时间得不到正常返回说明交易未被执行；如果返回的returnCode!=0说明交易执行失败。


输入参数:

```

funcName='getTransactionReceipt'
funcArgs={
    tx: "bbccc31ffcc46df6c1593a96fec34c11404884927f5cf0d61f872275013e7c0d"
}

```

返回值:

```
// 正常返回, block.tx.receipt.returnCode == 0, 
{ resp:
   '{
       "err":0,
       "block":{
           "hash":"62a8f11f7100fc0920a7795c5ad24431bd98193f50eea9c1419518af10a5963d",
           "number":17593,
           "timestamp":1572488661,"preBlock":"c1715bbdb9b76bee8334e3a066197fe219416c065e2ad7297604b2dffab69fa8","merkleRoot":"bbccc31ffcc46df6c1593a96fec34c11404884927f5cf0d61f872275013e7c0d","storageHash":"4e7156d9121889ba03e7d595d37de17e78199f47af8fd7126bb56f09288ea693","m_receiptHash":"50edc410c11822f9606a9e508e4d448fbe4e904deb3c1d5541a4a63007f92c75","coinbase":"1jPTj1YjuaWtYviYaNhTRYewyVttvz5wA","reward":12,"creator":"1LcLZNsntAcU55LSqkrGDQTLuEnvJAVjrW"},
           "tx":{
               "hash":"bbccc31ffcc46df6c1593a96fec34c11404884927f5cf0d61f872275013e7c0d",
               "method":"transferTo",
               "input":{
                   "to":"1CKTBdV7E8DfRPSknLLvLfgWqnrfeFWLGx"},"nonce":5,"caller":"154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r","value":"10",
                   "fee":"0.1"
                },
                "receipt":{
                    "transactionHash":"bbccc31ffcc46df6c1593a96fec34c11404884927f5cf0d61f872275013e7c0d","returnCode":0,
                    "logs":[
                        {"name":"transfer",
                        "param":{
                            "from":"154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r","to":"1CKTBdV7E8DfRPSknLLvLfgWqnrfeFWLGx","value":"10"
                        }}]
                    ,
                    "cost":"0.1"}}',
  ret: 200 }



// 非正常返回, err==9, 交易未被查询到
{ resp: '{"err":9}', ret: 200 }

```


## 4 交易签名
需提供详细的交易构造，离线签名，解析签名后交易数据，广播交易的文档和 Java/JavaScript Demo


支持离线签名，但是要保证nonce值正确，也即没有其它交易被执行。否则该离线签名无效。

```

// demo_sign.ts
// 参考 ## 3 交易转账

```


