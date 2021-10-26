# bbs-l2

This is a POC, testing and measuring tool for alternative layer 2 solutions for the BBS project.

The code is meant to test our specific needs from a later 2 solution, and may contain different branches to test different solutions.


## Setup
The current test is done on top of the Optimism network (future tests will probably include Polygon, BSC, and maybe even non-EVM solutions like Solana), and to run it you need both an Ethereum provider and an Optimism provider. The easiest way to achieve this is to follow Optimism's [documentation](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/hardhat) for running L1 and L2 as local nodes - just stop just before the 'Migrate a Dapp to Optimistic Ethereum' section.

The last command you entered was:
```sh
docker-compose -f docker-compose-nobuild.yml up -t 3600
```

If there are no errors, you now have both nodes running, and RPC providers are listening on two ports (8545 and 9545). If you get the error, 'could not detect network', just keep on trying, it may take a minute or tow.

## Initialization
To initialize L1 and L2 open a new treminal, go to the project's root directory, and run the following commands:
```sh
npx hardhat compile
npx hardhat --network optimism run ./scripts/initL1.js
npx hardhat --network optimism run ./scripts/initL2.js
```

The last command will produce an output in the following form:
```
  L1_ERC20 deployed [0xAddress1]
  L2_ERC20 deployed [0xAddress2]
```

Copy those two addresses, and update them in `test/test.js`:
```javascript
const L2BBS_ADDRESS ='[0xAddress1]';
const L1BBS_ADDRESS ='[0xAddress2]';
```

## Test
Now you can run our test, printing the cost calculations:
```sh
npx hardhat --network optimism test ./test/test.js
```
