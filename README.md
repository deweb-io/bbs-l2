# bbs-l2

This is a POC, testing and measuring tool for alternative layer 2 solutions for the BBS project.

The FULL POC tests the flow from L1 through the bridge to L2,
and some selected functionalities of L2 contracts:
  Users, operators & communities registering
  Community tokens purchase
  Royalties splitting
  Printing

The PARTIAL test refers solely to L2 functionalities.

## Optimism

This FULL test runs local optimistic nodes for both L1 & L2.

### Setup
To run this test you need both an Ethereum provider and an Optimism provider. The easiest way to achieve this is to follow Optimism's [documentation](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/hardhat) for running L1 and L2 as local nodes.
!! stop just before the 'Migrate a Dapp to Optimistic Ethereum' section !!

The last command you entered was:
```sh
docker-compose -f docker-compose-nobuild.yml up -t 3600
```

If there are no errors, you now have both nodes running, and RPC providers are listening on two ports (8545 and 9545). If you get the error, 'could not detect network', just keep on trying, it may take a minute or tow.

### Initialization
To initialize L1 and L2 open a new terminal, go to the project's root directory, and run the following commands:
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

Copy the L2 address, and past it into `test/test.js`:
```javascript
const L2BBS_ADDRESS ='[0xAddress1]';
```

### Test
Now you can run our test, printing the cost calculations:
```sh
npx hardhat --network optimism test ./test/test.js
```


## Polygon

This PARTIAL test runs an L2 test script on polygon mumbai TestNet

Run our test:
```sh
npx hardhat --network matic test ./test/polygon.js
```
Check your costs at https://mumbai.polygonscan.com/



## Hardhat

This PARTIAL test runs an L2 test script on the local hardhat node.

Run our test:
```sh
npx hardhat test ./test/hardhat.js
```
