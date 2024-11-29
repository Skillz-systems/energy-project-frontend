
import { CustomerPageStore } from "./customerStore";
import { ProductStore } from "./ProductStore";
import { SettingsStore } from "./SettingsStore";

function createRootStore() {
  const rootStore = {
    settingsStore: SettingsStore,
    productStore: ProductStore,
    customerPageStore: CustomerPageStore
  };

  return rootStore;
}

const rootStore = createRootStore();
export default rootStore;
