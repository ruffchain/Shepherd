node common/dist/blockchain-sdk/src/tool/host.js create \
--package "dist/blockchain-sdk/ruffchain" --externalHandler \
--dataDir "./data/dpos/genesis" \
--loggerConsole --loggerLevel debug \
--genesisConfig "programs/node/chain/genesis.json"
