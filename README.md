# bbs-l2

This is a POC, testing and measuring tool for alternative layer 2 solutions for the BBS project.

The code is meant to test our specific needs from a later 2 solution, and may contain different branches to test different solutions.

The current test is done on top of the Optimism network (future tests will probably include Polygon, BSC, and maybe even non-EVM solutions like Solana), and to run it you need to first run a local optimism node (see their [documentation](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/hardhat), just stop just before the 'Migrate a Dapp to Optimistic Ethereum' section).

The last command you entered was:
```sh
docker-compose -f docker-compose-nobuild.yml up -t 3600
```
and your local node is up.

From a new terminal, within the projects root directory, run the following commands:
```sh
# This will compile the contracts
npx hardhat compile
# This will initialize your local layer 1
npx hardhat --network optimism run ./scripts/initL1.js
# This will initialize your local layer 2 and relay tokens from L1
npx hardhat --network optimism run ./scripts/initL2.js
# This will run our tests, printing the cost calculations
npx hardhat --network optimism test ./test/test.js
```
