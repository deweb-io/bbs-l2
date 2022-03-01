# bbs-l2

This is a POC, testing and measuring tool for alternative layer 2 solutions for the BBS project.

we run a bunch of test on optional L2 solutions, checking:
  Users, operators & communities registering
  Community tokens purchase
  Royalties splitting
  Printing
  Optionally we test funds transfer from L1 to L2

# Included blockchains:
    optinism
    polygonscan
    Edgeware polkadot
    (hardhat local test)

# Runing the test:
Some tests run on a local node.
Make sure to follow the node deploy process before running the test

run:
    bash test.sh

choose your requested L2 blockchain by selecting the corresponding letter
If an L1 option is available for the blockchain, a y/n question to include the transfer from L1 to L2 will be prompted.

## Optimism Setup
To run this test you need both an Ethereum provider and an Optimism provider. The easiest way to achieve this is to follow Optimism's [documentation](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/hardhat) for running L1 and L2 as local nodes.
!! stop just before the 'Migrate a Dapp to Optimistic Ethereum' section !!

The last command you entered was:
```sh
docker-compose -f docker-compose-nobuild.yml up -t 3600
```

If there are no errors, you now have both nodes running, and RPC providers are listening on two ports (8545 and 9545). If you get the error, 'could not detect network', just keep on trying, it may take a minute or tow.


## Polygon
The polygon blockchain does not have a special local node implementation since its fully evm compatible, and there for hardhat is a legit local node if required.

The test runs on mumbai TestNet

Check your costs at https://mumbai.polygonscan.com/


## Edgeware (polkadot)

to deploy a local node:
https://docs.edgeware.wiki/development/develop/smart-contracts/evm-smart-contracts/tutorials/deploy-an-evm-contract/setting-up-a-edgeware-evm-node
