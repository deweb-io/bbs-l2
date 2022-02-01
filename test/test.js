const hre = require('hardhat');
const provider = require(`./${process.env.POC_NETWOTK}-funcs`);
require('dotenv').config();

const L2BBS_ADDRESS ='0x5FbDB2315678afecb367f032d93F642f64180aa3';

let accounts;
let registry;
let bbsTokenL2;
let operator1;



describe(`L2 ${process.env.POC_NETWOTK} testing`, () => {
    before(async() => {
        accounts = await ethers.getSigners();
        await provider.beforeTest();
    });

    if (process.env.POC_L1 != 'y'){
        it('Deploy BBS contract', async() => {
            const BBSTokenL2 = await hre.ethers.getContractFactory('BBSTokenL1');
            bbsTokenL2 = await BBSTokenL2.deploy();
            await bbsTokenL2.deployed();
            console.log('bbsTokenL2 deployed:', bbsTokenL2.address);
        });

        it('Mint 1000 BBS into accounts[0]', async() => {
            //await callTXandGas (bbsTokenL2.estimateGas.mint, accounts[0].address, 1000);
            await provider.callContract(bbsTokenL2, 'mint', accounts[0].address, 1000);

            console.log('Minted 1000 BBS into:', accounts[0].address, 'current balance:',
                (await provider.callContract(bbsTokenL2, 'balanceOf', accounts[0].address)).toNumber()
            );
        });
    }

    it('Deploy registery contract', async() => {
        const Registry = await hre.ethers.getContractFactory('Registry');
        registry = await Registry.deploy();
        await registry.deployed();
        console.log('registry deployed:', registry.address);
    });

    it('Deploy operator (deweb) contract ', async() => {
        const OperatorContract = await hre.ethers.getContractFactory('OperatorContract');
        operator1 = await OperatorContract.deploy(L2BBS_ADDRESS, registry.address);
        await operator1.deployed();
        console.log('operator1 (deweb) address:', operator1.address);
    });

    it('Execute register deweb', async() => {
        provider.callContract(registry, 'registerDeweb', operator1.address);
    });

    it('Execute register user on operator1', async() => {
        await provider.callContract(registry, 'registerUser', operator1.address, 'user1@domain1');
    });

    it('Execute addComunity (in operator contract & registery)', async() => {
        await provider.callContract(operator1, 'addComunity', 'TST', 'user1@domain1', 20, accounts[1].address, accounts[2].address);
    });

    it('Chack balance in accounts before roilties', async() => {
        //const erc20L2Artifact = require('../node_modules/@eth-optimism/contracts/artifacts-ovm/contracts/optimistic-ethereum/libraries/standards/L2StandardERC20.sol/L2StandardERC20.json');
        //bbsTokenL2 = await hre.ethers.getContractAt(erc20L2Artifact.abi, L2BBS_ADDRESS, accounts[0]);
        await printBalances();
    });

    it('Execute user1@domain1 approving to operator1 transfer (to buy CT)', async() => {
        await provider.callContract(bbsTokenL2, 'approve', operator1.address, 10);
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
            (await provider.callContract(operator1, 'communities', 'TST')).nextQAdd.toNumber() ,
            (await provider.callContract(operator1, 'communities', 'TST')).nextQExchange.toNumber()
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
            (await provider.callContract(operator1, 'communities','TST')).nextQAdd.toNumber() ,
            (await provider.callContract(operator1, 'communities', 'TST')).nextQExchange.toNumber()
        );
    });
});

async function printBalances() {
    console.log('deWeb balance (operator & deWeb):',
        (await provider.callContract(bbsTokenL2, 'balanceOf', operator1.address)).toNumber(),
        'Community owner balance:',
        (await provider.callContract(bbsTokenL2, 'balanceOf', accounts[1].address)).toNumber(),
        'Cashier balance:',
        (await provider.callContract(bbsTokenL2, 'balanceOf', accounts[2].address)).toNumber()
    );
}


//callContract is an envelop function that changes slightly between blockchains
//It's arguments are: contract (obj), func name(string) & the function's arguments
/*async function callContract() {
    let [contract, funcName, ...args] = arguments;
    return await contract[funcName](...args);
}*/

/*
let callContract;
callContract = baseCall;
async function baseCall() {
    let [contract, funcName, ...args] = arguments;
    return await contract[funcName](...args);
}
async function callEdge(){
    const result = baseCall(...arguments);
    await new Promise(resolve => setTimeout(resolve, 6000));
    return result;
}
async function callOptimism(){
    let [contract, funcName, ...args] = arguments;
    const gasCost = await (contract.estimateGas[funcName](...args)).toNumber();
    console.log ('Gas costs = ', gasCost * gasPrice , ' Estimated at ', gasCost * gasPrice * WEI2USD , '$', EXCHANGE_RATE_DATE);
    return await contract[funcName](...args);
}
//function callHardhat(){}

if(process.env.POC_NETWOTK === 'o'){callContract = callOptimism;}
else if(process.env.POC_NETWOTK === 'e'){callContract = callEdge;}


*/
async function callTXandGas() {
    let [func, ...args] = arguments;
    let gasPrice = 3; let WEI2USD = 4;
    const gasCost = (await func(...args)).toNumber();
    console.log ('TEST Gas costs = ', gasCost * gasPrice , ' Estimated at ', gasCost * gasPrice * WEI2USD , '$');
}
