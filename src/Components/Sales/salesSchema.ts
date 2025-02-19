import { z } from "zod";

export const saleRecipientSchema = z.object({
  firstname: z.string().trim().min(2, "Firstname is required"),
  lastname: z.string().trim().min(2, "Lastname is required"),
  address: z.string().trim().min(1, "Address is required"),
  phone: z.string().trim().min(10, "Phone number is required"),
  email: z.string().trim().email("Invalid email"),
});

export const identificationDetailsSchema = z
  .object({
    idType: z.string().trim().min(2, "ID Type is required"),
    idNumber: z.string().trim().min(5, "ID Number is required"),
    issuingCountry: z.string().trim().min(2, "Issuing Country is required"),
    issueDate: z
      .string()
      .trim()
      .refine((date) => date === "" || !isNaN(Date.parse(date)), {
        message: "Invalid issue date",
      })
      .refine((date) => date === "" || new Date(date) <= new Date(), {
        message: "Issue date cannot be in the future",
      }),
    expirationDate: z
      .string()
      .trim()
      .refine((date) => date === "" || !isNaN(Date.parse(date)), {
        message: "Invalid expiration date",
      })
      .refine((date) => date === "" || new Date(date) <= new Date(), {
        message: "Expiration date cannot be in the future",
      }),
    fullNameAsOnID: z.string().trim().min(3, "Full name as on ID is required"),
    addressAsOnID: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.issueDate && data.expirationDate) {
      const issueDate = new Date(data.issueDate);
      const expirationDate = new Date(data.expirationDate);

      if (expirationDate <= issueDate) {
        ctx.addIssue({
          code: "custom",
          path: ["expirationDate"],
          message: "Expiration date must be later than issue date",
        });
      }
    }
  });

export const nextOfKinDetailsSchema = z.object({
  fullName: z.string().trim().min(3, "Full name is required"),
  relationship: z.string().trim().min(2, "Relationship is required"),
  phoneNumber: z.string().trim().min(10, "Phone number is required"),
  email: z.string().email("Invalid email").or(z.literal("")),
  homeAddress: z.string().trim(),
  dateOfBirth: z
    .string()
    .trim()
    .refine((date) => date === "" || !isNaN(Date.parse(date)), {
      message: "Invalid date of birth",
    })
    .refine((date) => date === "" || new Date(date) <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  nationality: z.string().trim(),
});

export const guarantorDetailsSchema = z.object({
  fullName: z.string().trim().min(3, "Full name is required"),
  phoneNumber: z.string().trim().min(10, "Phone number is required"),
  email: z.string().trim().email("Invalid email").or(z.literal("")),
  homeAddress: z.string().trim().min(1, "Home address is required"),
  dateOfBirth: z
    .string()
    .trim()
    .refine((date) => date === "" || !isNaN(Date.parse(date)), {
      message: "Invalid date of birth",
    })
    .refine((date) => date === "" || new Date(date) <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  nationality: z.string().trim(),
  identificationDetails: identificationDetailsSchema,
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
  identificationDetails: identificationDetailsSchema.optional(),
  nextOfKinDetails: nextOfKinDetailsSchema.optional(),
  guarantorDetails: guarantorDetailsSchema.optional(),
});

export const formSchema = z.object({
  category: z.enum(["PRODUCT"], {
    message: "Category is required",
  }),
  customerId: z.string().min(1, "Please select at least one customer"),
  saleItems: z
    .array(saleItemSchema)
    .min(1, "At least one sale item is required"),
  bvn: z
    .string()
    .length(11, "BVN must be exactly 11 digits")
    .regex(/^\d+$/, "BVN must contain only numbers")
    .optional()
    .or(z.literal("")),
});

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
  nextOfKinDetails: NextOfKinDetails;
  identificationDetails: IdentificationDetails;
  guarantorDetails: GuarantorDetails;
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
};

export const defaultSaleFormData: SalePayload = {
  category: "PRODUCT",
  customerId: "",
  bvn: "",
  saleItems: [],
};
