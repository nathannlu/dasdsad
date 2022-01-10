//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTCollectible is ERC721Enumerable, Ownable {
	using SafeMath for uint256;
	using Counters for Counters.Counter;

	Counters.Counter private _tokenIds;

	// @TODO change these to be initialized in constructor
	uint public PRICE;
	uint public MAX_SUPPLY;
	uint public constant MAX_PER_MINT = 1;

	string public baseTokenURI;

	constructor(string memory baseURI, uint priceInWei, uint maxSupply ) ERC721("NFT Collectible", "NFTC") {
		setBaseURI(baseURI);

		PRICE = priceInWei;
		MAX_SUPPLY = maxSupply;
//		MAX_PER_MINT = maxPerMint;
	}

	
	// Override empty function to return basetokenURI
	// to tell our contract that baseTokenURI is the base URI our contract must use
	function _baseURI() internal view virtual override returns (string memory) {
		return baseTokenURI;
	}
	function setBaseURI(string memory _baseTokenURI) public onlyOwner {
		baseTokenURI = _baseTokenURI;	
	}


	// Let the creator of the project reserve a number of NFT
	// for giveaways, etc
	function reserveNFTs() public onlyOwner {
		// Check total minted NFTs to ensure there are
		// enough NFTs left in the collection to reserve
		uint totalMinted = _tokenIds.current();
		require(
			totalMinted.add(10) < MAX_SUPPLY, "Not enough NFTs"
		);

		// Proceed with reserving
		for (uint i = 0; i < 10; i++) {
			_mintSingleNFT();
		}
	}


	// Call this function to purchase and mint NFTs from collection
	// @NOTE - since they are sending ether to this function, we have to mark it as "payable"
	// Function needs to make 3 checks before we mint
	//	1. There are enough NFTs left in the collection for the caller to mint the requested amount
	//	2. The caller has requested to mint more than 0 and less than the maximum number of NFTs allowed per transaction
	//	3. The caller has sent enough ether to mint the requested number of NFTs
	function mintNFTs(uint _count) public payable {
		uint totalMinted = _tokenIds.current();

		// 1. There are enough NFTs left in the colection for the caller to mint the requested amount
		require(
			totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs"
		);

		// 2. The caller has requested to mint more than 0 and less than the maximum number of NFTs allowed per transaction
		require(
			_count > 0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs."
		);

		// 3. The caller has sent enough ether to mint the requested number of NFTs
		require(
			msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs."
		);

		// Proceed with minting
		for (uint i = 0; i < _count; i++) {
			_mintSingleNFT();
		}
	}

	function _mintSingleNFT() private {
		uint newTokenID = _tokenIds.current();
		_safeMint(msg.sender, newTokenID);
		_tokenIds.increment();
	}


	// Getting all tokens owned by a particular address
	function tokensOfOwner(address _owner) external view returns (uint[] memory) {
		uint tokenCount = balanceOf(_owner);
		uint[] memory tokensId = new uint256[](tokenCount);

		for (uint i = 0; i < tokenCount; i++) {
			tokensId[i] = tokenOfOwnerByIndex(_owner, i);
		}

		return tokensId;
	}


	// Payout owner function
	function withdraw() public payable onlyOwner {
		uint balance = address(this).balance;
		require(
			balance > 0, "No ether left to withdraw"
		);

		(bool success, ) = (msg.sender).call{value: balance}("");
		require(
			success, "Transfer failed."
		);
	}

}
