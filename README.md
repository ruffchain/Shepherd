Shepherd
=========
The bootstrap and orchestrate tools for Blockchain, it is the Best practice of Ruff IoT Blockchain [Ruff IoT Blockchain white paper](https://github.com/RuffNotes/RuffChain/blob/master/WhitePaper.md)

## How to Build
```
git clone --recurse-submodules https://github.com/ruffchain/Shepherd.git
cd Shepherd
npm install
cd common
npm install
cd ..
gulp build
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
