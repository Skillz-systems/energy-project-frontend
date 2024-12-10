import { useState } from "react";
import { Modal } from "../ModalComponent/Modal";
import { KeyedMutator } from "swr";
import { Input, SelectInput } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { useApiCall } from "../../utils/useApiCall";

interface CreateNewAgentsProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshTable: KeyedMutator<any>;
}

const defaultAgentsFormData = {
  firstname: "",
  lastname: "",
  email: "",
  phoneNumber: "",
  addressType: "",
  location: "",
  longitude: "",
  latitude: "",
  emailVerified: true,
};

const CreateNewAgents = ({
  isOpen,
  setIsOpen,
  refreshTable,
}: CreateNewAgentsProps) => {
  const [formData, setFormData] = useState(defaultAgentsFormData);
  const [loading, setLoading] = useState(false);
  const { apiCall } = useApiCall();

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

    if (!isFormFilled) return;

    try {
      const agentData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        addressType: formData.addressType,
        location: formData.location,
        longitude: formData.longitude || "",
        latitude: formData.latitude || "",
        emailVerified: true,
      };

      await apiCall({
        endpoint: "/v1/agents/create",
        method: "post",
        data: agentData,
        successMessage: "Agent created successfully!",
      });

      setLoading(false);
      await refreshTable();
      setIsOpen(false);
      setFormData(defaultAgentsFormData);
    } catch (error) {
      console.error("Agent creation failed:", error);
      setLoading(false);
    }
  };

  const isFormFilled = Object.values(formData).some((value) => Boolean(value));

  const renderForm = () => {
    const formFields = (
      <>
        <Input
          type="text"
          name="firstname"
          label="First Name"
          value={formData.firstname}
          onChange={handleInputChange}
          placeholder="First Name"
          required={true}
          style={isFormFilled ? "border-strokeCream" : "border-strokeGrey"}
        />
        <Input
          type="text"
          name="lastname"
          label="Last Name"
          value={formData.lastname}
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
        <SelectInput
          label="Address Type (Home/Work)"
          options={[
            { label: "Home", value: "HOME" },
            { label: "Work", value: "WORK" },
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
          name="location"
          label="Location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Location"
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
            isFormFilled
              ? "bg-paleCreamGradientLeft"
              : "bg-paleGrayGradientLeft"
          }`}
        >
          <h2
            style={{ textShadow: "1px 1px grey" }}
            className="text-xl text-textBlack font-semibold font-secondary"
          >
            New Agents
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-[2.5em] gap-4 py-8">
          {renderForm()}
        </div>
        <ProceedButton
          type="submit"
          loading={loading}
          variant={isFormFilled ? "gradient" : "gray"}
          disabled={!isFormFilled}
        />
      </form>
    </Modal>
  );
};

export default CreateNewAgents;
