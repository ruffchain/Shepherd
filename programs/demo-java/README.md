# Introduction

Developed by Java 1.8

libs:

- coinj 0.14.7

entry:

- src/app.java



## JAVA API demo

DemoAddr     - Address, key, creation

DemoStatus   - get chain height, block, transaction

DemoTransfer - DemoTransfer.transferTo()

## Questions

### 1 反序列化

```

Q: 交易签名出来的字节流，反序列化成一个json结构

A: 见Digest.parse()可以解析 byte[]为json, 如下所示

{

"input":"{\"to\":\"s154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r\"}",

"amount":"100",

"method":"transferTo",
"signature":"8d9468783b1673dab4ca29027c21cae9703969042c1b690236b7ebc14d9b00ba48d154a4895d247a6192d5efad22be8199c98d0d52fee4685363673aa241d346",

"fee":"0.1",

"publicKey":"02c7946884918dcc3f234e60aefa6c3269169e5a27d33824c8d1e10e2b7746e89d",

"nonce":13

}

并且可以参考 doc/readme.jpg图示

```

### 2 交易构造

```
Q: 构造交易

A: 见 DemoTransfer.java文件

```


### 3 地址校验

```
Q: 地址校验,生成

A: 见 DemoAddr.java文件

```


