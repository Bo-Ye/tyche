var TokenERC20 = artifacts.require('./TokenERC20.sol');
var Association = artifacts.require('./Association.sol');

module.exports = function (deployer, network, accounts) {
  //accounts[0] is administrator
  //deployer.deploy(TokenERC20, 100, "TokenERC20", "TokenERC20", 100, accounts[0]);
  //deployer.deploy(Association, TokenERC20.address, 10, 30, accounts[0]);
}
