import { types } from "mobx-state-tree";

const settingsStore = types
  .model({
    noOfUsers: types.number,
  })
  .actions((self) => ({
    updateUserCount(number: number) {
      self.noOfUsers = number;
    },
  }));

export const SettingsStore = settingsStore.create({
  noOfUsers: 0,
});
