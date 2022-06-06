var IzdNFT = artifacts.require("./IzenDome.sol")
var IZDToken = artifacts.require("./IZDToken.sol")
var Buyland = artifacts.require("./Buyland.sol")

module.exports = function(deployer) {
  deployer.deploy(IzdNFT);
  deployer.deploy(IZDToken);
  deployer.deploy(Buyland);
};
