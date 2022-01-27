const hre = require("hardhat");
require('dotenv').config();


  const L2BBS_ADDRESS ='0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const WEI2USD = 0.00000041/100000000;
  const EXCHANGE_RATE_DATE = '24/10/2021'

  let accounts;
  let gasPrice;
  let registry;
  let bbsTokenL2;
  let operator1;


describe(`L2 ${process.env.POC_NETWOTK} testing`, () => {
  before(async() => {
     accounts = await ethers.getSigners();

     if (process.env.POC_NETWOTK.network === 'o'){
       //get gas price
       //const l2RpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
       //const key = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' //
       const l2RpcProvider = new ethers.providers.JsonRpcProvider('https://mainnet.optimism.io');//'https://kovan.optimism.io')
       const key =   '0xe013c13dcf62b53cbe070b00a6886924f58d944d2b43b4aa4050adde3bf7b8e3' //MY WORK METAMASK KEY
       const l2Wallet = new ethers.Wallet(key,l2RpcProvider)
       gasPrice = (await l2Wallet.provider.getGasPrice()).toNumber();
       console.log ("gas price:", gasPrice, " Estimated at ", gasPrice * WEI2USD , "$" );
     }
  });

  if (process.env.POC_L1 != 'y'){
    it('Deploy BBS contract', async() => {
      const BBSTokenL2 = await hre.ethers.getContractFactory("BBSTokenL1");
      bbsTokenL2 = await BBSTokenL2.deploy();
      await bbsTokenL2.deployed();
      console.log("bbsTokenL2 deployed:", bbsTokenL2.address);
    });

    it('Mint 1000 BBS into accounts[0]', async() => {
      await bbsTokenL2.mint(accounts[0].address, 1000);
      await new Promise(resolve => setTimeout(resolve, 6000));
      console.log(`Minted 1000 BBS into: ${accounts[0].address}
        current balance: ${await bbsTokenL2.balanceOf(accounts[0].address)}`);
    });
  }

  it('Deploy registery contract', async() => {
    const Registry = await hre.ethers.getContractFactory("Registry");
    registry = await Registry.deploy();
    await registry.deployed();
    console.log("registry deployed:", registry.address);
  });

  it('Deploy operator contract ', async() => {
    // Deploy OperatorContract for deWeb
    const OperatorContract = await hre.ethers.getContractFactory("OperatorContract");
    operator1 = await OperatorContract.deploy(L2BBS_ADDRESS, registry.address);
    await operator1.deployed();
    console.log("operator1 (deWeb) deployed:", operator1.address);
  });

  it('Execute register deWeb', async() => {
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (registry.estimateGas.registerdeWeb, operator1.address);
    }
    await registry.registerDeweb(operator1.address);
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
    //await network.provider.send('evm_mine');
  });

  it('Execute register user', async() => {
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (registry.estimateGas.registerUser, operator1.address, "user1@domain1");
    }

    console.log("operator1.address:", operator1.address);
    console.log("registry.operators[_operator_contract]:");
    console.log(await(registry.operators(operator1.address)));
    await registry.registerUser(operator1.address, "user1@domain1");
    if (process.env.POC_NETWOTK.network === 'e'){await new Promise(resolve => setTimeout(resolve, 10000));}
  });

  it('Execute addComunity (in operator contract & registery)', async() => {
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (operator1.estimateGas.addComunity, "TST", "user1@domain1", 20, accounts[1].address, accounts[2].address);
    }
    await operator1.addComunity("TST", "user1@domain1", 20, accounts[1].address, accounts[2].address);
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
  });

  it('Chack balance in accounts before roilties', async() => {
    const erc20L2Artifact = require('../node_modules/@eth-optimism/contracts/artifacts-ovm/contracts/optimistic-ethereum/libraries/standards/L2StandardERC20.sol/L2StandardERC20.json')
    bbsTokenL2 = await hre.ethers.getContractAt(erc20L2Artifact.abi, L2BBS_ADDRESS, accounts[0]);

    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (bbsTokenL2.estimateGas.balanceOf, accounts[1].address);
    }
    console.log("deWeb balance (operator & deWeb):", (await bbsTokenL2.balanceOf(operator1.address)).toNumber());
    console.log("Community owner balance:", (await bbsTokenL2.balanceOf(accounts[1].address)).toNumber());
    console.log("Cashier balance:", (await bbsTokenL2.balanceOf(accounts[2].address)).toNumber());
  });

  it('Execute user1@domain1 approving to operator1 transfer (to buy CT)', async() => {
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (bbsTokenL2.estimateGas.approve, operator1.address, 10);
    }
    await bbsTokenL2.approve(operator1.address, 10);
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
  });

  it('Execute user1@domain1 buying community tokens (roilties)', async() => {
    bbsTokenL2 = bbsTokenL2.connect(accounts[1]);
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (operator1.estimateGas.buyCommunityTokens,"TST", 10, accounts[0].address, "user1@domain1");
    }
    await operator1.buyCommunityTokens("TST", 10, accounts[0].address, "user1@domain1");
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
  });

  it('Chack balance in accounts after roilties', async() => {
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (bbsTokenL2.estimateGas.balanceOf, accounts[1].address);
    }
    console.log("deWeb balance (operator & deWeb):", (await bbsTokenL2.balanceOf(operator1.address)).toNumber());
    console.log("Community owner balance:", (await bbsTokenL2.balanceOf(accounts[1].address)).toNumber());
    console.log("Cashier balance:", (await bbsTokenL2.balanceOf(accounts[2].address)).toNumber());
  });

  it('Execute queue exchange request val={2|3|4}', async() => {
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (operator1.estimateGas.queueExchangeRequest, "TST", 2, accounts[1].address, "user1@domain1");
    }
    await operator1.queueExchangeRequest("TST", 2, accounts[1].address, "user1@domain1");
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
    await operator1.queueExchangeRequest("TST", 3, accounts[1].address, "user1@domain1");
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
    await operator1.queueExchangeRequest("TST", 4, accounts[1].address, "user1@domain1");
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
    console.log("TST community cashierQ nextQAdd, nextQExchange", (await operator1.communities('TST')).nextQAdd.toNumber() , (await operator1.communities('TST')).nextQExchange.toNumber());
  });

  it('Execute cashier approving transfer to operator1 (to buy BBS)', async() => {
    bbsTokenL2 = bbsTokenL2.connect(accounts[2]);
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (bbsTokenL2.estimateGas.approve, operator1.address, 5);
    }
    await bbsTokenL2.approve(operator1.address, 5);
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
  });

  it('Execute queue requests', async() => {
    if (process.env.POC_NETWOTK.network === 'o'){
      await callTXandGas (operator1.estimateGas.ExecuteQueueRequests, "TST");
    }
    const executedFromQ = await operator1.ExecuteQueueRequests("TST");
    if (process.env.POC_NETWOTK.network === 'e'){
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
    console.log("Community owner balance (bbs buyer):", (await bbsTokenL2.balanceOf(accounts[1].address)).toNumber());
    console.log("Cashier balance (bbs seller):", (await bbsTokenL2.balanceOf(accounts[2].address)).toNumber());
    console.log("TST Q nextQAdd, nextQExchange", (await operator1.communities('TST')).nextQAdd.toNumber() , (await operator1.communities('TST')).nextQExchange.toNumber());
  });



});


async function callTXandGas() {
    //console.log (arguments);
    [func, ...args] = arguments;
    const gasCost = (await func(...args)).toNumber();
    console.log ("Gas costs = ", gasCost * gasPrice , " Estimated at ", gasCost * gasPrice * WEI2USD , "$", EXCHANGE_RATE_DATE);
}
