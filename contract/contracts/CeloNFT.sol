// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @class CeloNFT
 * @dev The CeloNFT contract inherits from ERC721URIStorage, enabling the creation and management of NFTs.
 */
contract CeloNFT is ERC721URIStorage {

    using Counters for Counters.Counter;

    /**
     * @var _tokenId
     * @dev Counter for NFT tokenId.
     */
    Counters.Counter private _tokenId;

    /**
     * @var _soldItems
     * @dev Counter for the total number of sold items.
     */
    Counters.Counter private _soldItems;

    /**
     * @var owner
     * @dev Address of the contract owner.
     */
    address payable public owner;


    mapping (uint256 => NFT) NFT_ID;

    struct NFT {
        /**
         * @var owner
         * @dev Address of the current owner.
         */
        address owner;

        /**
         * @var seller
         * @dev Address of the seller.
         */
        address seller;

        /**
         * @var price
         * @dev Price of the NFT.
         */
        uint256 price;

        /**
         * @var sold
         * @dev Flag indicating if the NFT is sold.
         */
        bool sold;

        /**
         * @var tokenId
         * @dev Unique identifier for the NFT.
         */
        uint256 tokenId;
    }

    /**
     * @dev Emitted when an action related to an NFT occurs.
     * @param tokenId The tokenId of the NFT
     * @param owner The address of the current owner
     * @param seller The address of the seller
     * @param price The price of the NFT
     * @param sold A boolean indicating if the NFT is sold
     * @param message A description of the event
     */
    event NFT_Action(
        uint256 tokenId,
        address owner,
        address seller,
        uint256 price,
        bool sold,
        string message
    );

    /**
     * @dev Initializes the contract with a name and symbol, making it a place for creating and trading NFTs.
     */
    constructor() ERC721("CeloNFT", "ASG"){
        owner = payable(msg.sender);
    }

    /**
     * @dev Create a new NFT with a unique visual representation and a set price.
     * @param _tokenURI The visual representation of the NFT, typically obtained from a service like IPFS.
     * @param price The cost at which the NFT will be sold.
     * @return The identifier of the newly created NFT.
     */
    function createToken(string memory _tokenURI, uint256 price) external returns(uint256) {
        _tokenId.increment(); // increment tokenId
        uint256 currentTokenId = _tokenId.current(); // get current tokenId
        _mint(msg.sender,currentTokenId); // mint token
        _setTokenURI(currentTokenId,_tokenURI); // set token uri from IPFS
         createNFT(currentTokenId,price);
        return currentTokenId;
    }

    /**
     * @dev Internal function to create an NFT with specific details.
     * @param tokenId The unique identifier of the NFT.
     * @param price The price at which the NFT is listed for sale.
     */
    function createNFT(uint256 tokenId, uint256 price) internal {
        uint256 currentTokenId = _tokenId.current();
        // Create an NFT structure and store it using the tokenId as the key
        NFT_ID[currentTokenId] = NFT(
            payable(address(this)),
            payable(msg.sender),
            price,
            false,
            tokenId
        );

        // Transfer ownership of the NFT from the creator to the marketplace contract
        _transfer(msg.sender,address(this),tokenId); // transfer ownership of nft to the marketplace owner

        // Log an event to record the successful creation of the NFT
        emit NFT_Action(
            tokenId,
            address(this),
            msg.sender,
            price,
            false,
            "NFT created successfuly"
        );
    }

    /**
     * NFT sales functionality and process payment to seller.
     *
     * This function allows the owner to sell an NFT by transferring ownership to the buyer and processing the payment.
     *
     * @param tokenId The unique identifier of the NFT being sold.
     *
     * Requirements:
     * - The payment amount must match the NFT's price.
     * - The payment to the seller must be successful.
     * - Only the current owner can call this function.
     * - The NFT's seller is set to an empty address to mark it as sold.
     * - The NFT's status is updated to indicate that it has been sold.
     * - The ownership of the NFT is transferred to the buyer.
     *
     * @param tokenId The unique identifier of the NFT being sold.
     * @return bool True if the NFT is sold successfully.
     */
    function sellNFT(uint256 tokenId) external payable {
        uint256 _price = NFT_ID[tokenId].price;
        address seller = NFT_ID[tokenId].seller;

        // Check if the payment amount matches the NFT price
        require(msg.value == _price, "InvalidPayment: Payment amount does not match the NFT price");

        // Attempt to send payment to the seller
        (bool success, ) = payable(seller).call{value: _price}("");
        require(success, "InvalidPayment: Payment to the seller failed");

        // Update NFT ownership and status
        NFT storage nft = NFT_ID[tokenId];
        require(nft.owner == msg.sender, "UnauthorizedAccess: Only the current owner can sell the NFT");

        nft.owner = payable(msg.sender);
        nft.seller = payable(address(0)); // set seller to empty address
        nft.sold = true;

        _soldItems.increment();
        _transfer(address(this), msg.sender, tokenId); // transfer ownership to sender

        emit NFT_Action(tokenId, msg.sender, address(0), _price, true, "Sold NFT successfully");
    }


    /**
     * Retrieve information about all NFTs.
     *
     * This function allows retrieving information about all NFTs in the collection.
     *
     * @return An array of NFTs containing their details.
     */
    function allNfts() external view returns (NFT[] memory) {
        uint currentTokenId = _tokenId.current();
        NFT[] memory items = new NFT[](currentTokenId);
        for (uint i = 0; i < items.length; i++) {
            items[i] = NFT_ID[i + 1];
        }

        return items;
    }

    /**
     * Retrieve information about a single NFT.
     *
     * This function allows retrieving information about a single NFT based on its unique identifier.
     *
     * @param tokenId The unique identifier of the NFT.
     * @return An NFT containing its details.
     */
    function singleNFT(uint256 tokenId) external view returns(NFT memory props){
        props = NFT_ID[tokenId];
    }

     /**
     * Retrieve NFTs owned by the calling user.
     *
     * This function allows retrieving information about all NFTs owned by the caller.
     *
     * @return An array of NFTs owned by the caller.
     */
    function userNfts() external view returns (NFT[] memory) {
    uint currentTokenId = _tokenId.current();
    uint itemCount = 0;

    for (uint i = 1; i <= currentTokenId; i++) {
        if (NFT_ID[i].owner == msg.sender) {
            itemCount++;
        }
    }

    NFT[] memory items = new NFT[](itemCount);
    itemCount = 0;

    // Populate the array with user's NFTs
    for (uint i = 1; i <= currentTokenId; i++) {
        if (NFT_ID[i].owner == msg.sender) {
            items[itemCount] = NFT_ID[i];
            itemCount++;
        }
    }

    return items;
    }

    /**
     * Retrieve the price of an NFT.
     *
     * This function allows retrieving the price of a specific NFT based on its unique identifier.
     *
     * @param tokenId The unique identifier of the NFT.
     * @return The price of the NFT.
     */
    function getNftPrice(uint256 tokenId) external view returns(uint256){
        return NFT_ID[tokenId].price;
    }

}
