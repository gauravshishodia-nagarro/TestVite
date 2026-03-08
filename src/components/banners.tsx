import { useMemo } from "react";
import { UserModeResponse } from "../apis/types/dashboard";
import CustomCarousel from "./customCarousel";
import { isRTL } from "../utils/formatter";

export interface BannerItemType {
  id: string;
  url: string;
  type: string;
}
interface BannersType {
  banners?: BannerItemType[];
  onPress?: (type: string) => void;
  userMode?: UserModeResponse;
}

const bannersAry = [
  {
    id: "1",
    url: require("../../public/images/demo/banner1.webp"),
    //url: 'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940',
    type: "",
  },
  {
    id: "2",
    url: require("../../public/images/demo/banner2.webp"),
    //url: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    type: "",
  },

  {
    id: "3",
    url: require("../../public/images/demo/banner3.webp"),
    type: "",
    //url: 'https://images.ctfassets.net/y2ske730sjqp/5QQ9SVIdc1tmkqrtFnG9U1/de758bba0f65dcc1c6bc1f31f161003d/BrandAssets_Logos_02-NSymbol.jpg?w=940',
  },
  {
    id: "4",
    url: require("../../public/images/demo/banner4.webp"),
    type: "mokafaa",
  },
  // {
  // 	id: '4',
  // 	url: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  // },
];

const Banners: React.FC<BannersType> = (props) => {
  // { banners = bannersAry }
  const { banners = bannersAry, onPress, userMode } = props;

  const config = userMode?.mokafaa?.mokaffaLoyaltyConfig;
  const showMokafaaBanner =
    config?.enabled && !config?.hideHomePageBanner && !userMode?.zainFraud;

  const _banners = useMemo(() => {
    if (showMokafaaBanner) return banners;
    return banners.filter((item) => item.type !== "mokafaa");
  }, [banners, showMokafaaBanner]);

  const reversedBanners = useMemo(() => {
    return [..._banners].reverse(); // safe copy, no mutation
  }, [_banners]);

  return (
    <CustomCarousel<{ id: string; url: string; type: string }>
      data={isRTL() ? reversedBanners : _banners}
      carouselType="HomeParallax"
      mode={"parallax"}
      onItemPress={(idx) => {
        if (!onPress) return;

        const list = isRTL() ? reversedBanners : _banners;
        const item = list[idx];

        onPress(item?.type);
      }}
      autoPlayReverse={isRTL()}
      paginationContainerStyleName={{
        ...(isRTL() ? { flexDirection: "row-reverse" } : ""),
      }}
      height={220}
    />
  );
};

export default Banners;
