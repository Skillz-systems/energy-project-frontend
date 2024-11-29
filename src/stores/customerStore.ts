import { types } from "mobx-state-tree";

const customerPageStore = types
  .model({
    noOfCustomers: types.number,
    refreshCustomerTable: types.boolean,
  })
  .actions((self) => ({
    updateCustomerCount(number) {
      self.noOfCustomers = number;
    },
    setRefreshCustomerTable(value) {
      self.refreshCustomerTable = value;
    },
  }));

export const CustomerPageStore = customerPageStore.create({
  noOfCustomers: 0,
  refreshCustomerTable: false,
});
