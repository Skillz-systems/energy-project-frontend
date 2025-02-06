import { z } from "zod";

export const saleRecipientSchema = z.object({
  firstname: z.string().trim().min(2, "Firstname is required"),
  lastname: z.string().trim().min(2, "Lastname is required"),
  address: z.string().trim().min(1, "Address is required"),
  phone: z.string().trim().min(10, "Phone number is required"),
  email: z.string().trim().email("Invalid email"),
});

export const saleItemSchema = z.object({
  productId: z.string().trim().min(10, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  paymentMode: z.enum(["ONE_OFF", "INSTALLMENT"], {
    message: "Payment Mode is required",
  }),
  discount: z.number().min(0, "Discount must be a positive number").optional(),
  installmentDuration: z
    .number()
    .min(1, "Installment duration must be at least 1 month")
    .optional(),
  installmentStartingPrice: z
    .number()
    .min(1, "Installment starting price must be positive")
    .optional(),
  devices: z.array(z.string()).min(1, "At least one device is required"),
  miscellaneousPrices: z
    .record(z.string(), z.number().min(0, "Price must be a positive number"))
    .optional(),
  saleRecipient: saleRecipientSchema,
});

export const identificationDetailsSchema = z.object({
  idType: z.string().trim().min(2, "ID Type is required"),
  idNumber: z.string().trim().min(5, "ID Number is required"),
  issuingCountry: z.string().trim().min(2, "Issuing Country is required"),
  issueDate: z
    .string()
    .trim()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid issue date",
    }),
  expirationDate: z
    .string()
    .trim()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid expiration date",
    }),
  fullNameAsOnID: z.string().trim().min(3, "Full name as on ID is required"),
  addressAsOnID: z.string().trim(),
});

export const nextOfKinDetailsSchema = z.object({
  fullName: z.string().trim().min(3, "Full name is required"),
  relationship: z.string().trim().min(2, "Relationship is required"),
  phoneNumber: z.string().trim().min(10, "Phone number is required"),
  email: z.string().email("Invalid email"),
  homeAddress: z.string().trim(),
  dateOfBirth: z
    .string()
    .trim()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date of birth",
    }),
  nationality: z.string().trim(),
});

export const guarantorDetailsSchema = z.object({
  fullName: z.string().trim().min(3, "Full name is required"),
  phoneNumber: z.string().trim().min(10, "Phone number is required"),
  email: z.string().trim().email("Invalid email"),
  homeAddress: z.string().trim().min(5, "Home address is required"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date of birth",
  }),
  nationality: z.string().trim(),
  identificationDetails: identificationDetailsSchema,
});

export const formSchema = z
  .object({
    category: z.enum(["PRODUCT"], {
      message: "Category is required",
    }),
    customerId: z.string().min(1, "Please select at least one customer"),
    bvn: z
      .string()
      .length(11, "BVN must be exactly 11 digits")
      .regex(/^\d+$/, "BVN must contain only numbers")
      .optional(),
    saleItems: z
      .array(saleItemSchema)
      .min(1, "At least one sale item is required"),
    nextOfKinDetails: z
      .union([nextOfKinDetailsSchema, z.literal("").transform(() => undefined)])
      .optional(),
    identificationDetails: z
      .union([
        identificationDetailsSchema,
        z.literal("").transform(() => undefined),
      ])
      .optional(),
    guarantorDetails: z
      .union([guarantorDetailsSchema, z.literal("").transform(() => undefined)])
      .optional(),
  })
  .refine(
    (data) => {
      // Check if any sale item has paymentMode as "INSTALLMENT"
      const hasInstallment = data.saleItems.some(
        (item) => item.paymentMode === "INSTALLMENT"
      );

      // If any sale item has paymentMode as "INSTALLMENT", enforce nextOfKinDetails and guarantorDetails
      if (
        hasInstallment &&
        (!data.nextOfKinDetails || !data.guarantorDetails)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Next of kin and guarantor details must be provided if payment mode is installment",
      path: ["nextOfKinDetails", "guarantorDetails"],
    }
  );

type SaleItem = {
  productId: string;
  quantity: number;
  paymentMode: "INSTALLMENT" | "ONE_OFF";
  discount?: number;
  installmentDuration?: number;
  installmentStartingPrice?: number;
  devices: string[];
  miscellaneousPrices?: {
    [key: string]: number;
  };
  saleRecipient: {
    firstname: string;
    lastname: string;
    address: string;
    phone: string;
    email: string;
  };
};

type NextOfKinDetails = {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
  dateOfBirth: string;
  nationality: string;
};

type IdentificationDetails = {
  idType: string;
  idNumber: string;
  issuingCountry: string;
  issueDate: string;
  expirationDate: string;
  fullNameAsOnID: string;
  addressAsOnID: string;
};

type GuarantorDetails = {
  fullName: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
  identificationDetails: IdentificationDetails;
  dateOfBirth: string;
  nationality: string;
};

export type SalePayload = {
  category: "PRODUCT";
  customerId: string;
  bvn?: string;
  saleItems: SaleItem[];
  nextOfKinDetails: NextOfKinDetails;
  identificationDetails: IdentificationDetails;
  guarantorDetails: GuarantorDetails;
};

export const defaultSaleFormData: SalePayload = {
  category: "PRODUCT",
  customerId: "",
  bvn: "",
  saleItems: [
    // {
    //   productId: "",
    //   quantity: 1,
    //   paymentMode: "ONE_OFF",
    //   discount: 0,
    //   installmentDuration: 1,
    //   installmentStartingPrice: 0,
    //   devices: [],
    //   miscellaneousPrices: {},
    //   saleRecipient: {
    //     firstname: "",
    //     lastname: "",
    //     address: "",
    //     phone: "",
    //     email: "",
    //   },
    // },
  ],
  nextOfKinDetails: {
    fullName: "",
    relationship: "",
    phoneNumber: "",
    email: "",
    homeAddress: "",
    dateOfBirth: "",
    nationality: "",
  },
  identificationDetails: {
    idType: "",
    idNumber: "",
    issuingCountry: "",
    issueDate: "",
    expirationDate: "",
    fullNameAsOnID: "",
    addressAsOnID: "",
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
};
