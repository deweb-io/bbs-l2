/*optimism local noad*/
const WEI2USD = 0.00000041/100000000;
const EXCHANGE_RATE_DATE = '24/10/2021';
let gasPrice;

module.exports = {
    beforeTest: async function() {
        //get gas price for optimism
        //const l2RpcProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545')//optinism local node
        //const key = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' //hadrhat local node
        const l2RpcProvider = new ethers.providers.JsonRpcProvider('https://mainnet.optimism.io');//'https://kovan.optimism.io')
        const key =   '0xe013c13dcf62b53cbe070b00a6886924f58d944d2b43b4aa4050adde3bf7b8e3'; //MY WORK METAMASK KEY
        const l2Wallet = new ethers.Wallet(key,l2RpcProvider);
        gasPrice = (await l2Wallet.provider.getGasPrice()).toNumber();
        console.log ('gas price:', gasPrice, ' Estimated at ', gasPrice * WEI2USD , '$' );
    },
    callContract: async function() {
        let [contract, funcName, ...args] = arguments;
        console.log ('contract.estimateGas[funcName]:', contract.estimateGas[funcName],
            ' ...args:', ...args, ' typeOf(args):', typeof(args));
        const gasCost = await (contract.estimateGas[funcName](...args));
        console.log ('Gas costs = ', gasCost * gasPrice , ' Estimated at ', gasCost * gasPrice * WEI2USD , '$', EXCHANGE_RATE_DATE);
        return await contract[funcName](...args);
    }
};
