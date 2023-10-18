// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CeloNFT is ERC721URIStorage {

     /// @notice implement the Counter libarary for counting tokenId
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId; // tokenId
    Counters.Counter  private _soldItems; // total items
    address payable owner;
    mapping (uint256 => NFT) NFT_ID;

    // nft struct
     struct NFT {
        address owner;
        address seller;
        uint256 price;
        bool sold;
        uint256 tokenId;
    }

     constructor() ERC721("CeloNFT", "ASG"){
        owner = payable(msg.sender);
    }
    



}
