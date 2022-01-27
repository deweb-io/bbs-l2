//const {expect} = require('chai');
//const {expectRevert} = require('./utils');

const hre = require("hardhat");

let accounts;
let gasPrice;
let registry;
let bbsTokenL2;
let operator1;


describe('Polygon test', () => {
  before(async() => {
    console.log ('=== process.env ===', process.env);
     accounts = await hre.ethers.getSigners();
     //console.log("accounts", accounts);
  });

    it('Deploy BBS contract', async() => {
      const BBSTokenL2 = await hre.ethers.getContractFactory("BBSTokenL1");
      bbsTokenL2 = await BBSTokenL2.deploy();
      await bbsTokenL2.deployed();
      console.log("bbsTokenL2 deployed:", bbsTokenL2.address);
    });

    it('Mint 1000 BBS into accounts[0]', async() => {
      await bbsTokenL2.mint(accounts[0].address, 1000);
      console.log("bbsTokenL2 mint 1000 BBS into:", accounts[0]);
    });

    it('Deploy registery contract', async() => {
      const Registry = await hre.ethers.getContractFactory("Registry");
      registry = await Registry.deploy();
      await registry.deployed();
      console.log("registry deployed:", registry.address);
    });

    it('Deploy operator contract ', async() => {
      // Deploy OperatorContract for Dweb
      const OperatorContract = await hre.ethers.getContractFactory("OperatorContract");
      operator1 = await OperatorContract.deploy(bbsTokenL2.address, registry.address);
      await operator1.deployed();
      console.log("operator1 (deWeb) deployed:", operator1.address);
    });

    it('Execute register dweb', async() => {
      //console.log ("callTXandGas -> registry.registerDweb():" );
      //await callTXandGas (registry.estimateGas.registerDweb, operator1.address);
      await registry.registerDeweb(operator1.address);
    });

    it('Execute register user', async() => {
      //console.log ("callTXandGas -> registry.registerUser:");
      //await callTXandGas (registry.estimateGas.registerUser, operator1.address, "user1@domain1");
      await registry.registerUser(operator1.address, "user1@domain1");
    });

    it('Execute addComunity (in operator contract & registery)', async() => {
      //console.log ("callTXandGas -> operatorContract.addComunity:");
      //await callTXandGas (operator1.estimateGas.addComunity, "TST", "user1@domain1", 20, accounts[1].address, accounts[2].address);
      await operator1.addComunity("TST", "user1@domain1", 20, accounts[1].address, accounts[2].address);
    });

    it('Chack balance in accounts before roilties', async() => {
      //const erc20L2Artifact = require('../node_modules/@eth-optimism/contracts/artifacts-ovm/contracts/optimistic-ethereum/libraries/standards/L2StandardERC20.sol/L2StandardERC20.json')
      //bbsTokenL2 = await hre.ethers.getContractAt(erc20L2Artifact.abi, L2BBS_ADDRESS, accounts[0]);

      //console.log ("callTXandGas -> (single) bbsTokenL2.balanceOf:");
      //await callTXandGas (bbsTokenL2.estimateGas.balanceOf, accounts[1].address);
      console.log("Dweb balance (operator & DWEB):", (await bbsTokenL2.balanceOf(operator1.address)).toNumber());
      console.log("Community owner balance:", (await bbsTokenL2.balanceOf(accounts[1].address)).toNumber());
      console.log("Cashier balance:", (await bbsTokenL2.balanceOf(accounts[2].address)).toNumber());
    });

    it('Execute user1@domain1 approving to operator1 transfer (to buy CT)', async() => {
      //console.log ("callTXandGas -> bbsTokenL2.approve:");
      //await callTXandGas (bbsTokenL2.estimateGas.approve, operator1.address, 10);
      await bbsTokenL2.approve(operator1.address, 10);
    });

    it('Execute user1@domain1 buying community tokens (roilties)', async() => {
      bbsTokenL2 = bbsTokenL2.connect(accounts[1]);
      //console.log ("callTXandGas -> operator1.buyCommunityTokens:");
      //await callTXandGas (operator1.estimateGas.buyCommunityTokens,"TST", 10, accounts[0].address, "user1@domain1");
      await operator1.buyCommunityTokens("TST", 10, accounts[0].address, "user1@domain1");
    });

    it('Chack balance in accounts after roilties', async() => {
      //console.log ("callTXandGas -> (single) bbsTokenL2.balanceOf:");
      //await callTXandGas (bbsTokenL2.estimateGas.balanceOf, accounts[1].address);
      console.log("Dweb balance (operator & DWEB):", (await bbsTokenL2.balanceOf(operator1.address)).toNumber());
      console.log("Community owner balance:", (await bbsTokenL2.balanceOf(accounts[1].address)).toNumber());
      console.log("Cashier balance:", (await bbsTokenL2.balanceOf(accounts[2].address)).toNumber());
    });

    it('Execute queue exchange request val={2|3|4}', async() => {
      //console.log ("callTXandGas -> (single) operator1.queueExchangeRequest:");
      //await callTXandGas (operator1.estimateGas.queueExchangeRequest, "TST", 2, accounts[1].address, "user1@domain1");
      await operator1.queueExchangeRequest("TST", 2, accounts[1].address, "user1@domain1");
      await operator1.queueExchangeRequest("TST", 3, accounts[1].address, "user1@domain1");
      await operator1.queueExchangeRequest("TST", 4, accounts[1].address, "user1@domain1");
      console.log("TST community cashierQ nextQAdd, nextQExchange", (await operator1.communities('TST')).nextQAdd.toNumber() , (await operator1.communities('TST')).nextQExchange.toNumber());
    });

    it('Execute cashier approving transfer to operator1 (to buy BBS)', async() => {
      bbsTokenL2 = bbsTokenL2.connect(accounts[2]);
      //console.log ("callTXandGas -> bbsTokenL2.approve:");
      //await callTXandGas (bbsTokenL2.estimateGas.approve, operator1.address, 5);
      await bbsTokenL2.approve(operator1.address, 5);
    });

    it('Execute queue requests', async() => {
      //console.log ("callTXandGas -> operator1.ExecuteQueueRequests:");
      //await callTXandGas (operator1.estimateGas.ExecuteQueueRequests, "TST");
      const executedFromQ = await operator1.ExecuteQueueRequests("TST");
      console.log("Community owner balance (bbs buyer):", (await bbsTokenL2.balanceOf(accounts[1].address)).toNumber());
      console.log("Cashier balance (bbs seller):", (await bbsTokenL2.balanceOf(accounts[2].address)).toNumber());
      console.log("TST Q nextQAdd, nextQExchange", (await operator1.communities('TST')).nextQAdd.toNumber() , (await operator1.communities('TST')).nextQExchange.toNumber());
    });
});
