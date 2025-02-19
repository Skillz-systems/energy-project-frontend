import { useState } from "react";
import { Input, SelectInput } from "../InputComponent/Input";
import { z } from "zod";
import { guarantorDetailsSchema } from "./salesSchema";
import { SaleStore } from "@/stores/SaleStore";
import { formatDateForInput } from "@/utils/helpers";

type FormData = z.infer<typeof guarantorDetailsSchema>;

const defaultFormData: FormData = {
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

const GuarantorForm = ({
  handleClose,
  currentProductId,
}: {
  handleClose: () => void;
  currentProductId: string;
}) => {
  const savedData =
    SaleStore.getGuarantorByProductId(currentProductId) || defaultFormData;
  const [formData, setFormData] = useState<FormData>({
    ...savedData,
    dateOfBirth: savedData.dateOfBirth,
    identificationDetails: {
      ...savedData.identificationDetails,
      issueDate: formatDateForInput(savedData.identificationDetails.issueDate),
      expirationDate: formatDateForInput(
        savedData.identificationDetails.expirationDate
      ),
    },
  });
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

  const handleNestedInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      identificationDetails: {
        ...prev.identificationDetails,
        [name]: value,
      },
    }));
  };

  const handleNestedSelectChange = (
    name: string,
    values: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      identificationDetails: {
        ...prev.identificationDetails,
        [name]: values,
      },
    }));
  };

  const isFormFilled = guarantorDetailsSchema.safeParse(formData).success;

  const getFieldError = (fieldName: string) => {
    return formErrors.find((error) => error.path[0] === fieldName)?.message;
  };

  const validateItems = () => {
    const result = guarantorDetailsSchema.safeParse(formData);
    if (!result.success) {
      setFormErrors(result.error.issues);
      return false;
    }
    setFormErrors([]);
    return true;
  };

  const saveForm = () => {
    if (!validateItems()) return;
    SaleStore.addUpdateGuarantorDetails(currentProductId, {
      ...formData,
      dateOfBirth: !formData.dateOfBirth
        ? ""
        : new Date(formData.dateOfBirth).toISOString(),
      identificationDetails: {
        ...formData.identificationDetails,
        issueDate: !formData.identificationDetails.issueDate
          ? ""
          : new Date(formData.identificationDetails.issueDate).toISOString(),
        expirationDate: !formData.identificationDetails.expirationDate
          ? ""
          : new Date(
              formData.identificationDetails.expirationDate
            ).toISOString(),
      },
    });
    SaleStore.addSaleItem(currentProductId);
    handleClose();
  };

  return (
    <div className="flex flex-col justify-between h-full max-h-[360px] py-4 pr-1 sm:pr-3 overflow-y-auto gap-4">
      <Input
        type="text"
        name="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={handleInputChange}
        placeholder="Enter Full Name"
        required={true}
        errorMessage={getFieldError("fullName")}
      />
      <Input
        type="text"
        name="phoneNumber"
        label="Phone Number"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        placeholder="Enter Phone Number"
        required={true}
        errorMessage={getFieldError("phoneNumber")}
      />
      <Input
        type="email"
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter Email"
        required={false}
        errorMessage={getFieldError("email")}
      />
      <Input
        type="text"
        name="homeAddress"
        label="Home Address"
        value={formData.homeAddress}
        onChange={handleInputChange}
        placeholder="Enter Home Address"
        required={false}
        errorMessage={getFieldError("homeAddress")}
      />
      <Input
        type="date"
        name="dateOfBirth"
        label="Date of Birth"
        value={formData.dateOfBirth || ""}
        onChange={handleInputChange}
        placeholder="Enter Date of Birth"
        required={false}
        errorMessage={getFieldError("dateOfBirth")}
        description={"Enter Date of Birth"}
      />
      <Input
        type="text"
        name="nationality"
        label="Nationality"
        value={formData.nationality}
        onChange={handleInputChange}
        placeholder="Enter Nationality"
        required={false}
        errorMessage={getFieldError("nationality")}
      />
      <p className="text-sm font-semibold pt-2">
        Fill Guarantor Identification Details
      </p>
      <SelectInput
        label="ID Type"
        options={[
          { label: "NIN", value: "Nin" },
          { label: "Passport", value: "Passport" },
          { label: "Driver's License", value: "Driver_License" },
          { label: "Voter ID", value: "Voter_ID" },
          { label: "Social Security Number", value: "Social_Security_Number" },
        ]}
        value={formData.identificationDetails.idType}
        onChange={(selectedValue) =>
          handleNestedSelectChange("idType", selectedValue)
        }
        placeholder="Select ID Type"
        required={true}
        errorMessage={getFieldError("idType")}
      />
      <Input
        type="text"
        name="idNumber"
        label="ID Number"
        value={formData.identificationDetails.idNumber}
        onChange={handleNestedInputChange}
        placeholder="Enter ID Number"
        required={true}
        errorMessage={getFieldError("idNumber")}
      />
      <Input
        type="text"
        name="issuingCountry"
        label="Issuing Country"
        value={formData.identificationDetails.issuingCountry}
        onChange={handleNestedInputChange}
        placeholder="Enter Issuing Country"
        required={true}
        errorMessage={getFieldError("issuingCountry")}
      />
      <Input
        type="date"
        name="issueDate"
        label="Issue Date"
        value={formData.identificationDetails.issueDate}
        onChange={handleNestedInputChange}
        placeholder="Enter Issue Date"
        required={false}
        errorMessage={getFieldError("issueDate")}
        description={"Enter Issue Date"}
      />
      <Input
        type="date"
        name="expirationDate"
        label="Expiration Date"
        value={formData.identificationDetails.expirationDate}
        onChange={handleNestedInputChange}
        placeholder="Enter Expiration Date"
        required={false}
        errorMessage={getFieldError("expirationDate")}
        description={"Enter Expiration Date"}
      />
      <Input
        type="text"
        name="fullNameAsOnID"
        label="Full Name as on ID"
        value={formData.identificationDetails.fullNameAsOnID}
        onChange={handleNestedInputChange}
        placeholder="Enter Full Name as on ID"
        required={true}
        errorMessage={getFieldError("fullNameAsOnID")}
      />
      <Input
        type="text"
        name="addressAsOnID"
        label="Address as on ID"
        value={formData.identificationDetails.addressAsOnID}
        onChange={handleNestedInputChange}
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

export default GuarantorForm;
