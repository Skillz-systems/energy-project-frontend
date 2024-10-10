import { SettingsStore } from "./SettingsStore";

function createRootStore() {
  const rootStore = {
    settingsStore: SettingsStore,
  };

  return rootStore;
}

const rootStore = createRootStore();
export default rootStore;
