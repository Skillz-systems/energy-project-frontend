import { CardComponent } from "../CardComponents/CardComponent";

const InventoryDetails = ({ inventoryData }: { inventoryData: any[] }) => {
  return (
    <div className="flex items-center flex-wrap gap-4 md:gap-3 lg:gap-4 w-full">
      {inventoryData?.map((inventory, index) => (
        <CardComponent
          key={index}
          variant="inventoryOne"
          dropDownList={{
            items: ["View Inventory"],
            onClickLink: (index: number) => {
              console.log(index);
            },
            defaultStyle: true,
            showCustomButton: true,
          }}
          productImage={inventory.productImage}
          productName={inventory.productName}
          productPrice={inventory.productPrice}
        />
      ))}
    </div>
  );
};

export default InventoryDetails;
