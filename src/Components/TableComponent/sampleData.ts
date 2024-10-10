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
