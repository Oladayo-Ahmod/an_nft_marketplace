"use client"
import { useContext, useEffect, useRef, useState } from 'react'
import { MarketplaceContext } from "../../../contexts/Marketplace";
import Image from 'next/image';

const Render =()=>{
   const { nftData,account,allListedNfts,SellNft} = useContext(MarketplaceContext)

   useEffect(()=>{
    allListedNfts()
    // console.log(nftData)
   },[allListedNfts])
    return (
        <>
         <style jsx>
        {
          `
            .col-container{
              width :280px;
              height : 280px;
              text-align : center;
              margin :20px 20px;
              padding : 20px 5px 0 5px;
            }
            .caption{
                margin-left: 20px;
            }
            .caption-tp{
                position :relative;
                bottom : -35px;
                left : 15%;
            }
            .caption-bm{
                position: relative;
                bottom: 60px;
                left: 40px;
            }
            .btn{
                position: relative;
                margin-top: -40%;
                left: 25%;
            }

          `
        }
        </style>

             <div className='container mt-5'>
                <div className='row justify-content-center align-items-center '>
                    {
                        nftData? nftData.map((nft,i)=>(
                            <div className='col col-md-3'>
                            <small className="text-info fw-bold caption caption-tp ">{nft.name} </small>
                            <div className=" col-container rounded">
                                <Image className='image'  loader={()=>nft.image} src={nft.image} width={200} height={200} alt={nft.name} />
                            </div>
                            <small className="text-secondary fw-bold caption-bm caption">Price : {nft.price}ETH </small>
                            <p className="text-secondary fw-bold caption-bm caption">Seller: {nft.seller ? `${nft.owner.slice(0,6)}...${nft.owner.slice(nft.owner.length -4)}` : ''} </p>
                            {
                                Number(account) == Number(nft.seller)  || account == Number(nft.owner) ?
                                <button className='btn btn-success col-md-8 ml-3' disabled>
                                owned by you
                                </button>
                                :
                                (nft.sold ?
                                    <button className='btn btn-danger col-md-8 ml-3' disabled>
                                    sold
                                    </button>
                                 : <button className='btn btn-primary col-md-8 ml-3' onClick={()=>SellNft(nft.tokenId)}>
                                    Buy
                                </button>)


                            }


                        </div>
                        ))
                        :
                        <h1 className='text-info fw-bold'>Loading NFT items ...</h1>
                    }

                </div>
          </div>

        </>
    )
}

export default Render
