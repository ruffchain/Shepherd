node common/dist/blockchain-sdk/src/tool/host.js create \
--package "dist/blockchain-sdk/ruffchain" --externalHandler \
--dataDir "./data/dpos/genesis" \
--loggerConsole --loggerLevel debug \
--genesisConfig "common/dist/blockchain-sdk/demo/dpos/chain/genesis.json"
