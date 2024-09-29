// Import local stores

function createRootStore() {
  const rootStore = {
    // settingsStore: new SettingsStore(this),
  };

  // Pass rootStore to each individual store
  //   rootStore.settingsStore = new SettingsStore(rootStore);

  return rootStore;
}

const rootStore = createRootStore();
export default rootStore;
