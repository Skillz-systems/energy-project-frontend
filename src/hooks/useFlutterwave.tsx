// import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
// import { useCallback } from "react";

// const public_key = import.meta.env.VITE_FLW_PUBLIC_KEY;
// const base_url = import.meta.env.VITE_API_BASE_URL;

export type FlutterwavePaymentPayload = {
  amount: number;
  public_key: string;
  tx_ref: string;
  currency: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  redirect_url?: string;
  payment_options: string;
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  meta: {
    saleId: string;
  };
};

// const useFlutterwaveConfig = (data: FlutterwavePaymentPayload) => {
//   const config = {
//     public_key,
//     tx_ref: data.tx_ref,
//     amount: data.amount,
//     redirect_url: data.redirect_url || `${base_url}/sales`,
//     currency: data.currency,
//     payment_options: data.payment_options,
//     customer: {
//       email: data.customer.email,
//       phone_number: data.customer.phone_number || "",
//       name: data.customer.name || "",
//     },
//     customizations: data.customizations,
//     meta: data.meta,
//   };

//   const initializeFlutterwave = useFlutterwave(config);

//   const handleFlutterPayment = useCallback(
//     (options?: {
//       callback?: (response: any) => void;
//       onClose?: () => void;
//     }) => {
//       initializeFlutterwave({
//         callback: options?.callback || (() => {}),
//         onClose: options?.onClose || (() => {}),
//       });
//     },
//     [initializeFlutterwave]
//   );

//   return { handleFlutterPayment, closePaymentModal };
// };
