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

