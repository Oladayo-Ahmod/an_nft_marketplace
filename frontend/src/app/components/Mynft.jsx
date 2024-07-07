"use client"
import { useContext, useEffect, useRef, useState } from 'react'
import { MarketplaceContext } from "../../../contexts/Marketplace";
import Image from 'next/image';

const Mynft =()=>{
   const { userNftData,currentUserNfts} = useContext(MarketplaceContext)

   useEffect(()=>{
    currentUserNfts()
    // console.log(userNftData)
   })
    return (
        <>
         <style jsx>
        {
          `
            .col-container{
              width :200px;
              height : 200px;P
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
                bottom: 0px;
                left: 40px;
            }
            .btn{
                position: relative;
                margin-top: 2%;
                left: 15%;
            }
          `
        }
        </style>

             <div className='container mt-5'>
                <div className='row justify-content-center align-items-center '>
                    {
                        userNftData? userNftData.map((nft,i)=>(
                            <div className='col col-md-3' key={nft.id}>
                                <h3>My purchased NFTs </h3>
                                
                            <small className="text-info fw-bold caption caption-tp ">{nft.name} </small>
                            <div className="col-container rounded">
                                <Image className='image'  loader={()=>nft.image} src={nft.image} width={200} height={200} alt={nft.name} />
                            </div>
                            <small className="text-secondary fw-bold caption-bm caption">Price : {nft.price} ETH </small>
                            <button className='btn btn-success col-md-8 ml-3' disabled>
                                owned by you
                            </button>

                        </div>
                        ))
                        :
                        <h1 className='text-info fw-bold'>Loading My NFT items ...</h1>
                    }

                </div>
          </div>

        </>
    )
}

export default Mynft
