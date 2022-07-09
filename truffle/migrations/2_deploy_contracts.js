//const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
var atoken = artifacts.require('./contratcs/Token/atoken.sol');
var atokenFactory = artifacts.require("./contracts/Token/atokenFactory.sol");

module.exports = async function(deployer) {
    await deployer.deploy(atoken);
    await deployer.deploy(atokenFactory, atoken.address);
}