// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CeloNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _soldItems;
    
    uint256 public mintingFee = 0.01 ether; // Minting fee
    
    mapping(uint256 => NFT) private nfts;
    
    event NFTMinted(address indexed owner, uint256 tokenId, string tokenURI, uint256 price);
    event NFTSold(uint256 tokenId, address indexed seller, address indexed buyer, uint256 price);

    struct NFT {
        address owner;
        address seller;
        uint256 price;
        bool sold;
    }

    constructor() ERC721("CeloNFT", "ASG") {
    }

    function createToken(string memory _tokenURI, uint256 price) external payable {
        require(msg.value >= mintingFee, "Insufficient minting fee");
        
        _tokenId.increment();
        uint256 currentTokenId = _tokenId.current();
        _mint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, _tokenURI);
        
        nfts[currentTokenId] = NFT(payable(msg.sender), address(0), price, false);
        
        emit NFTMinted(msg.sender, currentTokenId, _tokenURI, price);
    }

    function sellNFT(uint256 tokenId) external payable nonReentrant {
        require(_exists(tokenId), "NFT does not exist");
        require(!nfts[tokenId].sold, "NFT already sold");
        require(nfts[tokenId].seller == msg.sender, "You are not the seller");
        
        uint256 price = nfts[tokenId].price;
        require(msg.value == price, "Incorrect amount sent");

        nfts[tokenId].owner = payable(msg.sender);
        nfts[tokenId].seller = payable(address(0));
        nfts[tokenId].sold = true;

        _soldItems.increment();
        _transfer(address(this), msg.sender, tokenId);

        (bool success, ) = payable(owner()).call{value: price}("");
        require(success, "Payment to seller failed");
        
        emit NFTSold(tokenId, msg.sender, nfts[tokenId].owner, price);
    }

    function setMintingFee(uint256 _fee) external onlyOwner {
        mintingFee = _fee;
    }

    function getMintingFee() external view returns (uint256) {
        return mintingFee;
    }

    function allNfts() external view returns (NFT[] memory) {
        uint currentTokenId = _tokenId.current();
        NFT[] memory items = new NFT[](currentTokenId);
        for (uint i = 1; i <= currentTokenId; i++) {
            items[i - 1] = nfts[i];
        }

        return items;
    }

    function singleNFT(uint256 tokenId) external view returns (NFT memory) {
        return nfts[tokenId];
    }

    function userNfts() external view returns (NFT[] memory) {
        uint currentTokenId = _tokenId.current();
        uint itemCount = 0;

        for (uint i = 1; i <= currentTokenId; i++) {
            if (nfts[i].owner == msg.sender) {
                itemCount++;
            }
        }

        NFT[] memory items = new NFT[](itemCount);
        itemCount = 0;

        for (uint i = 1; i <= currentTokenId; i++) {
            if (nfts[i].owner == msg.sender) {
                items[itemCount] = nfts[i];
                itemCount++;
            }
        }

        return items;
    }

    function getNftPrice(uint256 tokenId) external view returns (uint256) {
        return nfts[tokenId].price;
    }

    receive() external payable {
        // Fallback function to accept Ether
    }
}
