// Plugins
require('@nomiclabs/hardhat-ethers');
require('@eth-optimism/hardhat-ovm');
require('hardhat-tracer');
//require("hardhat-gas-reporter");

module.exports = {
    networks: {
        hardhat: {
            accounts: {
                mnemonic: 'test test test test test test test test test test test junk'
            }
        },
        optimism: {
            url: 'http://127.0.0.1:8545',
            accounts: {
                mnemonic: 'test test test test test test test test test test test junk'
            },
            gasPrice: 0,
            ovm: true // This sets the network as using the ovm and ensure contract will be compiled against that.
        },
        optimismL1: {
            url: 'http://127.0.0.1:9545',
            gasLimit: 2500000,
            accounts: {
                mnemonic: 'test test test test test test test test test test test junk'
            },
            gasPrice: 0,
            ovm: true // This sets the network as using the ovm and ensure contract will be compiled against that.
        },
        matic: {
            url: 'https://rpc-mumbai.maticvigil.com',
            accounts: ['e013c13dcf62b53cbe070b00a6886924f58d944d2b43b4aa4050adde3bf7b8e3',
                '6c8329a15c2bcf7c291d9f5b3c7944ce2cb9c4d5c3444aa8e1a870f6ae7c7df3',
                'f5a8a53f648a61a2485e77b3c52552e59b6fac6e8bf53338924b179f94eed5b5']
        },
        edgeware: {
            url: 'http://127.0.0.1:9933',
            chainId: 2021,
            accounts: ['1111111111111111111111111111111111111111111111111111111111111111',
                'e013c13dcf62b53cbe070b00a6886924f58d944d2b43b4aa4050adde3bf7b8e3',
                '6c8329a15c2bcf7c291d9f5b3c7944ce2cb9c4d5c3444aa8e1a870f6ae7c7df3']
        }
    },
    solidity: '0.7.6',
    ovm: {
        solcVersion: '0.7.6'
    }
};
