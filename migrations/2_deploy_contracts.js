const NFTCollectible = artifacts.require("NFTCollectible");

module.exports = function(deployer) {
  deployer.deploy(NFTCollectible);
};
