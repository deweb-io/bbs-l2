const hre = require('hardhat');
const provider = require(`./${process.env.POC_NETWOTK}-funcs`);
require('dotenv').config();

let accounts;
let registry;
let bbsTokenL2;
let operator1;

describe(`L2 ${process.env.POC_NETWOTK} testing`,  function() {
    this.timeout(0);
    before(async() => {
        accounts = await ethers.getSigners();
        console.log(accounts[0]);
        await provider.beforeTest();
    });

    it('Deploy BBS contract', async() => {
        const BBSTokenL2 = await hre.ethers.getContractFactory('BBSTokenL1');
        bbsTokenL2 = await BBSTokenL2.deploy();
        await bbsTokenL2.deployed();
        console.log('bbsTokenL2 deployed:', bbsTokenL2.address);
    });

    it('Mint 1000 BBS into accounts[0]', async() => {
        await provider.callContract(bbsTokenL2, 'mint', accounts[0].address, 1000);
        console.log('Minted 1000 BBS into:', accounts[0].address, 'current balance:',
            (await bbsTokenL2.balanceOf(accounts[0].address)).toNumber()
        );
    });

    it('Deploy registery contract', async() => {
        const Registry = await hre.ethers.getContractFactory('Registry');
        registry = await Registry.deploy();
        await registry.deployed();
        console.log('registry deployed:', registry.address);
    });

    it('Deploy operator (deweb) contract ', async() => {
        const OperatorContract = await hre.ethers.getContractFactory('OperatorContract');
        operator1 = await OperatorContract.deploy(bbsTokenL2.address, registry.address);
        await operator1.deployed();
        console.log('operator1 (deweb) address:', operator1.address);
    });

    it('Execute register deweb', async() => {
        await provider.callContract(registry, 'registerDeweb', operator1.address);
    });

    it('Execute register user on operator1', async() => {
        await provider.callContract(registry, 'registerUser', operator1.address, 'user1@domain1');
    });

    it('Execute addComunity (in operator contract & registery)', async() => {
        await provider.callContract(operator1, 'addComunity', 'TST', 'user1@domain1', 20, accounts[1].address, accounts[2].address);
    });

    it('Envoke an event with a long text print', async() => {
        await provider.callContract(
            operator1, 'printEvent', 'TST', 'user1@domain1', new Array(7000).join('1'));
    });

    it('Chack balance in accounts before royalties', async() => {
        await printBalances();
    });

    it('Execute user1@domain1=account[0] approving to operator1 transfer (to buy CT)', async() => {
        await provider.callContract(bbsTokenL2, 'approve', operator1.address, 11);
    });

    it('Execute user1@domain1 buying community tokens (roilties)', async() => {
        bbsTokenL2 = bbsTokenL2.connect(accounts[1]);
        await provider.callContract(operator1, 'buyCommunityTokens', 'TST', 10, accounts[0].address, 'user1@domain1');
    });

    it('Chack balance in accounts after roilties', async() => {
        await printBalances();
    });

    it('Execute queue exchange request val={2|3|4}', async() => {
        await provider.callContract(operator1,'queueExchangeRequest', 'TST', 2, accounts[1].address, 'user1@domain1');
        await provider.callContract(operator1, 'queueExchangeRequest', 'TST', 3, accounts[1].address, 'user1@domain1');
        await provider.callContract(operator1, 'queueExchangeRequest', 'TST', 4, accounts[1].address, 'user1@domain1');
        console.log('TST community cashierQ nextQAdd, nextQExchange',
            (await operator1.communities('TST')).nextQAdd.toNumber() ,
            (await operator1.communities('TST')).nextQExchange.toNumber()
        );
    });

    it('Execute cashier approving transfer to operator1 (to buy BBS)', async() => {
        bbsTokenL2 = bbsTokenL2.connect(accounts[2]);
        await provider.callContract(bbsTokenL2, 'approve', operator1.address, 5);
    });

    it('Execute queue requests', async() => {
        await provider.callContract(operator1, 'ExecuteQueueRequests', 'TST');
        await printBalances();
        console.log('TST Q nextQAdd, nextQExchange',
            (await operator1.communities('TST')).nextQAdd.toNumber() ,
            (await operator1.communities('TST')).nextQExchange.toNumber()
        );
    });
});

async function printBalances() {
    console.log('deWeb balance (operator & deWeb):',
        (await bbsTokenL2.balanceOf(operator1.address)).toNumber(),
        'Community owner balance:',
        (await bbsTokenL2.balanceOf(accounts[1].address)).toNumber(),
        'Cashier balance:',
        (await bbsTokenL2.balanceOf(accounts[2].address)).toNumber()
    );
}
