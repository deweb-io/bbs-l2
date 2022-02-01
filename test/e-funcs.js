/*edgeware (polkadot) local noad*/
module.exports = {
    beforeTest: function() {},
    callContract: async function() {
        let [contract, funcName, ...args] = arguments;
        const result = await contract[funcName](...args);
        await new Promise(resolve => setTimeout(resolve, 6000));
        return result;
    }
};
