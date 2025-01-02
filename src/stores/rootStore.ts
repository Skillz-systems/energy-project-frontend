import { ProductStore } from "./ProductStore";
import { ContractStore } from "./ContractStore";

function createRootStore() {
  const rootStore = {
    productStore: ProductStore,
    contractStore: ContractStore,
  };

  return rootStore;
}

const rootStore = createRootStore();
export default rootStore;
