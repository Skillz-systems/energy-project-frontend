import { useState } from "react";
import { Modal } from "../ModalComponent/Modal";
import { KeyedMutator } from "swr";
import { Input, SelectInput } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";

export type AgentsFormType = "newAgents" | "existingAgents";

interface CreateNewAgentsProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allAgentsRefresh?: KeyedMutator<any>;
  formType: AgentsFormType;
}

const defaultAgentsFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  addressType: "",
  address: "",
  existingAgents: "",
};

const defaultOtherFormData = {
  existingAgents: "",
  newCategory: "",
  newSubCategory: "",
  newLocation: "",
};

const CreateNewAgents = ({
  isOpen,
  setIsOpen,
  formType,
}: CreateNewAgentsProps) => {
  const [formData, setFormData] = useState(defaultAgentsFormData);
  const [loading, setLoading] = useState(false);
  const [otherFormData, setOtherFormData] = useState(defaultOtherFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    if (formType === "newAgents") {
      if (!formData) return;
    } else {
      if (!isOtherFormFilled()) return;
    }

    try {
      if (formType === "newAgents") {
        console.log(formData);
      } else {
        console.log(isOtherFormFilled());
      }
      setLoading(false);
    } catch (error) {
      console.error("Agent creation failed:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setIsOpen(false);
      if (formType === "newAgents") {
        setFormData(defaultAgentsFormData);
      } else {
        setOtherFormData(defaultOtherFormData);
      }
    }
  };

  const isFormFilled = Object.values(formData).some((value) => Boolean(value));
  
  const isOtherFormFilled = () => {
    if (formType === "existingAgents") {
      return Boolean(otherFormData.existingAgents);
    }
    return false;
  };

  const renderForm = () => {
    const formFields = (
      <>
        <Input
          type="text"
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          required={true}
          style={isFormFilled ? "border-strokeCream" : "border-strokeGrey"}
        />
        <Input
          type="text"
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          required={true}
          style={isFormFilled ? "border-strokeCream" : "border-strokeGrey"}
        />
        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required={true}
          style={isFormFilled ? "border-strokeCream" : "border-strokeGrey"}
        />
        <Input
          type="text"
          name="phoneNumber"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
          required={true}
          style={isFormFilled ? "border-strokeCream" : "border-strokeGrey"}
        />
        <SelectInput
          label="Address Type (Home/Work)"
          options={[
            { label: "Home", value: "home" },
            { label: "Work", value: "work" },
          ]}
          value={formData.addressType}
          onChange={(selectedValue) =>
            handleSelectChange("addressType", selectedValue)
          }
          required={true}
          placeholder="Address type (Home/Work)"
          style={isFormFilled ? "border-strokeCream" : "border-strokeGrey"}
        />
        <Input
          type="text"
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Address"
          required={true}
          style={isFormFilled ? "border-strokeCream" : "border-strokeGrey"}
        />
      </>
    );

    return formFields;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      layout="right"
      bodyStyle="pb-[100px]"
    >
      <form
        className="flex flex-col items-center bg-white"
        onSubmit={handleSubmit}
      >
        <div
          className={`flex items-center justify-center px-4 w-full min-h-[64px] border-b-[0.6px] border-strokeGreyThree ${
            isFormFilled ? "bg-paleCreamGradientLeft" : "bg-paleGrayGradientLeft"
          }`}
        >
          <h2
            style={{ textShadow: "1px 1px grey" }}
            className="text-xl text-textBlack font-semibold font-secondary"
          >
            {formType === "newAgents" ? "New Agents" : "Existing Agents"}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-[2.5em] gap-4 py-8">
          {renderForm()}
        </div>
        <ProceedButton
          type="submit"
          loading={loading}
          variant={isFormFilled ? "gradient" : "gray"}
        />
      </form>
    </Modal>
  );
};

export default CreateNewAgents;