import React, { createContext, useContext, useState } from 'react';
import {abi,address} from '../constants/index'
import { ethers } from 'ethers';
import Swal from "sweetalert2"
const axios = require('axios')
const MarketplaceContext = createContext()

// metamask connection
let connection
if(typeof window !== 'undefined'){
    connection = window.ethereum
}

// NFT marketplace contract provider provider
const MarketplaceProvider =({children})=>{

     // state variables
     const [account , setAccount] = useState()
     const [nftData,setNftData] = useState()
     const [singleNftData,setSingleNftData] = useState()
     const [nftUrl, setNftUrl] = useState()
     const [buttonDisability, setbuttonDisability] = useState(false)
     const [message,setMessage] = useState('List Item')
     const [userNftData, setUserNftData] = useState('')
     const [formData,setFormData] = useState({name: '',price : '',file :''})

      // integrate wallet connection
    const connectWallet = async function(){
        if (connection) {
            const accounts = await connection.request({method : 'eth_requestAccounts'})
            setAccount(accounts[0])
        }
        else{
            console.log('please install metamask')
        }
    }

 
}