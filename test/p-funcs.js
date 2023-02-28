/*hardhat*/
module.exports = {
    beforeTest: function() {},
    bridgeFromL1toL2: async function() {
        
    },
    callContract: async function() {
        let [contract, funcName, ...args] = arguments;
        //return await contract[funcName](...args);
        const result = await contract[funcName](...args);
        await new Promise(resolve => setTimeout(resolve, 6000));
        return result;
    }
};
