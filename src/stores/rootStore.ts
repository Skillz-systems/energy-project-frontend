import { ProductStore } from "./ProductStore";

function createRootStore() {
  const rootStore = {
    productStore: ProductStore,
  };

  return rootStore;
}

const rootStore = createRootStore();
export default rootStore;
