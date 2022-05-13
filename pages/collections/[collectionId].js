import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useNFTCollection, useMarketplace } from "@thirdweb-dev/react";

import { client } from "../../lib/sanityClient";

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
    <Link href="/">
      <h2>{collectionId}</h2>
    </Link>
  );
};

export default Collection;
