import { types, Instance } from "mobx-state-tree";

const CustomerModel = types.model({
  customerId: types.string,
  customerName: types.string,
  firstname: types.string,
  lastname: types.string,
  location: types.string,
  email: types.string,
});

const ProductModel = types.model({
  productId: types.string,
  productCategory: types.number,
  productName: types.string,
  productUnits: types.number,
  productPrice: types.number,
  productImage: types.string,
  productTag: types.string,
});

const ParametersModel = types.model({
  currentProductId: types.string,
  paymentMode: types.string,
  installmentDuration: types.maybeNull(types.number),
  installmentStartingPrice: types.maybeNull(types.number),
  address: types.string,
  discount: types.maybeNull(types.number),
});

const MiscellaneousPricesModel = types.model({
  currentProductId: types.string,
  costs: types.map(types.number),
});

const DevicesModel = types.model({
  currentProductId: types.string,
  devices: types.array(types.string),
});

const saleStore = types
  .model({
    customer: types.maybeNull(CustomerModel),
    doesCustomerExist: types.boolean,
    products: types.array(ProductModel),
    doesProductCategoryExist: types.boolean,
    parameters: types.array(ParametersModel),
    miscellaneousPrices: types.array(MiscellaneousPricesModel),
    devices: types.array(DevicesModel),
  })
  .actions((self) => ({
    addCustomer(customer: {
      customerId: string;
      customerName: string;
      firstname: string;
      lastname: string;
      location: string;
      email: string;
    }) {
      self.customer = customer;
    },
    removeCustomer() {
      self.customer = null;
    },
    setCustomerExist(value: boolean) {
      self.doesCustomerExist = value;
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
    addParameters(params: {
      currentProductId: string;
      paymentMode: string;
      installmentDuration: number | null;
      installmentStartingPrice: number | null;
      address: string;
      discount: number | null;
    }) {
      self.parameters.push(params);
    },
    removeParameter(currentProductId?: string) {
      const index = self.parameters.findIndex(
        (p) => p.currentProductId === currentProductId
      );
      if (index !== -1) {
        self.parameters.splice(index, 1);
      }
    },
    addOrUpdateMiscellaneousPrice(
      currentProductId: string,
      costs: Record<string, number>
    ) {
      const existingIndex = self.miscellaneousPrices.findIndex(
        (p) => p.currentProductId === currentProductId
      );

      if (existingIndex !== -1) {
        // Update existing entry
        Object.entries(costs).forEach(([key, value]) => {
          self.miscellaneousPrices[existingIndex].costs.set(key, value);
        });
      } else {
        // Add new entry
        self.miscellaneousPrices.push(
          MiscellaneousPricesModel.create({ currentProductId, costs })
        );
      }
    },
    removeMiscellaneousPrice(currentProductId?: string) {
      const index = self.miscellaneousPrices.findIndex(
        (p) => p.currentProductId === currentProductId
      );
      if (index !== -1) {
        self.miscellaneousPrices.splice(index, 1);
      }
    },
    addOrUpdateDevices(currentProductId: string, deviceList: string[]) {
      const existingIndex = self.devices.findIndex(
        (d) => d.currentProductId === currentProductId
      );

      if (existingIndex !== -1) {
        // Update existing device list
        self.devices[existingIndex].devices.replace(deviceList);
      } else {
        // Add new device list
        self.devices.push(
          DevicesModel.create({ currentProductId, devices: deviceList })
        );
      }
    },
    removeDevices(currentProductId?: string) {
      const index = self.devices.findIndex(
        (d) => d.currentProductId === currentProductId
      );
      if (index !== -1) {
        self.devices.splice(index, 1);
      }
    },
  }));

export const SaleStore = saleStore.create({
  customer: null,
  doesCustomerExist: false,
  products: [],
  doesProductCategoryExist: false,
  parameters: [],
  miscellaneousPrices: [],
  devices: [],
});

export type SaleStoreType = Instance<typeof saleStore>;
