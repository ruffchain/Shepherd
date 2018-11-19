node ./common/dist/blockchain-sdk/src/tool/host.js create \
--package "./common/dist/blockchain-sdk/demo/dpos/chain" --externalHandler \
--dataDir "./data/dpos/genesis" \
--loggerConsole --loggerLevel debug \
--genesisConfig "./common/dist/blockchain-sdk/demo/dpos/chain/genesis.json"
