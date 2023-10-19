const {ethers} = require('hardhat')
const fs = require('fs')
require('dotenv').config()

module.exports = async function(){
    if (process.env.UPDATE_FRONTEND) {
        console.log('-----------------updating--------frontend-------------parameters');
        const ABI = '../frontend/constants/abi.json'  // abi location
        const ADDRESS = '../frontend/constants/address.json' // contract address location

        const contract = await hre.ethers.getContractFactory('CeloNFT')
        const deploy = await contract.deploy()
        console.log('---------------updating-------contract-----------address');
        fs.writeFileSync(ADDRESS,JSON.stringify(deploy.address))
        console.log('--------------updated--------contract------------address');
        const abi = contract.interface.format(ethers.utils.FormatTypes.json)
        console.log('----------updating----abi---')
        fs.writeFileSync(ABI,abi)
        console.log('----------updated----abi---')

    }
}

