import { types, Instance } from "mobx-state-tree";

const IdentificationDetailsModel = types.model({
  idType: types.string,
  idNumber: types.string,
  issuingCountry: types.string,
  issueDate: types.string,
  expirationDate: types.string,
  fullNameAsOnID: types.string,
  addressAsOnID: types.string,
});

const GuarantorModel = types.model({
  fullName: types.string,
  phoneNumber: types.string,
  email: types.string,
  homeAddress: types.string,
  dateOfBirth: types.string,
  nationality: types.string,
  identificationDetails: IdentificationDetailsModel,
});

const NextOfKinDetailsModel = types.model({
  fullName: types.string,
  relationship: types.string,
  phoneNumber: types.string,
  email: types.string,
  homeAddress: types.string,
  dateOfBirth: types.string,
  nationality: types.string,
});

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
  productName: types.string,
  productUnits: types.number,
  productPrice: types.string,
  productImage: types.string,
  productTag: types.string,
});

const ParametersModel = types.model({
  currentProductId: types.string,
  paymentMode: types.enumeration(["INSTALLMENT", "ONE_OFF"]),
  installmentDuration: types.maybeNull(types.number),
  installmentStartingPrice: types.maybeNull(types.number),
  address: types.string,
  discount: types.maybeNull(types.number),
});

const MiscellaneousPricesModel = types.model({
  currentProductId: types.string,
  costs: types.map(types.number),
});

const SaleMiscellaneousPricesModel = types.model({
  costs: types.map(types.number),
});

const DevicesModel = types.model({
  currentProductId: types.string,
  devices: types.array(types.string),
});

const SaleRecipientModel = types.model({
  firstname: types.string,
  lastname: types.string,
  address: types.string,
  phone: types.string,
  email: types.string,
});

const SaleItemsModel = types.model({
  productId: types.string,
  quantity: types.number,
  paymentMode: types.enumeration(["INSTALLMENT", "ONE_OFF"]),
  discount: types.number,
  installmentDuration: types.number,
  installmentStartingPrice: types.number,
  devices: types.array(types.string),
  miscellaneousPrices: SaleMiscellaneousPricesModel,
  saleRecipient: SaleRecipientModel,
});

const saleStore = types
  .model({
    customer: types.maybeNull(CustomerModel),
    bvn: types.string,
    doesCustomerExist: types.boolean,
    products: types.array(ProductModel),
    doesProductCategoryExist: types.boolean,
    parameters: types.array(ParametersModel),
    miscellaneousPrices: types.array(MiscellaneousPricesModel),
    devices: types.array(DevicesModel),
    saleItems: types.array(SaleItemsModel),
    identificationDetails: IdentificationDetailsModel,
    nextOfKinDetails: NextOfKinDetailsModel,
    guarantorDetails: GuarantorModel,
  })
  .actions((self) => ({
    addSaleItem(productId: string) {
      const product = self.products.find((p) => p.productId === productId);
      if (!product) return;

      const params = self.parameters.find(
        (p) => p.currentProductId === productId
      );
      if (!params) return;

      const devices =
        self.devices.find((d) => d.currentProductId === productId)?.devices ||
        [];
      const miscellaneousCosts = self.miscellaneousPrices.reduce(
        (acc, misc) => {
          Object.entries(misc.costs).forEach(([key, value]) => {
            acc[key] = value;
          });
          return acc;
        },
        {} as Record<string, number>
      );

      self.saleItems.push({
        productId,
        quantity: product.productUnits,
        paymentMode: params.paymentMode,
        discount: params.discount || 0,
        installmentDuration: params.installmentDuration || 0,
        installmentStartingPrice: params.installmentStartingPrice || 0,
        devices,
        miscellaneousPrices: { costs: miscellaneousCosts },
        saleRecipient: {
          firstname: "",
          lastname: "",
          address: "",
          phone: "",
          email: "",
        },
      });
    },
    removeSaleItem(productId: string) {
      self.saleItems.replace(
        self.saleItems.filter((item) => item.productId !== productId)
      );
    },
    clearSaleItems() {
      self.saleItems.clear();
    },
    addCustomer(customer: typeof self.customer) {
      self.customer = customer;
    },
    removeCustomer() {
      self.customer = null;
    },
    addUpdateBVN(bvn: string) {
      self.bvn = bvn;
    },
    setCustomerExist(value: boolean) {
      self.doesCustomerExist = value;
    },
    addProduct(product: any) {
      const existingIndex = self.products.findIndex(
        (p) => p.productId === product.productId
      );

      if (existingIndex !== -1) {
        // Update existing product
        self.products[existingIndex] = {
          ...self.products[existingIndex],
          ...product,
        };
      } else {
        // Add new product
        self.products.push(product);
      }
    },
    removeProduct(productId?: string) {
      const index = self.products.findIndex((p) => p.productId === productId);
      if (index !== -1) {
        self.products.splice(index, 1);
      }
    },
    currentProductUnits(productId?: string) {
      const currentUnits = self.products.find(
        (p) => p.productId === productId
      )?.productUnits;
      return currentUnits;
    },
    emptyProducts() {
      self.products.clear();
    },
    setProductCategoryExist(value: boolean) {
      self.doesProductCategoryExist = value;
    },
    addParameters(params: {
      currentProductId: string;
      paymentMode: "INSTALLMENT" | "ONE_OFF";
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
    addIdentificationDetails(details: typeof self.identificationDetails) {
      self.identificationDetails = details;
    },
    removeIdentificationDetails() {
      self.identificationDetails = {
        idType: "",
        idNumber: "",
        issuingCountry: "",
        issueDate: "",
        expirationDate: "",
        fullNameAsOnID: "",
        addressAsOnID: "",
      };
    },
    addNextOfKinDetails(details: typeof self.nextOfKinDetails) {
      self.nextOfKinDetails = details;
    },
    removeNextOfKinDetails() {
      self.nextOfKinDetails = {
        fullName: "",
        relationship: "",
        phoneNumber: "",
        email: "",
        homeAddress: "",
        dateOfBirth: "",
        nationality: "",
      };
    },
    addGuarantorDetails(details: typeof self.guarantorDetails) {
      self.guarantorDetails = details;
    },
    removeGuarantorDetails() {
      self.guarantorDetails = {
        fullName: "",
        phoneNumber: "",
        email: "",
        homeAddress: "",
        dateOfBirth: "",
        nationality: "",
        identificationDetails: {
          idType: "",
          idNumber: "",
          issuingCountry: "",
          issueDate: "",
          expirationDate: "",
          fullNameAsOnID: "",
          addressAsOnID: "",
        },
      };
    },
  }));

export const SaleStore = saleStore.create({
  customer: null,
  bvn: "",
  doesCustomerExist: false,
  products: [],
  doesProductCategoryExist: false,
  parameters: [],
  miscellaneousPrices: [],
  devices: [],
  saleItems: [],
  identificationDetails: {
    idType: "",
    idNumber: "",
    issuingCountry: "",
    issueDate: "",
    expirationDate: "",
    fullNameAsOnID: "",
    addressAsOnID: "",
  },
  nextOfKinDetails: {
    fullName: "",
    relationship: "",
    phoneNumber: "",
    email: "",
    homeAddress: "",
    dateOfBirth: "",
    nationality: "",
  },
  guarantorDetails: {
    fullName: "",
    phoneNumber: "",
    email: "",
    homeAddress: "",
    dateOfBirth: "",
    nationality: "",
    identificationDetails: {
      idType: "",
      idNumber: "",
      issuingCountry: "",
      issueDate: "",
      expirationDate: "",
      fullNameAsOnID: "",
      addressAsOnID: "",
    },
  },
});

export type SaleStoreType = Instance<typeof saleStore>;
