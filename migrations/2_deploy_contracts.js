var TokenERC20 = artifacts.require('./TokenERC20.sol');
var Association = artifacts.require('./Association.sol');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(TokenERC20, 100, "TokenERC20", "TokenERC20");
  deployer.deploy(Association, TokenERC20.address, 10, 30);
}
