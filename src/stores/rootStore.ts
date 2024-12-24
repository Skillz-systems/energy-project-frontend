
import { CustomerPageStore } from "./customerStore";
import { ProductStore } from "./ProductStore";

function createRootStore() {
  const rootStore = {
    productStore: ProductStore,
    customerPageStore: CustomerPageStore
  };

  return rootStore;
}

const rootStore = createRootStore();
export default rootStore;
