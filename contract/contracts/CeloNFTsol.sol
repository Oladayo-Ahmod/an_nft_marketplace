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

      /// @notice NFT event action
      /// @dev handled all events related to nfts in the contract
      /// @param tokenId, @param owner, @param seller, @param price, @param sold
    event NFT_Action(
        uint256 tokenId,
        address owner,
        address seller,
        uint256 price,
        bool sold,
        string message
    );


     constructor() ERC721("CeloNFT", "ASG"){
        owner = payable(msg.sender);
    }

      /// @dev mint token , set tokenURI and return currentTokenId
     /// @param _tokenURI, a tokenURI obtained from IPFS
     /// @return currentTokenId, current token id
    function createToken(string memory _tokenURI, uint256 price) external returns(uint256) {
        _tokenId.increment(); // increment tokenId
        uint256 currentTokenId = _tokenId.current(); // get current tokenId
        _mint(msg.sender,currentTokenId); // mint token
        _setTokenURI(currentTokenId,_tokenURI); // set token uri from IPFS

        return currentTokenId;
    }

     function createNFT(uint256 tokenId, uint256 price) internal {
        uint256 currentTokenId = _tokenId.current();
        NFT_ID[currentTokenId] = NFT(
            payable(address(this)),
            payable(msg.sender),
            price,
            false,
            tokenId
        );

        _transfer(msg.sender,address(this),tokenId); // transfer ownership of nft to the marketplace owner

        emit NFT_Action(
            tokenId,
            address(this),
            msg.sender,
            price,
            false,
            "NFT created successfuly"
        );

    }






}
