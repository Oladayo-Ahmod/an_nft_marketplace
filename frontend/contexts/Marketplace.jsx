"use client"

import React, { createContext, useContext, useState } from 'react';
import { abi, address } from '../constants/index'
import { ethers } from 'ethers';
import Swal from "sweetalert2"
const axios = require('axios')
import {uploadJSONToIPFS,uploadFileToIPFS} from '../constants/pinata.js'
const MarketplaceContext = createContext()

// metamask connection
let connection
if (typeof window !== 'undefined') {
    connection = window.ethereum
}


/**
 * NFT marketplace contract provider
 * @param {any} {children}
 * @returns {any}
 */
const MarketplaceProvider = ({ children }) => {

    // state variables
    const [account, setAccount] = useState()
    const [nftData, setNftData] = useState()
    const [singleNftData, setSingleNftData] = useState()
    const [nftUrl, setNftUrl] = useState()
    const [buttonDisability, setbuttonDisability] = useState(false)
    const [message, setMessage] = useState('List Item')
    const [userNftData, setUserNftData] = useState('')
    const [formData, setFormData] = useState({ name: '', price: '', file: '' })


    /**
     * integrate wallet connection
     * @returns {any}
     */
    const connectWallet = async function () {
        if (connection) {
            const accounts = await connection.request({ method: 'eth_requestAccounts' })
            setAccount(accounts[0])
        }
        else {
            console.log('please install metamask')
        }
    }

     /**
      * create nft functionality
      * @returns {any}
      */
     const CreateNft = async function(){
        try{
            const {name,price,file} = formData
            if (price && nftUrl) {
                setbuttonDisability(true)
                setMessage('Listing Item...')
                const metaDataUrl = await uploadMetaData()
                const provider = new ethers.providers.Web3Provider(connection);
                const signer = provider.getSigner()
                const contract = new ethers.Contract(address,abi,signer)
                const NFTprice = new ethers.utils.parseUnits(price,'ether')
                const transaction = await contract.createToken(metaDataUrl, NFTprice)
                await transaction.wait()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    text: `You have successfully listed this NFT at ${price} `,
                    showConfirmButton: false,
                    timer: 4000
                })
                setbuttonDisability(false)
                setFormData({name: '',price : '',file :''})
                setMessage('successfully listed!')

            }
            else{
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    text: `Please upload a valid NFT image`,
                    showConfirmButton: true,
                    timer: 4000
                })
            }
        }
        catch(error){
            setbuttonDisability(false)
            setMessage('Submit Item')
            console.log(error)
        }
    }

    
    /**
     * selling nft functionality
     * @param {any} tokenId
     * @returns {any}
     */
    const SellNft = async (tokenId)=>{
        try {
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(address,abi,signer)
            const price = await contract.getNftPrice(tokenId)
            let parsedPrice = ethers.utils.formatUnits(price.toString(), 'ether')
            parsedPrice = ethers.utils.parseEther(parsedPrice)
            const purchase = await contract.sellNFT(tokenId,{value :parsedPrice})
            await purchase.wait()
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                text: `You have successfully purchased this item at ${new ethers.utils.parseUnits(price,'ether')}`,
                showConfirmButton: false,
                timer: 4000
            })

        } catch (error) {
            console.log(error);
        }
    }

    
      /**
       * retrieve all nfts purchased by a user
       * @returns {any}
       */
      const currentUserNfts=async()=>{
        try {
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(address,abi,signer)
            const NFTS = await contract.userNfts()
            const data = await Promise.all(NFTS.map(async i =>{
                const tokenURI = await contract.tokenURI(i.tokenId)
                let meta = await axios.get(tokenURI);
                meta = meta.data;
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.file.pinataURL,
                    name: meta.name,
                    }
                    return item
            }))
            setUserNftData(data)
            } catch (error) {
                console.log(error);
            }
        }
    
   
   /**
    * retrieve single nft by token id
    * @param {any} tokenId
    * @returns {any}
    */
   const getSingleNft =async (tokenId)=>{
    try{
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address,abi,signer)
        const tokenURI = await contract.tokenURI(tokenId);
        const NFTS = await contract.singleNFT(tokenId)
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        let item = {
            price : meta.price,
            tokenId,
            seller: NFTS.seller,
            owner: NFTS.owner,
            image: meta.file.pinataURL,
            name: meta.name,
        }

        setSingleNftData(item)

    }

    catch(error){
        console.log(error);
    }
}


/**
 * retrieve all listed nfts
 * @returns {any}
 */
const allListedNfts=async()=>{
    try {
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address,abi,signer)
        const NFTS = await contract.allNfts()
        const data = await Promise.all(NFTS.map(async i =>{
            const tokenURI = await contract.tokenURI(i.tokenId)
            let meta = await axios.get(tokenURI);
            meta = meta.data;
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.file.pinataURL,
                name: meta.name,
                sold : i.sold
                }
                return item
        }))
        setNftData(data)
        } catch (error) {
            console.log(error);
        }
}


 /**
  * NFT image URI handler
  * @param {any} e
  * @returns {any}
  */
 const imageHandler = async function(e){
    let file = e.target.files[0]
    try {
        const response = await uploadFileToIPFS(file)
        console.log(response);
        setNftUrl(response)
    } catch (error) {
        console.log(error);
    }
}

  
  /**
   * upload nft metadata to IPFS
   * @returns {any}
   */
  const uploadMetaData = async function(){
    const {name,price} = formData

    const nftJSON = {
        name,
        price,
        file:nftUrl
    }

    try {
        const response = await uploadJSONToIPFS(nftJSON)
        return response.pinataURL
    } catch (error) {
        console.log(error);
    }
}


return (
    <MarketplaceContext.Provider
        value={
            {
                connectWallet,
                currentUserNfts,
                CreateNft,
                SellNft,
                getSingleNft,
                allListedNfts,
                account,
                message,
                singleNftData,
                nftData,
                userNftData,
                buttonDisability,
                imageHandler,
                setFormData,
                formData
            }
        }
    >
        {children}
    </MarketplaceContext.Provider>
)

}


module.exports = {
    MarketplaceContext,
    MarketplaceProvider
}
