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

    // checks whether NFT exists
    modifier exists(uint tokenId) {
        require(_ownerOf(tokenId) != address(0), "NFT with specified tokenId doesn't exist.");
        _;
    }

      /// @dev mint token , set tokenURI and return currentTokenId
     /// @param _tokenURI, a tokenURI obtained from IPFS
     /// @return currentTokenId, current token id
    function createToken(string memory _tokenURI, uint256 price) external returns(uint256) {
        uint256 currentTokenId = _tokenId.current(); // get current tokenId
        _tokenId.increment(); // increment tokenId
        _mint(msg.sender,currentTokenId); // mint token
        _setTokenURI(currentTokenId,_tokenURI); // set token uri from IPFS
         createNFT(currentTokenId,price);
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

     /// @dev NFT sales functionality and process payment to seller
    /// @param tokenId,  NFT token id
    function sellNFT(uint256 tokenId) external payable exists(tokenId) {
        require(!NFT_ID[tokenId].sold, "Already sold.");
        uint256 _price = NFT_ID[tokenId].price;
        address seller = NFT_ID[tokenId].seller;
        require(msg.value == _price, "incorrect amount");
        NFT_ID[tokenId].owner = payable(msg.sender);
        NFT_ID[tokenId].seller = payable(address(0)); // set seller to empty address
        NFT_ID[tokenId].sold = true;
        _soldItems.increment();

        (bool success,) = payable(seller).call{value : msg.value}(""); // make payment to seller
        require(success, "payment failed");
        _transfer(address(this),msg.sender,tokenId); // transfer ownership to sender

        emit NFT_Action(
            tokenId,
            msg.sender,
            address(0),
            _price,
            true,
            "Sold NFT successfully"
        );
    }

      /// @notice All nfts retrieval,
    /// @return props
    function allNfts() external view returns (NFT[] memory) {
        uint currentTokenId = _tokenId.current();
        NFT[] memory items = new NFT[](currentTokenId);
        for (uint i = 0; i < items.length; i++) {
            items[i] = NFT_ID[i];
        }

        return items;
    }

     /// @notice retrieval of single nft
    /// @return props
    function singleNFT(uint256 tokenId) external view exists(tokenId) returns(NFT memory props){
        props = NFT_ID[tokenId];
    }

      /// @notice retrieval of all purchased nfts that belong to a user
    /// @return props
    function userNfts() external view returns (NFT[] memory) {
    uint currentTokenId = _tokenId.current();
    uint itemCount = 0;

    for (uint i = 0; i < currentTokenId; i++) {
        if (NFT_ID[i].owner == msg.sender) {
            itemCount++;
        }
    }

    NFT[] memory items = new NFT[](itemCount);
    itemCount = 0;

    // Populate the array with user's NFTs
    for (uint i = 0; i < currentTokenId; i++) {
        if (NFT_ID[i].owner == msg.sender) {
            items[itemCount] = NFT_ID[i];
            itemCount++;
        }
    }

    return items;
}

/// @notice retrieve nft price
/// @param tokenId ,tokenId
/// @return uint256
function getNftPrice(uint256 tokenId) external view exists(tokenId) returns(uint256){
    return NFT_ID[tokenId].price;
}







    






}
