import { CardComponent } from "../CardComponents/CardComponent";
import { SaleTransactionsType } from "./SalesDetailsModal";

const SaleTransactions = ({ data }: { data: SaleTransactionsType[] }) => {
  const dropDownList = {
    items: ["View Transaction Details"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          console.log("View Transaction Details");
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };
  return (
    <div className="flex flex-wrap items-center gap-4">
      {data.map((item, index) => (
        <CardComponent
          key={index}
          variant="salesTransactions"
          transactionId={item.transactionId}
          transactionStatus={item.paymentStatus}
          datetime={item.datetime}
          productType={item.productCategory}
          productTag={item.paymentMode}
          transactionAmount={item.amount}
          dropDownList={dropDownList}
        />
      ))}
    </div>
  );
};

export default SaleTransactions;
