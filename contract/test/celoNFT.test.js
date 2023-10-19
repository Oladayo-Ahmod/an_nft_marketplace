const { ethers } = require('hardhat')
const {assert,expect} = require('chai')

describe('CeloNFT', ()=>{
    let provider, contract
    beforeEach(async ()=>{
        provider = await ethers.getContractFactory('CeloNFT')
        contract = await provider.deploy()
    })
    
      // correct constructor
    it("has correct constructor", async ()=>{
        const name = await contract.name()
        assert.equal(name,"CeloNFT")
    })

     // tests for successfully deployment
     it("deploys contract successfully", async ()=>{
        const address = await contract.deployed()
        assert.notEqual(address,0x0)
        assert.notEqual(address,'')
        assert.notEqual(address,undefined)
        assert.notEqual(address,null)
    })

})