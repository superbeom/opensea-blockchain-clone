import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useNFTCollection, useMarketplace } from "@thirdweb-dev/react";
import { CgWebsite } from "react-icons/cg";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";

import { client } from "../../lib/sanityClient";
import calThousand from "../../utils/calThousand";

import Header from "../../components/Header";
import NFTCard from "../../components/NFTCard";

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
};

const Collection = () => {
  const {
    query: { collectionId },
  } = useRouter();

  const [nfts, setNfts] = useState([]);
  const [listings, setListings] = useState([]);
  const [collection, setCollection] = useState({});

  const nftCollection = useNFTCollection(collectionId);
  const marketplace = useMarketplace(
    process.env.NEXT_PUBLIC_THIRDWEB_MARKETPLACE_CONTRACT_ADDRESS_ID
  );

  /* get all NFTs in the collection */
  useEffect(() => {
    const getNFTs = async () => {
      const allNfts = await nftCollection.getAll();
      if (!allNfts) return;
      setNfts(allNfts);
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

  /* get collection data */
  useEffect(() => {
    const getCollectionData = async () => {
      const query = `
        *[_type == "marketItems" && contractAddress == "${collectionId}"] {
          title,
          createdBy,
          contractAddress,
          volumeTraded,
          floorPrice,
          description,
          "imageUrl": profileImage.asset->url,
          "bannerImageUrl": bannerImage.asset->url,
          "creator": createdBy->userName,
          "allOwners": owners[] ->
        }
      `;

      const collectionData = await client.fetch(query);

      // the query returns 1 object inside of an array
      setCollection(collectionData[0] ?? {});
    };

    getCollectionData();
  }, [collectionId]);

  return (
    <div className="overflow-hidden">
      <Header />

      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={collection?.bannerImageUrl ?? "https://via.placeholder.com/200"}
          alt="banner"
        />
      </div>

      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={collection?.imageUrl ?? "https://via.placeholder.com/200"}
            alt="profile image"
          />
        </div>

        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>

                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>

                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>

                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.midRow}>
          <div className={style.title}>{collection?.title ?? "Unnamed"}</div>
        </div>

        <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{" "}
            <span className="text-[#2081e2]">
              {collection?.creator ?? "Unnamed"}
            </span>
          </div>
        </div>

        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>items</div>
            </div>

            <div className={style.collectionStat}>
              <div className={style.statValue}>
                {collection?.allOwners ? collection.allOwners.length : ""}
              </div>
              <div className={style.statName}>owners</div>
            </div>

            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  className={style.ethLogo}
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                />
                {collection?.floorPrice ?? 0}
              </div>
              <div className={style.statName}>floor price</div>
            </div>

            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  className={style.ethLogo}
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                />
                {collection?.volumeTraded
                  ? calThousand(collection.volumeTraded)
                  : 0}
              </div>
              <div className={style.statName}>volume traded</div>
            </div>
          </div>
        </div>

        <div className={style.midRow}>
          <div className={style.description}>
            {collection?.description ?? ""}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        {nfts.map((nft, id) => (
          <NFTCard
            key={id}
            nftItem={nft.metadata}
            title={collection?.title ?? "Unnamed"}
            listings={listings}
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;
