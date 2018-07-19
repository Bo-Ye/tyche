var AdvancedToken = artifacts.require('./AdvancedToken.sol');
var Association = artifacts.require('./Association.sol');

module.exports = function (deployer, network, accounts) {
  //accounts[0] is administrator
  deployer.deploy(AdvancedToken, "Shares Token", "Shares Token", 10, {from: accounts[0]}).then(
       () => {
            return AdvancedToken.deployed().then(instance => {
                for(var i = 1 ;i < 10; i++ ){
                    instance.transfer(accounts[i], 1e18, {from: accounts[0]});
                }
                return deployer.deploy(Association, instance.address, 6, 60, {from: accounts[0]});
            });
       }
  );
}