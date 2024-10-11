import { types } from "mobx-state-tree";

const settingsStore = types
  .model({
    noOfUsers: types.number,
    refreshUserTable: types.boolean,
  })
  .actions((self) => ({
    updateUserCount(number: number) {
      self.noOfUsers = number;
    },
    setRefreshUserTable(value: boolean) {
      self.refreshUserTable = value;
    },
  }));

export const SettingsStore = settingsStore.create({
  noOfUsers: 0,
  refreshUserTable: false,
});
