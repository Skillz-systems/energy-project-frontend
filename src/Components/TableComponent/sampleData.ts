import solarpanel from "../../assets/table/solar-panel.png";
import inverters from "../../assets/table/inverter.jpg";
import batteries from "../../assets/table/battery.avif";
import controllers from "../../assets/table/controllers.avif";
import accessories from "../../assets/table/accessory.avif";

type Entry = {
  no: number;
  name: string;
  email: string;
  location: string;
  product: string;
  status: string;
};

// Helper function to get random values
const getRandomItem = (items: any[]) =>
  items[Math.floor(Math.random() * items.length)];

// Generate 'n' random entries
export const generateCustomerEntries = (count: number): Entry[] => {
  const names = ["Naomi Gambo", "John Doe", "Mary Jane", "David Smith"];
  const emails = [
    "naomigambo@gmail.com",
    "johndoe@gmail.com",
    "maryjane@gmail.com",
    "davidsmith@gmail.com",
  ];
  const locations = ["Asaba", "Lagos", "Abuja", "Makurdi"];
  const products = ["01", "02", "03", "04"];
  const statuses = [
    "DUE: SEPT 11 2024",
    "NONE",
    "DEFAULTED: 29 DAYS",
    "COMPLETED",
  ];

  const entries: Entry[] = [];

  for (let i = 1; i <= count; i++) {
    entries.push({
      no: i,
      name: getRandomItem(names),
      email: getRandomItem(emails),
      location: getRandomItem(locations),
      product: getRandomItem(products),
      status: getRandomItem(statuses),
    });
  }

  return entries;
};

type EntryTwo = {
  no: number;
  name: string;
  status: string;
  onGoingSales: number;
  inventoryInPossession: number;
  sales: number;
  registeredCustomers: number;
};

// Generate 'n' random entries
export const generateAgentEntries = (count: number): EntryTwo[] => {
  const names = ["Naomi Gambo", "John Doe", "Mary Jane", "David Smith"];
  const status = ["active", "barred", "reported"];
  const numbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  const entries: EntryTwo[] = [];

  for (let i = 1; i <= count; i++) {
    entries.push({
      no: i,
      name: getRandomItem(names),
      status: getRandomItem(status),
      onGoingSales: getRandomItem(numbers),
      inventoryInPossession: getRandomItem(numbers),
      sales: getRandomItem(numbers),
      registeredCustomers: getRandomItem(numbers),
    });
  }

  return entries;
};

type EntryThree = {
  no: number;
  name: string;
  email: string;
  location: string;
  role: string;
  status: string;
};

// Generate 'n' random entries
export const generateUserEntries = (count: number): EntryThree[] => {
  const names = ["Naomi Gambo", "John Doe", "Mary Jane", "David Smith"];
  const emails = [
    "naomigambo@gmail.com",
    "johndoe@gmail.com",
    "maryjane@gmail.com",
    "davidsmith@gmail.com",
  ];
  const locations = ["Asaba", "Lagos", "Abuja", "Makurdi"];
  const roles = [
    "Super Admin",
    "Admin",
    "Support",
    "Inventory",
    "Account",
    "Sales",
  ];
  const statuses = ["ACTIVE", "INACTIVE"];

  const entries: EntryThree[] = [];

  for (let i = 1; i <= count; i++) {
    entries.push({
      no: i,
      name: getRandomItem(names),
      email: getRandomItem(emails),
      location: getRandomItem(locations),
      role: getRandomItem(roles),
      status: getRandomItem(statuses),
    });
  }

  return entries;
};

interface ProductEntries {
  productId: number;
  productTag: string;
  productImage: string;
  productPrice: number;
  paymentModes: string[];
  datetime: string;
  name: string;
}

const names = [
  "Naomi Gambo",
  "John Doe",
  "Mary Jane",
  "David Smith",
  "Ahire Tersoo",
];
const productTags = ["EAAS", "SHS", "Rooftop"];
const productPrices = [1200000, 850000, 950000, 620000, 420000];
const paymentOptions = [
  ["One-Time", "Instalmental"],
  ["One-Time"],
  ["Instalmental"],
];
const images = [solarpanel, inverters, batteries, controllers, accessories];

// Helper function to generate a list of random product entries
export const generateRandomProductEntries = (
  count: number,
  filterTags?: string[]
): ProductEntries[] => {
  const entries: ProductEntries[] = [];

  for (let i = 1; i <= count; i++) {
    const entry = {
      productId: 100000 + i,
      productTag: getRandomItem(productTags),
      productImage: getRandomItem(images),
      productPrice: getRandomItem(productPrices),
      paymentModes: getRandomItem(paymentOptions),
      datetime: new Date().toISOString(),
      name: getRandomItem(names),
    };

    // Only add entry if it matches a tag in filterTags, or if no filter is applied
    if (!filterTags || filterTags.includes(entry.productTag)) {
      entries.push(entry);
    }
  }

  return entries;
};

export const generateRandomProductEntry = (): ProductEntries => {
  // Generate a single random product entry
  const productEntry: ProductEntries = {
    productId: 100000 + Math.floor(Math.random() * 1000),
    productTag: getRandomItem(productTags),
    productImage: getRandomItem(images),
    productPrice: getRandomItem(productPrices),
    paymentModes: getRandomItem(paymentOptions),
    datetime: new Date().toISOString(),
    name: getRandomItem(names),
  };

  return productEntry;
};

const productCategory = [
  "solarPanels",
  "inverters",
  "batteries",
  "chargeControllers",
  "accessories",
];

const solarPanels = [
  "SolarMax 2000",
  "EcoLite Panel",
  "SunPower Ultra",
  "Photon Pro",
  "EnergyStar Panel",
];

const inverter = [
  "VoltSwitch Pro",
  "PowerSync 500",
  "InverMax Prime",
  "WattWave Lite",
  "GridFlex Ultra",
];

const battery = [
  "LithiumCore X",
  "EnergyVault 3000",
  "PowerSafe Elite",
  "ChargeHub Max",
  "BatteryBank Pro",
];

const controller = [
  "SolarBrain X",
  "ChargeControl Max",
  "SunTrack Elite",
  "PowerFlow 400",
  "GridManager Pro",
];

const accessory = [
  "CableMaster Pro",
  "SolarMount Kit",
  "ConnectorFlex",
  "PanelClamp Set",
  "VoltageReg Ultra",
];

const productUnits = [10, 6, 12, 15, 18, 20];

type ProductInventoryType = {
  name: string;
  data: {
    productId: string | number;
    productImage: string;
    productTag: string;
    productName: string;
    productPrice: number;
    productUnits: number;
  }[];
};

const getRandomProductName = (name: string) => {
  switch (name) {
    case "solarPanels":
      return getRandomItem(solarPanels);
    case "inverters":
      return getRandomItem(inverter);
    case "batteries":
      return getRandomItem(battery);
    case "chargeControllers":
      return getRandomItem(controller);
    case "accessories":
      return getRandomItem(accessory);
    default:
      return "Undefined Product Name";
  }
};

const getRandomProductImage = (name: string) => {
  switch (name) {
    case "solarPanels":
      return solarpanel;
    case "inverters":
      return inverters;
    case "batteries":
      return batteries;
    case "chargeControllers":
      return controllers;
    case "accessories":
      return accessories;
    default:
      break;
  }
};

export const generateRandomProductInventoryEntries = (...counts: number[]) => {
  if (counts.length !== productCategory.length) {
    throw new Error(
      `Counts array length (${counts.length}) must match productCategory length (${productCategory.length})`
    );
  }

  const entries: ProductInventoryType[] = productCategory.map(
    (item, index) => ({
      name: item,
      data: Array.from({ length: counts[index] }, (_, i) => ({
        productId: 100000 + index * 1000 + i, // Generate unique IDs
        productImage: getRandomProductImage(item),
        productTag: getRandomItem(["Lima", "Sigma"]),
        productName: getRandomProductName(item),
        productPrice: getRandomItem(productPrices),
        productUnits: getRandomItem(productUnits),
      })),
    })
  );

  return entries;
};
