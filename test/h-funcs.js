/*hardhat*/
module.exports = {
    beforeTest: function() {},
    callContract: async function() {
        let [contract, funcName, ...args] = arguments;
        return await contract[funcName](...args);
    }
};
