import { types, Instance } from "mobx-state-tree";

const CustomerModel = types.model({
  customerId: types.union(types.string),
  customerName: types.string,
});

const ProductModel = types.model({
  productId: types.union(types.string),
  productCategory: types.number,
  productName: types.string,
  productUnits: types.number,
  productPrice: types.number,
  productImage: types.string,
  productTag: types.string,
});

const saleStore = types
  .model({
    customers: types.array(CustomerModel),
    doesCustomersExist: types.boolean,
    products: types.array(ProductModel),
    doesProductCategoryExist: types.boolean,
  })
  .actions((self) => ({
    addCustomer(customer: any) {
      self.customers.push(customer);
    },
    removeCustomer(customerId?: string) {
      const index = self.customers.findIndex(
        (c) => c.customerId === customerId
      );
      if (index !== -1) {
        self.customers.splice(index, 1);
      }
    },
    emptyCustomers() {
      self.customers.clear();
    },
    setCustomersExist(value: boolean) {
      self.doesCustomersExist = value;
    },
    addProduct(product: any) {
      self.products.push(product);
    },
    removeProduct(productId?: string) {
      const index = self.products.findIndex((p) => p.productId === productId);
      if (index !== -1) {
        self.products.splice(index, 1);
      }
    },
    emptyProducts() {
      self.products.clear();
    },
    setProductCategoryExist(value: boolean) {
      self.doesProductCategoryExist = value;
    },
  }));

export const SaleStore = saleStore.create({
  customers: [],
  doesCustomersExist: true,
  products: [],
  doesProductCategoryExist: true,
});

export type SaleStoreType = Instance<typeof saleStore>;
