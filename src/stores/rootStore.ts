import { ProductStore } from "./ProductStore";
import { SettingsStore } from "./SettingsStore";

function createRootStore() {
  const rootStore = {
    settingsStore: SettingsStore,
    productStore: ProductStore,
  };

  return rootStore;
}

const rootStore = createRootStore();
export default rootStore;
