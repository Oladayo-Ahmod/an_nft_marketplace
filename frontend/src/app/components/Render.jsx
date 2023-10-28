import { useContext, useEffect } from 'react';
import { MarketplaceContext } from '../../../contexts/Marketplace';
import Image from 'next/image';

const Render = () => {
    const { nftData, account, allListedNfts, SellNft } = useContext(MarketplaceContext);

    useEffect(() => {
        allListedNfts();
    }, [allListedNfts]);

    // Memoize the nftData if it doesn't change frequently
    const memoizedNftData = useMemo(() => nftData, [nftData]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center align-items-center">
                {memoizedNftData ? (
                    memoizedNftData.map((nft, i) => (
                        <div className="col col-md-3" key={nft.id}>
                            <small className="text-info fw-bold caption caption-tp">{nft.name}</small>
                            <div className="col-container rounded">
                                <Image
                                    className="image"
                                    loader={() => nft.image}
                                    src={nft.image}
                                    width={200}
                                    height={200}
                                    alt={nft.name}
                                />
                            </div>
                            <small className="text-secondary fw-bold caption-bm caption">
                                Price: {nft.price} ETH
                            </small>
                            <p className="text-secondary fw-bold caption-bm caption">
                                Seller: {nft.seller ? `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}` : ''}
                            </p>
                            {Number(account) === Number(nft.seller) || account === Number(nft.owner) ? (
                                <button className="btn btn-success col-md-8 ml-3" disabled>
                                    Owned by you
                                </button>
                            ) : nft.sold ? (
                                <button className="btn btn-danger col-md-8 ml-3" disabled>
                                    Sold
                                </button>
                            ) : (
                                <button className="btn btn-primary col-md-8 ml-3" onClick={() => SellNft(nft.tokenId)}>
                                    Buy
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <h1 className="text-info fw-bold">Loading NFT items...</h1>
                )}
            </div>
        </div>
    );
};

export default Render;
