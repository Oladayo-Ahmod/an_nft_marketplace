const { ethers } = require('hardhat')
const {assert,expect} = require('chai')

describe('CeloNFT', ()=>{
    let provider, contract
    beforeEach(async ()=>{
        provider = await ethers.getContractFactory('CeloNFT')
        contract = await provider.deploy()
    })
    
    describe('contract deployment', ()=>{
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

    // NFT functionalities
    describe('NFT functionality', ()=>{
         // creates token and returned ID
         it("mint token", async ()=>{
            const price = ethers.utils.parseEther('2')
            const tx = await contract.createToken("https://test-url",price)
            const receipt = await tx.wait()
            const events = receipt.events.find(event => event.event === 'NFT_Action');
            assert.equal(events.args[0],1) // token id equals
        })

    })

     // NFT sales
     it("it sells nft",async ()=>{
        const price = ethers.utils.parseEther('2')
        await contract.createToken("https://test-url",price)
        const listedPrice = await contract.getNftPrice('1') // retrieve nft price
        const tx = await contract.sellNFT(1,{value :listedPrice})
        const receipt = await tx.wait()
        const events = receipt.events.find(event => event.event === 'NFT_Action');
        assert.equal(events.args[0],1) // token id equals
        assert.equal(events.args[4],true) // sold equals true
    })

     // retrieve all nfts
     it("it retrieves all nfts", async ()=>{
        const price = ethers.utils.parseEther('1')
        const [, firstSeller,secondSeller,buyer] = await ethers.getSigners()
        const account1 = contract.connect(firstSeller)
        await account1.createToken("https://url1.com",price) // create first item
        const account2 = contract.connect(secondSeller)
        await account2.createToken("https://url2.com",price) // create second item
        await contract.connect(buyer).sellNFT(1,{value :price}) // buy one of the created item
        const nfts = await contract.allNfts()
        console.log(` all nfts ${nfts}`);

    })

     // retrieves single nft
     it("it retrieves single nft",async ()=>{
        const price = ethers.utils.parseEther('1')
        await contract.createToken("https://test-url",price)
        const nft = await contract.singleNFT('1');
        console.log(` single nft ${nft}`);
    })






})