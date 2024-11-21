import { TitlePill } from "../TitlePillComponent/TitlePill";
import inventorygradient from "../../assets/inventory/inventorygradient.svg";
import stockgreen from "../../assets/inventory/stockvalue.svg";
import giftgradient from "../../assets/inventory/gift.svg";
import { formatNumberWithCommas } from "@/utils/helpers";
import { NairaSymbol } from "../CardComponents/CardComponent";

const InventoryStats = () =>
  // { stats }: { stats: any }
  {
    return (
      <div className="flex flex-col w-full gap-4">
        <TitlePill
          icon={inventorygradient}
          iconBgColor="bg-[#FDEEC2]"
          topText="All Time Number of"
          bottomText="STOCK"
          value={formatNumberWithCommas(4309)}
          parentClass="w-full"
        />
        <TitlePill
          icon={stockgreen}
          iconBgColor="bg-[#E3FAD6]"
          topText="All Time Value of"
          bottomText="STOCK"
          leftIcon={<NairaSymbol />}
          value={formatNumberWithCommas(1590790)}
          parentClass="w-full"
        />
        <TitlePill
          icon={inventorygradient}
          iconBgColor="bg-[#FDEEC2]"
          topText="Available"
          bottomText="STOCK"
          value={formatNumberWithCommas(2000)}
          parentClass="w-full"
        />
        <TitlePill
          icon={stockgreen}
          iconBgColor="bg-[#E3FAD6]"
          topText="Value of Available"
          bottomText="STOCK"
          leftIcon={<NairaSymbol />}
          value={formatNumberWithCommas(600000)}
          parentClass="w-full"
        />
        <TitlePill
          icon={inventorygradient}
          iconBgColor="bg-[#FDEEC2]"
          topText="Available (in percentage)"
          bottomText="STOCK"
          value={"60%"}
          parentClass="w-full"
        />
        <TitlePill
          icon={giftgradient}
          iconBgColor="bg-[#FDEEC2]"
          topText="Number of Sales for"
          bottomText="STOCK"
          value={223}
          parentClass="w-full"
        />
      </div>
    );
  };

export default InventoryStats;
