// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CeloNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address payable owner;

    mapping(uint256 => NFT) private nfts;
    mapping(address => uint256[]) private ownedNFTs;

    struct NFT {
        address owner;
        uint256 price;
        bool sold;
    }

    event NFT_Action(
        uint256 tokenId,
        address owner,
        uint256 price,
        bool sold,
        string message
    );

    constructor() ERC721("CeloNFT", "ASG") {
        owner = payable(msg.sender);
    }

    function createToken(string memory _tokenURI, uint256 price) external returns (uint256) {
        _tokenId.increment();
        uint256 currentTokenId = _tokenId.current();
        _mint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, _tokenURI);
        createNFT(currentTokenId, price);
        return currentTokenId;
    }

    function createNFT(uint256 tokenId, uint256 price) internal {
        nfts[tokenId] = NFT(payable(msg.sender), price, false);
        ownedNFTs[msg.sender].push(tokenId);
        emit NFT_Action(tokenId, msg.sender, price, false, "NFT created successfully");
    }

    function sellNFT(uint256 tokenId) external payable {
        require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");
        uint256 _price = nfts[tokenId].price;
        require(msg.value == _price, "Incorrect amount sent");
        (bool success, ) = payable(owner).call{value: _price}("");
        require(success, "Payment to seller failed");

        nfts[tokenId].owner = payable(msg.sender);
        nfts[tokenId].sold = true;

        _transfer(msg.sender, address(this), tokenId);
        emit NFT_Action(tokenId, msg.sender, _price, true, "Sold NFT successfully");
    }

    function allNfts() external view returns (NFT[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenId.current(); i++) {
            if (!nfts[i].sold) {
                count++;
            }
        }

        NFT[] memory items = new NFT[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _tokenId.current(); i++) {
            if (!nfts[i].sold) {
                items[index] = nfts[i];
                index++;
            }
        }

        return items;
    }

    function userNfts() external view returns (NFT[] memory) {
        uint256[] memory userNFTs = ownedNFTs[msg.sender];
        NFT[] memory items = new NFT[](userNFTs.length);
        for (uint256 i = 0; i < userNFTs.length; i++) {
            items[i] = nfts[userNFTs[i]];
        }
        return items;
    }

    function getNftPrice(uint256 tokenId) external view returns (uint256) {
        return nfts[tokenId].price;
    }
}
