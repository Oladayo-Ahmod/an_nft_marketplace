
# CELONFT

## Overview
The CeloNFT is an NFT marketplace for minting, buying, and selling Non-Fungible Tokens (NFTs). It allows users to mint new NFTs with associated metadata, list them for sale, purchase NFTs, and retrieve information about NFTs.

## Contract Details
- **Contract Name:** CeloNFT
- **Contract Version:** 1.0.0
- **SPDX-License-Identifier:** MIT

## Functionalities
1. **Constructor**
   - Initializes the smart contract by setting the owner address as the deployer's address.
   - Inherits from the ERC721URIStorage contract, enabling NFT minting with associated metadata.

2. **createToken**
   - **Functionality:** Mint a new NFT and associate it with provided tokenURI and price.
   - **Parameters:** _tokenURI (IPFS URI of token metadata), price (price of the NFT in wei).
   - **Returns:** currentTokenId (the ID of the newly minted NFT).
   - **Example Usage:**
     ```solidity
     uint256 tokenId = createToken("ipfs://Qm...N", 1000000000000000000);
     ```

3. **sellNFT**
   - **Functionality:** Sell an NFT to a buyer by transferring ownership and receiving payment.
   - **Parameters:** tokenId (ID of the NFT to be sold).
   - **Requirements:** The buyer must send the exact amount specified as the NFT's price.
   - **Example Usage:**
     ```solidity
     sellNFT(1);
     ```

4. **allNfts**
   - **Functionality:** Retrieve information about all NFTs available on the marketplace.
   - **Returns:** An array of NFT structs, each containing NFT details.
   - **Example Usage:**
     ```solidity
     NFT[] memory nfts = allNfts();
     ```

5. **singleNFT**
   - **Functionality:** Retrieve information about a specific NFT.
   - **Parameters:** tokenId (ID of the NFT).
   - **Returns:** A NFT struct containing NFT details.
   - **Example Usage:**
     ```solidity
     NFT memory nftInfo = singleNFT(1);
     ```

6. **userNfts**
   - **Functionality:** Retrieve information about all NFTs owned by the caller.
   - **Returns:** An array of NFT structs, each containing NFT details owned by the caller.
   - **Example Usage:**
     ```solidity
     NFT[] memory userOwnedNfts = userNfts();
     ```

## Event
The smart contract emits the `NFT_Action` event with the following parameters:
- `tokenId`: ID of the NFT.
- `owner`: Address of the NFT owner.
- `seller`: Address of the NFT seller.
- `price`: Price of the NFT in wei.
- `sold`: Indicates if the NFT has been sold.
- `message`: A message indicating the action taken (e.g., "NFT created successfully" or "Sold NFT successfully").

## Usage Notes
1. Deploy the smart contract to the Celo or alfajores testnet.
2. Call the `createToken` function to mint and list for sale a new NFT and associate it with metadata.
3. Call the `sellNFT` function to buy an NFT for sale, transferring ownership upon successful purchase.
4. Use the `allNfts` function to retrieve information about all NFTs on the marketplace.
5. Use the `singleNFT` function to retrieve information about a specific NFT.
6. Use the `userNfts` function to retrieve information about all NFTs owned by the caller.

## USER INTERFACE
The user interface is being developed using a common JavaScript framework built on top of React, specifically Next.js.

The design is being developed using Bootstrap, while the alerts and notifications are being handled using the SweetAlert library.

All props and data are being handled using the context API, making it easier to send props within components.

### Marketplace (Home page)
- An homepage where all the NFTs are being listed, comprising sold and unsold NFTs.
- Users are prevented from purchasing the NFTs they listed themselves, and they are notified as the seller.
- Users who already purchased an NFT cannot rebuy the same NFT, and they will be notified that they are the owner.
- An already purchased NFT cannot be repurchased by other users, and they will be notified that it's been sold.

### Create-NFT
- This page allows users to list their NFTs and includes required forms for the item name, image (uploaded to IPFS), and price for interested buyers.

### My-NFT
- This page displays the list of all the NFTs that have been purchased by a particular user.

### Required .env.example file
- Below are the parameters:
  - `UPDATE_FRONTEND`: Contract ABI and address have been programmatically handled to render in the frontend without the need to hardcode it.
  - `ALFAJORES_RPC_URL`: The contract is deployed to Celo alfajores testnet. The RPC URL can be supplied there.
  - `ETHERSCAN_API`: The Etherscan API key can be entered here.
  - `REPORT_GAS`: If gas reporting is necessary, this can be set to true; otherwise, false.
  - `PRIVATE_KEY`: The private key of the address has to be entered here.
  - NOTE: Pinata API key is also required but is hardcoded with my API key solely for this project inside frontend/constants/pinata.js.

### Commands
- The commands necessary to run the code:
  - Run `yarn` in the frontend directory to install frontend packages. After that, you can start the app by running `yarn dev`.
  - Run `yarn` in the contract directory to install frontend packages. After that, you can start the app by running `yarn hardhat compile` for compilation, `yarn hardhat node` to run it locally, and `yarn hardhat deploy --network alfajores` to deploy it to Celo alfajores testnet.
```

You can save this content in a `.md` file for documentation purposes.
