import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Collection = () => {
  const {
    query: { collectionId },
  } = useRouter();

  return (
    <Link href="/">
      <h2>{collectionId}</h2>
    </Link>
  );
};

export default Collection;
