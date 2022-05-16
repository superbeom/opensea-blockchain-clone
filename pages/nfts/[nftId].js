import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useNFTCollection, useMarketplace } from "@thirdweb-dev/react";

import Header from "../../components/Header";
import NFTImage from "../../components/nft/NFTImage";
import GeneralDetails from "../../components/nft/GeneralDetails";
import Purchase from "../../components/nft/Purchase";
import ItemActivity from "../../components/nft/ItemActivity";

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
};

const Nft = () => {
  const {
    query: { nftId, isListed },
  } = useRouter();

  const [selectedNft, setSelectedNft] = useState();
  const [listings, setListings] = useState([]);

  const nftCollection = useNFTCollection(
    process.env.NEXT_PUBLIC_THIRDWEB_NFT_COLLECTION_CONTRACT_ADDRESS_ID
  );
  const marketplace = useMarketplace(
    process.env.NEXT_PUBLIC_THIRDWEB_MARKETPLACE_CONTRACT_ADDRESS_ID
  );

  // get all NFTs in the collection
  useEffect(() => {
    const getNFTs = async () => {
      const allNfts = await nftCollection.getAll();

      if (!allNfts) return;

      const selectedNftItem = allNfts.find(
        (nft) => nft.metadata.id.toNumber() === parseInt(nftId)
      );

      setSelectedNft(selectedNftItem);
    };

    getNFTs();
  }, [nftCollection]);

  /* get all listings in the collection */
  useEffect(() => {
    const getListings = async () => {
      const allListings = await marketplace.getAll();
      if (!allListings) return;
      setListings(allListings);
    };

    getListings();
  }, [marketplace]);

  return (
    <div>
      <Header />

      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>

            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />

              <Purchase
                isListed={isListed}
                selectedNft={selectedNft}
                listings={listings}
                marketplace={marketplace}
              />
            </div>
          </div>

          <ItemActivity />
        </div>
      </div>
    </div>
  );
};

export default Nft;
