#!/bin/bash
echo "Choose your test blockchain (p = polygon | o = optimism | h = hardhat | e - edgewere polkadot)"
read blockchain
export POC_NETWOTK=$blockchain

npx hardhat compile

if [ $blockchain == 'p' ];
then
  npx hardhat --network 'matic' test test/test.js
elif [ $blockchain == 'e' ];
then
  npx hardhat --network 'edgeware' test test/test.js
elif [ $blockchain == 'o' ];
then
  npx hardhat --network 'optimism' test test/test.js
elif [ $blockchain == 'h' ];
then
  npx hardhat test test/test.js
fi
