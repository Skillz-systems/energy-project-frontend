import { toJS } from "mobx";
import {
  types,
  Instance,
  cast,
  applySnapshot,
  SnapshotIn,
} from "mobx-state-tree";

const defaultValues: SnapshotIn<typeof saleStore> = {
  category: "PRODUCT",
  customer: null,
  doesCustomerExist: false,
  products: [],
  doesProductCategoryExist: false,
  parameters: [],
  miscellaneousPrices: [],
  devices: [],
  saleItems: [],
  identificationDetails: [],
  nextOfKinDetails: [],
  guarantorDetails: [],
};

const IdentityModel = types.model({
  idType: types.string,
  idNumber: types.string,
  issuingCountry: types.string,
  issueDate: types.string,
  expirationDate: types.string,
  fullNameAsOnID: types.string,
  addressAsOnID: types.string,
});

const IdentificationDetailsModel = types.model({
  currentProductId: types.string,
  identity: IdentityModel,
});

const GuarantorModel = types.model({
  fullName: types.string,
  phoneNumber: types.string,
  email: types.string,
  homeAddress: types.string,
  dateOfBirth: types.string,
  nationality: types.string,
  identificationDetails: IdentityModel,
});

const GuarantorDetailsModel = types.model({
  currentProductId: types.string,
  guarantor: GuarantorModel,
});

const NextOfKinModel = types.model({
  fullName: types.string,
  relationship: types.string,
  phoneNumber: types.string,
  email: types.string,
  homeAddress: types.string,
  dateOfBirth: types.string,
  nationality: types.string,
});

const NextOfKinDetailsModel = types.model({
  currentProductId: types.string,
  nextOfKin: NextOfKinModel,
});

const CustomerModel = types.model({
  customerId: types.string,
  customerName: types.string,
  firstname: types.string,
  lastname: types.string,
  location: types.string,
  email: types.string,
  phone: types.string,
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

const RecipientModel = types.model({
  currentProductId: types.string,
  recipient: SaleRecipientModel,
});

const SaleItemsModel = types.model({
  productId: types.string,
  quantity: types.number,
  paymentMode: types.enumeration(["INSTALLMENT", "ONE_OFF"]),
  discount: types.number,
  installmentDuration: types.maybe(types.number),
  installmentStartingPrice: types.maybe(types.number),
  devices: types.array(types.string),
  miscellaneousPrices: types.maybe(SaleMiscellaneousPricesModel),
  saleRecipient: types.maybe(SaleRecipientModel),
  nextOfKin: types.maybe(NextOfKinModel),
  identity: types.maybe(IdentityModel),
  guarantor: types.maybe(GuarantorModel),
});

const saleStore = types
  .model({
    category: types.enumeration(["PRODUCT"]),
    customer: types.maybeNull(CustomerModel),
    doesCustomerExist: types.boolean,
    products: types.array(ProductModel),
    doesProductCategoryExist: types.boolean,
    parameters: types.array(ParametersModel),
    miscellaneousPrices: types.array(MiscellaneousPricesModel),
    devices: types.array(DevicesModel),
    saleRecipient: types.array(RecipientModel),
    saleItems: types.array(SaleItemsModel),
    identificationDetails: types.array(IdentificationDetailsModel),
    nextOfKinDetails: types.array(NextOfKinDetailsModel),
    guarantorDetails: types.array(GuarantorDetailsModel),
  })
  .actions((self) => ({
    addSaleItem(productId: string) {
      const product = self.products.find((p) => p.productId === productId);
      if (!product) return;

      const params = self.parameters.find(
        (p) => p.currentProductId === productId
      );
      if (!params) return;

      // Ensure devices is a plain array of strings
      const devices = toJS(
        self.devices.find((d) => d.currentProductId === productId)?.devices ||
          []
      );

      // Convert `miscellaneousPrices` into a plain object, filtering based on the current productId
      const miscellaneousCosts = self.miscellaneousPrices.reduce(
        (acc, misc) => {
          // Only include the costs that match the current productId
          if (misc.currentProductId === productId) {
            const plainCosts = toJS(misc.costs); // Convert to a plain object

            plainCosts.forEach((cost, name) => {
              if (typeof cost === "number") {
                acc[name] = cost; // Use the name as the key and cost as the value
              } else {
                console.warn(`Invalid cost value for ${name}:`, cost);
              }
            });
          }

          return acc;
        },
        {} as Record<string, number>
      );

      // Fetch or create the saleRecipient for the given productId
      const recipient = self.saleRecipient.find(
        (recipient) => recipient.currentProductId === productId
      );

      // Ensure recipient is copied to avoid using a reference directly
      const saleRecipient = recipient
        ? { ...recipient.recipient } // Create a shallow copy of the recipient
        : {
            firstname: "",
            lastname: "",
            address: "",
            phone: "",
            email: "",
          };

      const nextOfKin = self.nextOfKinDetails.find(
        (i) => i.currentProductId !== productId
      );

      const saleNextOfKin = nextOfKin
        ? { ...nextOfKin.nextOfKin }
        : {
            fullName: "",
            relationship: "",
            phoneNumber: "",
            email: "",
            homeAddress: "",
            dateOfBirth: "",
            nationality: "",
          };

      const identity = self.identificationDetails.find(
        (i) => i.currentProductId !== productId
      );

      const identityData = {
        idType: "",
        idNumber: "",
        issuingCountry: "",
        issueDate: "",
        expirationDate: "",
        fullNameAsOnID: "",
        addressAsOnID: "",
      };

      const saleIdentity = identity ? { ...identity.identity } : identityData;

      const guarantor = self.guarantorDetails.find(
        (i) => i.currentProductId !== productId
      );

      const saleGuarantor = guarantor
        ? { ...guarantor.guarantor }
        : {
            fullName: "",
            phoneNumber: "",
            email: "",
            homeAddress: "",
            dateOfBirth: "",
            nationality: "",
            identificationDetails: identityData,
          };

      // Check if saleItem with the same productId exists
      const existingSaleItem = self.saleItems.find(
        (item) => item.productId === productId
      );

      if (existingSaleItem) {
        // Update existing sale item instead of adding a new one
        existingSaleItem.quantity = product.productUnits;
        existingSaleItem.paymentMode = params.paymentMode;
        existingSaleItem.discount = params.discount || 0;
        existingSaleItem.installmentDuration = params.installmentDuration || 0;
        existingSaleItem.installmentStartingPrice =
          params.installmentStartingPrice || 0;
        existingSaleItem.devices = cast(devices);
        existingSaleItem.miscellaneousPrices = {
          costs: cast(miscellaneousCosts),
        };
        existingSaleItem.saleRecipient = { ...saleRecipient };
        existingSaleItem.nextOfKin = { ...saleNextOfKin };
        existingSaleItem.identity = { ...saleIdentity };
        existingSaleItem.guarantor = { ...saleGuarantor };
      } else {
        // Add a new sale item if it doesn't exist
        self.saleItems.push({
          productId,
          quantity: product.productUnits,
          paymentMode: params.paymentMode,
          discount: params.discount || 0,
          installmentDuration: params.installmentDuration || 0,
          installmentStartingPrice: params.installmentStartingPrice || 0,
          devices: cast(devices),
          miscellaneousPrices: { costs: cast(miscellaneousCosts) },
          saleRecipient: { ...saleRecipient },
          nextOfKin: { ...saleNextOfKin },
          identity: { ...saleIdentity },
          guarantor: { ...saleGuarantor },
        });
      }
    },
    getTransformedSaleItems() {
      return self.saleItems.map((item) => {
        // Convert the whole `item` object to a plain object, including nested properties
        const plainItem = toJS(item);

        // Fetch the relevant miscellaneous prices for the current productId
        const relevantMiscPrices = self.miscellaneousPrices.find(
          (m) => m.currentProductId === plainItem.productId
        ) || { costs: new Map() };

        // Convert the `costs` Map to a plain object
        const miscellaneousCosts = Array.from(
          relevantMiscPrices.costs.entries()
        ).reduce((acc, [name, cost]) => {
          if (typeof cost === "number") {
            acc[name] = cost; // Assign cost values directly
          } else {
            console.warn(`Invalid cost value for ${name}:`, cost);
          }
          return acc;
        }, {} as Record<string, number>);

        if (Object.keys(miscellaneousCosts).length === 0) {
          delete plainItem.miscellaneousPrices;
        }

        // Remove keys if `paymentMode` is `ONE_OFF`
        if (plainItem.paymentMode === "ONE_OFF") {
          delete plainItem.installmentDuration;
          delete plainItem.installmentStartingPrice;
          delete plainItem.identity;
          delete plainItem.nextOfKin;
          delete plainItem.guarantor;
        }

        // Only add `miscellaneousPrices` if it's not an empty object
        const transformedItem = {
          ...plainItem,
          ...(Object.keys(miscellaneousCosts).length > 0 && {
            miscellaneousPrices: miscellaneousCosts,
          }),
        };

        return transformedItem;
      });
    },
    doesSaleItemHaveInstallment() {
      const filteredArray = self.saleItems.filter(
        (item) => item.paymentMode === "INSTALLMENT"
      );
      const installmentExists = filteredArray.length > 0;
      return installmentExists;
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
    addUpdateCategory(category: "PRODUCT") {
      self.category = category;
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
    getProductById(productId?: string) {
      const product = self.products.find((p) => p.productId === productId);
      return product;
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
      discount: number | null;
    }) {
      self.parameters.push(params);
    },
    getParametersByProductId(productId: string) {
      const parameters = self.parameters.find(
        (p) => p.currentProductId === productId
      );
      return parameters;
    },
    removeParameter(currentProductId?: string) {
      self.parameters.replace(
        self.parameters.filter((p) => p.currentProductId !== currentProductId)
      );
      self.saleItems.forEach((item) => {
        if (item.productId === currentProductId) {
          item.paymentMode = "ONE_OFF";
          item.installmentDuration = undefined;
          item.installmentStartingPrice = undefined;
          item.discount = 0;
        }
      });
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
    getMiscellaneousByProductId(productId: string) {
      return (
        self.miscellaneousPrices.find(
          (m) => m.currentProductId === productId
        ) || { costs: new Map() }
      );
    },
    removeMiscellaneousPrice(currentProductId?: string) {
      self.miscellaneousPrices.replace(
        self.miscellaneousPrices.filter(
          (p) => p.currentProductId !== currentProductId
        )
      );
      self.saleItems.forEach((item) => {
        if (item.productId === currentProductId) {
          item.miscellaneousPrices = undefined;
        }
      });
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
    getSelectedDevices(productId: string) {
      const devices = self.devices.find(
        (d) => d.currentProductId === productId
      )?.devices;
      return devices;
    },
    removeDevices(currentProductId?: string) {
      self.devices.replace(
        self.devices.filter((d) => d.currentProductId !== currentProductId)
      );
      // Empty the `devices` array for the matching `productId` in `saleItems`
      self.saleItems.forEach((item) => {
        if (item.productId === currentProductId) {
          item.devices.replace([]); // Use `replace` to clear the array
        }
      });
    },
    addOrUpdateIdentity(
      currentProductId: string,
      identity: {
        idType: string;
        idNumber: string;
        issuingCountry: string;
        issueDate: string;
        expirationDate: string;
        fullNameAsOnID: string;
        addressAsOnID: string;
      }
    ) {
      const existingIndex = self.identificationDetails.findIndex(
        (d) => d.currentProductId === currentProductId
      );

      if (existingIndex !== -1) {
        applySnapshot(
          self.identificationDetails[existingIndex].identity,
          identity
        );
      } else {
        self.identificationDetails.push(
          IdentificationDetailsModel.create({
            currentProductId,
            identity,
          })
        );
      }
    },
    getIdentityByProductId(productId: string) {
      const identity = self.identificationDetails.find(
        (r) => r.currentProductId === productId
      )?.identity;
      return identity;
    },
    removeIdentificationDetails(currentProductId: string) {
      self.identificationDetails.replace(
        self.identificationDetails.filter(
          (d) => d.currentProductId !== currentProductId
        )
      );
      // Set `identity` to `undefined` for the matching `productId` in `saleItems`
      self.saleItems.forEach((item) => {
        if (item.productId === currentProductId) {
          item.identity = undefined;
        }
      });
    },
    addNextOfKinDetails(
      currentProductId: string,
      nextOfKin: {
        fullName: string;
        relationship: string;
        phoneNumber: string;
        email: string;
        homeAddress: string;
        dateOfBirth: string;
        nationality: string;
      }
    ) {
      const existingIndex = self.nextOfKinDetails.findIndex(
        (d) => d.currentProductId === currentProductId
      );

      if (existingIndex !== -1) {
        applySnapshot(
          self.nextOfKinDetails[existingIndex].nextOfKin,
          nextOfKin
        );
      } else {
        self.nextOfKinDetails.push(
          NextOfKinDetailsModel.create({
            currentProductId,
            nextOfKin,
          })
        );
      }
    },
    getNextOfKinByProductId(productId: string) {
      const nextOfKin = self.nextOfKinDetails.find(
        (r) => r.currentProductId === productId
      )?.nextOfKin;
      return nextOfKin;
    },
    removeNextOfKinDetails(currentProductId: string) {
      self.nextOfKinDetails.replace(
        self.nextOfKinDetails.filter(
          (d) => d.currentProductId !== currentProductId
        )
      );
      self.saleItems.forEach((item) => {
        if (item.productId === currentProductId) {
          item.nextOfKin = undefined;
        }
      });
    },
    addUpdateGuarantorDetails(
      currentProductId: string,
      guarantor: {
        fullName: string;
        phoneNumber: string;
        email: string;
        homeAddress: string;
        dateOfBirth: string;
        nationality: string;
        identificationDetails: {
          idType: string;
          idNumber: string;
          issuingCountry: string;
          issueDate: string;
          expirationDate: string;
          fullNameAsOnID: string;
          addressAsOnID: string;
        };
      }
    ) {
      const existingIndex = self.guarantorDetails.findIndex(
        (d) => d.currentProductId === currentProductId
      );

      if (existingIndex !== -1) {
        applySnapshot(
          self.guarantorDetails[existingIndex].guarantor,
          guarantor
        );
      } else {
        self.guarantorDetails.push(
          GuarantorDetailsModel.create({
            currentProductId,
            guarantor,
          })
        );
      }
    },
    getGuarantorByProductId(productId: string) {
      const guarantor = self.guarantorDetails.find(
        (r) => r.currentProductId === productId
      )?.guarantor;
      return guarantor;
    },
    removeGuarantorDetails(currentProductId: string) {
      self.guarantorDetails.replace(
        self.guarantorDetails.filter(
          (d) => d.currentProductId !== currentProductId
        )
      );
      self.saleItems.forEach((item) => {
        if (item.productId === currentProductId) {
          item.guarantor = undefined;
        }
      });
    },
    addOrUpdateRecipient(
      currentProductId: string,
      recipient: {
        firstname: string;
        lastname: string;
        address: string;
        phone: string;
        email: string;
      }
    ) {
      const existingIndex = self.saleRecipient.findIndex(
        (d) => d.currentProductId === currentProductId
      );

      if (existingIndex !== -1) {
        // Update the existing recipient using applySnapshot
        applySnapshot(self.saleRecipient[existingIndex].recipient, recipient);
      } else {
        // Add new recipient if not found
        self.saleRecipient.push(
          RecipientModel.create({
            currentProductId,
            recipient,
          })
        );
      }
    },
    getRecipientByProductId(productId: string) {
      const recipient = self.saleRecipient.find(
        (r) => r.currentProductId === productId
      )?.recipient;
      return recipient;
    },
    removeRecipient(currentProductId: string) {
      self.saleRecipient.replace(
        self.saleRecipient.filter(
          (d) => d.currentProductId !== currentProductId
        )
      );
      self.saleItems.forEach((item) => {
        if (item.productId === currentProductId) {
          item.saleRecipient = undefined;
        }
      });
    },
    purgeStore() {
      applySnapshot(self, defaultValues);
    },
  }));

export const SaleStore = saleStore.create({
  category: "PRODUCT",
  customer: null,
  doesCustomerExist: false,
  products: [],
  doesProductCategoryExist: false,
  parameters: [],
  miscellaneousPrices: [],
  devices: [],
  saleItems: [],
  identificationDetails: [],
  nextOfKinDetails: [],
  guarantorDetails: [],
});

export type SaleStoreType = Instance<typeof saleStore>;
