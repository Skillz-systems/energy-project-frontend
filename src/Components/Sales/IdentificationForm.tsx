import { useState } from "react";
import { Input, SelectInput } from "../InputComponent/Input";
import { z } from "zod";
import { identificationDetailsSchema } from "./salesSchema";
import { SaleStore } from "@/stores/SaleStore";

type FormData = z.infer<typeof identificationDetailsSchema>;

const defaultFormData: FormData = {
  idType: "",
  idNumber: "",
  issuingCountry: "",
  issueDate: "",
  expirationDate: "",
  fullNameAsOnID: "",
  addressAsOnID: "",
};

const IdentificationForm = ({ handleClose }: { handleClose: () => void }) => {
  const [formData, setFormData] = useState<FormData>(
    SaleStore.identificationDetails
  );
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => prev.filter((error) => error.path[0] !== name));
  };

  const handleSelectChange = (name: string, values: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
    setFormErrors((prev) => prev.filter((error) => error.path[0] !== name));
  };

  const isFormFilled = Object.entries(formData)
    .filter(
      ([key]) => !["issueDate", "expirationDate", "addressAsOnID"].includes(key)
    )
    .every(([, value]) => value !== "");

  const getFieldError = (fieldName: string) => {
    return formErrors.find((error) => error.path[0] === fieldName)?.message;
  };

  const validateItems = () => {
    const result = identificationDetailsSchema.safeParse(formData);
    if (!result.success) {
      setFormErrors(result.error.issues);
      return false;
    }
    setFormErrors([]);
    return true;
  };

  const saveForm = () => {
    if (!validateItems()) return;
    SaleStore.addIdentificationDetails(formData);
    setFormData(defaultFormData);
    handleClose();
  };

  return (
    <div className="flex flex-col justify-between h-full max-h-[360px] py-4 pr-1 sm:pr-3 overflow-y-auto gap-4">
      <SelectInput
        label="ID Type"
        options={[
          { label: "Passport", value: "Passport" },
          { label: "Driver's License", value: "Driver's License" },
          { label: "National ID", value: "National ID" },
        ]}
        value={formData.idType}
        onChange={(selectedValue) =>
          handleSelectChange("idType", selectedValue)
        }
        placeholder="Select ID Type"
        required={true}
        errorMessage={getFieldError("idType")}
      />
      <Input
        type="text"
        name="idNumber"
        label="ID Number"
        value={formData.idNumber}
        onChange={handleInputChange}
        placeholder="Enter ID Number"
        required={true}
        errorMessage={getFieldError("idNumber")}
      />
      <Input
        type="text"
        name="issuingCountry"
        label="Issuing Country"
        value={formData.issuingCountry}
        onChange={handleInputChange}
        placeholder="Enter Issuing Country"
        required={true}
        errorMessage={getFieldError("issuingCountry")}
      />
      <Input
        type="date"
        name="issueDate"
        label="Issue Date"
        value={formData.issueDate}
        onChange={handleInputChange}
        placeholder="Enter Issue Date"
        required={false}
        errorMessage={getFieldError("issueDate")}
      />
      <Input
        type="date"
        name="expirationDate"
        label="Expiration Date"
        value={formData.expirationDate}
        onChange={handleInputChange}
        placeholder="Enter Expiration Date"
        required={false}
        errorMessage={getFieldError("expirationDate")}
      />
      <Input
        type="text"
        name="fullNameAsOnID"
        label="Full Name as on ID"
        value={formData.fullNameAsOnID}
        onChange={handleInputChange}
        placeholder="Enter Full Name as on ID"
        required={true}
        errorMessage={getFieldError("fullNameAsOnID")}
      />
      <Input
        type="text"
        name="addressAsOnID"
        label="Address as on ID"
        value={formData.addressAsOnID}
        onChange={handleInputChange}
        placeholder="Enter Address as on ID"
        required={false}
        errorMessage={getFieldError("addressAsOnID")}
      />
      <div className="flex items-center justify-between gap-1 mt-4">
        <button
          type="button"
          className="w-max min-w-[150px] bg-white text-textDarkGrey font-medium px-8 py-3 border-[0.6px] border-strokeGreyTwo shadow-sm rounded-full hover:bg-slate-50 transition-all"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!isFormFilled}
          className="w-max min-w-[150px] bg-primaryGradient text-white font-medium px-8 py-3 shadow-sm rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={saveForm}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default IdentificationForm;
