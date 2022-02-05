//const NFTCollectible = artifacts.require("NFTCollectible");
const NFTCollectible = artifacts.require("nftartgenflat");

module.exports = function(deployer) {
  deployer.deploy(NFTCollectible);
};
