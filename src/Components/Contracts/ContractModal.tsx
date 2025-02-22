import React, { useCallback, useEffect, useState } from "react";
import { useApiCall } from "@/utils/useApiCall";

interface CustomerData {
  fullNameAsOnID: string;
  createdAt: string;
  sale: Array<{
    customer: {
      phone: string;
      email: string;
      location: string;
    };
    saleItems: Array<{
      product: {
        name: string;
        description: string | null;
        image: string;
      };
      quantity: number;
    }>;
  }>;
  idType: string;
  idNumber: string;
  addressAsOnID: string;
  nextOfKinFullName: string;
  nextOfKinHomeAddress: string;
  nextOfKinPhoneNumber: string;
  signedAt?: string;
  guarantorFullName: string;
  guarantorHomeAddress: string;
  guarantorIdType: string;
  totalInstallmentMonths: number;
  totalInitialPayment: number;
}

const ContractModal = ({
  setIsOpen,
  contractDocData,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contractDocData: {
    contractProducts: { name: string; components: string[] }[];
    contractID: string;
  };
}) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const { apiCall } = useApiCall();

  const fetchCustomerData = async () => {
    try {
      const response = await apiCall({
        endpoint: `/v1/contract/${contractDocData.contractID}`,
        method: "get",
      });
      setCustomerData({
        ...response.data,
        totalInstallmentMonths: response.data.sale[0]?.totalInstallmentDuration || 0,
        totalInitialPayment: response.data.initialAmountPaid || 0,
      });
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [contractDocData.contractID]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  const calculateNextPaymentDate = (startDate: string, paymentPlan: string) => {
    const date = new Date(startDate);
    if (paymentPlan === "6 Months") {
      date.setMonth(date.getMonth() + 6);
    } else if (paymentPlan === "12 Months") {
      date.setMonth(date.getMonth() + 12);
    }
    return date.toLocaleDateString();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById("contract-content")!.innerHTML], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = "contract.html";
    document.body.appendChild(element);
    element.click();
  };

  const SectionHeader = ({ title }: { title: string }) => {
    return <header className="text-[1.15rem] font-bold">{title}</header>;
  };

  const FillInLine = () => (
    <span className="inline-block min-w-[150px] h-3 border-b border-black"></span>
  );

  // Extract product information from the API response
  const products = customerData?.sale[0]?.saleItems.map(item => ({
    name: item.product.name,
    components: [item.product.description || "No description available"],
  })) || [];

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="fixed inset-0 z-40 transition-opacity bg-black opacity-50"
        onClick={handleClose}
        aria-hidden="true"
      ></div>
      <section className="fixed inset-y-0 inset-x-[20%] z-50">
        <div className="flex flex-col gap-4 w-full bg-white p-4 h-screen overflow-y-auto" id="contract-content">
          <h1 className="text-center font-bold text-[1.5rem]">
            END USER AGREEMENT
          </h1>
          <p>
            This <strong>AGREEMENT</strong> (the “Agreement”) is made between{" "}
            <strong>A4&T POWER SOLUTIONS LIMITED</strong>, (A4&T) and the{" "}
            <strong>{customerData?.fullNameAsOnID || "CUSTOMER"}</strong> as set out in the execution section (the
            “Customer”) on the date appearing in the execution section below and
            sets out the terms and conditions upon which A4&T will sell its
            product(s) (the “Product”) to the Customer.
          </p>
          <section className="flex flex-col gap-2">
            <p>
              The <strong>{customerData?.fullNameAsOnID || "CUSTOMER"}</strong> hereby agrees as follows:
            </p>
            <div>
              <SectionHeader title="1. Product" />
              <p className="pb-2">
                A4&T will sell to the Customer and the Customer agrees to buy
                from A4&T the following product(s):
              </p>
              <ProductSelector products={products} />
            </div>
          </section>
          <section>
            <SectionHeader title="2. Purchase Price & Payment Plans" />
            <p>
              The Customer shall pay the purchase price for the Product, based
              on pricing and payment plans made available by A4&T at the time of
              signing the Agreement (the “Purchase Price”).
            </p>
            <br />
            <p className="leading-relaxed">
              The initial deposit shall be payable upon signing this Agreement.
              The 2nd installment of <FillInLine /> shall become payable on{" "}
              {calculateNextPaymentDate(customerData?.createdAt || new Date().toISOString(), "6 Months")} and subsequent Installment of <FillInLine /> shall
              become payable on <FillInLine /> of every month until the purchase
              price of the product is fully recovered.
            </p>
            <br />
            <p>
              All payment regarding the Contract/Agreement in reference shall be
              made to A4&T Account. Take <strong>NOTICE</strong> that no payment
              is to be made either via cash or bank transfer into sales Agent
              account. A4&T shall not be liable for such payments.
            </p>
          </section>

          <TableOne customerData={customerData} />
         
          <button onClick={handleDownload} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Download Contract
          </button>
        </div>
      </section>
    </div>
  );
};

export default ContractModal;

const ProductSelector = ({
  products,
}: {
  products: { name: string; components: string[] }[];
}) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid black", padding: "8px" }}>Product</th>
          <th style={{ border: "1px solid black", padding: "8px" }}>
            Components
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td className="p-2 border border-black">{product.name}</td>
            <td className="p-2 border border-black">
              <ul>
                {product.components.map((component, idx) => (
                  <li key={idx}>{component}</li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface TableOneProps {
  customerData: CustomerData | null;
}

const TableOne = ({ customerData }: TableOneProps) => {
  if (!customerData) {
    return <p>Loading customer data...</p>;
  }

  return (
    <table className="w-full border-collapse border border-black">
      <thead>
        <tr>
          <th
            colSpan={2}
            className="border border-black bg-gray-200 p-2 text-left italic text-[1.15rem] font-bold"
          >
            CUSTOMER HEREBY ACCEPTS THE ABOVE TERMS AND CONDITIONS
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-black p-2 font-bold">
            Name of Customer
          </td>
          <td className="border border-black p-2">
            {customerData.fullNameAsOnID}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">
            Phone Numbers (Main and Alternate)
          </td>
          <td className="border border-black p-2">
            {customerData.sale[0]?.customer?.phone}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">Email Address</td>
          <td className="border border-black p-2">
            {customerData.sale[0]?.customer?.email}
          </td>
        </tr>
        
        <tr>
          <td className="border border-black p-2 font-bold">Type of ID & No</td>
          <td className="border border-black p-2">
            {customerData.idType} - {customerData.idNumber}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">Total Installment Months</td>
          <td className="border border-black p-2">
            {customerData.totalInstallmentMonths}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">Total Initial Payment</td>
          <td className="border border-black p-2">
            {customerData.totalInitialPayment}
          </td>
        </tr>
        
        <tr>
          <td className="border border-black p-2 font-bold">
            INSTALLATION ADDRESS
          </td>
          <td className="border border-black p-2">
            {customerData.addressAsOnID}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">City/State</td>
          <td className="border border-black p-2">
            {customerData.sale[0]?.customer?.location}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">
            NEXT OF KIN NAME
            <br />
            ADDRESS
            <br />
            PHONE
          </td>
          <td className="border border-black p-2">
            <p>{customerData.nextOfKinFullName}</p>
            <p>{customerData.nextOfKinHomeAddress}</p>
            <p>{customerData.nextOfKinPhoneNumber}</p>
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">
            Commencement Date
          </td>
          <td className="flex gap-4">
            <span className="border-r border-black p-2 w-1/4"></span>
            <div className="flex flex-col items-center justify-center text-sm font-medium h-full">
              <span className="leading-none">P</span>
              <span className="leading-none">L</span>
              <span className="leading-none">A</span>
              <span className="leading-none">N</span>
            </div>
            <label className="flex flex-col items-center justify-start p-2">
              <input type="checkbox" />
              <span className="text-sm text-center">6 Months</span>
            </label>
            <label className="flex flex-col items-center justify-start p-2">
              <input type="checkbox" />
              <span className="text-sm text-center">12 Months</span>
            </label>
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">
            Date of Collection
          </td>
          <td className="border border-black p-2">
            {new Date(customerData.createdAt).toLocaleDateString()}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">Signature/Date</td>
          <td className="border border-black p-2">
            {customerData.signedAt
              ? new Date(customerData.signedAt).toLocaleDateString()
              : "Not signed"}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">
            Guarantor's Name
          </td>
          <td className="border border-black p-2">
            {customerData.guarantorFullName}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">
            Guarantor's Address
          </td>
          <td className="border border-black p-2">
            {customerData.guarantorHomeAddress}
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold">
            Guarantor's ID TYPE
          </td>
          <td className="flex">
            <div className="border-r border-black p-2 w-1/2">
              {customerData.guarantorIdType}
            </div>
            <div className="p-2 w-1/2">SIGN:</div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};