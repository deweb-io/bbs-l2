/*edgeware (polkadot) local noad*/
let rpcProvider;
module.exports = {
    beforeTest: function() {
        rpcProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:9933');
        //console.log ('rpcProvider: ', rpcProvider);
    },
    bridgeFromL1toL2: async function() {},
    callContract: async function() {
        let [contract, funcName, ...args] = arguments;
        const result = await contract[funcName](...args);
        console.log (`${funcName} result: `, result);
        await rpcProvider.waitForTransaction(result.hash);
        return result;
    }
};
