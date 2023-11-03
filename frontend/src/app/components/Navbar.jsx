import React, { useContext } from 'react';
import { MarketplaceContext } from '../../../contexts/Marketplace';
import Link from 'next/link';

const Navbar = () => {
    const { account, connectWallet } = useContext(MarketplaceContext);

    const renderAccountButton = () => {
        if (account) {
            const shortAccount = `${account.slice(0, 6)}...${account.slice(account.length - 4)}`;
            return (
                <button className="btn btn-outline-success my-2 my-sm-0" type="button">
                    {shortAccount}
                </button>
            );
        } else {
            return (
                <button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={connectWallet}>
                    Connect Wallet
                </button>
            );
        }
    };

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark shadow-sm">
            <Link href={'/'} passHref>
                <a className="navbar-brand text-light">NFT Marketplace</a>
            </Link>
            <button
                className="navbar-toggler d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsibleNavId"
                aria-controls="collapsibleNavId"
                aria-expanded="false"
                aria-label="Toggle navigation"
            />
            <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav me-auto mt-2 mt-lg-0 text-secondary">
                    <li className="nav-item">
                        <Link href="/create-nft" passHref>
                            <a className="nav-link text-info">Create NFT</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/my-nfts" passHref>
                            <a className="nav-link text-info">My NFTs</a>
                        </Link>
                    </li>
                </ul>
                <form className="d-flex my-2 my-lg-0 px-2">{renderAccountButton()}</form>
            </div>
        </nav>
    );
};

export default Navbar;
