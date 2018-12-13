[![Build Status](https://travis-ci.com/ruffchain/Shepherd.svg?branch=master)](https://travis-ci.com/ruffchain/Shepherd)

# Shepherd

The bootstrap and orchestrate tools for Blockchain, it is the Best practice of Ruff IoT Blockchain [Ruff IoT Blockchain white paper](https://github.com/RuffNotes/RuffChain/blob/master/WhitePaper.md)

## How to Build
```
git clone https://github.com/ruffchain/Shepherd.git
cd Shepherd
npm install
npm run build
```

## Configure miner
```
./programs/node/create.sh
```

## Start miner
```
./programs/node/miner.sh
```

## Start wallet
```
./programs/wallet/wallet.sh
```

## Run user Demo DApp (e.g splitTransfer)

build DApp
```
programs/contract/splitTransfer
npm install
npm run build
```

load DApp from wallet
> The DApp will run in isolate and security context i.e. RuffVM

```
./programs/wallet/wallet.sh
// load contract code
chain.setCode(10, 'programs/contract/splitTransfer/dist/index.js')
// trigger contract method
chain.runMethod('1EYLLvMtXGeiBJ7AZ6KJRP2BdAQ2Bof79', 10, 10, 'doTransfer', '10')
```
