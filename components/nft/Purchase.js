import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { HiTag } from "react-icons/hi";
import { IoMdWallet } from "react-icons/io";

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
};

const MakeOffer = ({ isListed, selectedNft, listings, marketplace }) => {
  const [selectedMarketNft, setSelectedMarketNft] = useState();
  const [enableButton, setEnableButton] = useState(false);

  const confirmPurchase = (toastHandler = toast) =>
    toastHandler.success(`Purchase successful!`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });

  const buyItem = async () => {
    try {
      const listingId = selectedMarketNft.id;
      const quantityDesired = 1;

      await marketplace.buyoutListing(listingId, quantityDesired);

      confirmPurchase();
    } catch (error) {
      console.error(
        "Error @marketplace.buyoutListing - buyItem_Purchase: ",
        error
      );
    }
  };

  useEffect(() => {
    if (!listings || isListed === "false") return;

    const getSelectedMarketNft = async () => {
      const selectedMarketNftItem = listings.find(
        (marketNft) =>
          marketNft.asset?.id.toNumber() === selectedNft.metadata.id.toNumber()
      );

      setSelectedMarketNft(selectedMarketNftItem);
    };

    getSelectedMarketNft();
  }, [selectedNft, listings, isListed]);

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return;

    setEnableButton(true);
  }, [selectedNft, selectedMarketNft]);

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="top-center" reverseOrder={false} />

      {isListed === "true" ? (
        <>
          <div
            onClick={enableButton ? buyItem : () => null}
            className={
              enableButton
                ? `${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`
                : `${style.button} bg-[#31465a]`
            }
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>

          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText}>Make Offer</div>
          </div>
        </>
      ) : (
        <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText}>List Item</div>
        </div>
      )}
    </div>
  );
};

export default MakeOffer;
