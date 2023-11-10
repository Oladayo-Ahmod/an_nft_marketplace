"use client"

import { useContext, useEffect, useRef, useState } from 'react'
import { MarketplaceContext } from "../../../contexts/Marketplace";
import Link from 'next/link';

const Navbar =()=>{

    const {account,connectWallet} = useContext(MarketplaceContext)

    // bootstrap
    useEffect(()=>{
        require('bootstrap/dist/js/bootstrap.bundle')
    },[])

    // wallet connection
    useEffect(()=>{
        connectWallet()
      },[])

    return (

            <nav className="navbar navbar-expand-sm navbar-dark bg-white shadow-sm p-2">
            <Link className='ml-1 navbar-brand text-secondary' href={'/'}> NFT Marketplace </Link>
            <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

        <nav className="navbar navbar-expand-sm navbar-light bg-light">
              <div className="container">
                <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
              
          </div>
        </nav>
        

            <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav me-auto mt-2 mt-lg-0 text-secondary">
                    <li className="nav-item">
                    <Link className="nav-link  text-info" href={'/create-nft'}> Create NFT </Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link  text-info" href={'/my-nfts'}> My NFT </Link>
                    </li>
                </ul>
                <form className="d-flex my-2 my-lg-0 px-2">
                    <button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={connectWallet} >  {account ? `${account.slice(0,6)}...${account.slice(account.length -4)}` : 'connect wallet'}
                    </button>
                </form>
            </div>
            </nav>


    )


}

export default Navbar
