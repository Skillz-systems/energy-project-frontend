import React, { useState } from "react";
import { z } from "zod";
import { useApiCall } from "@/utils/useApiCall";
import { Input, SelectInput } from "../InputComponent/Input";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { Modal } from "../ModalComponent/Modal";
import { KeyedMutator } from "swr";

const formSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  firstname: z.string().trim().min(1, "First name is required"),
  lastname: z.string().trim().min(1, "Last name is required"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .transform((val) => val.replace(/\s+/g, "")),
  role: z.string().trim().min(1, "Role is required"),
  location: z.string().trim().min(1, "Location is required"),
});

const defaultFormData = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  phone: "",
  role: "",
  location: "",
};

type FormData = z.infer<typeof formSchema>;

const CreateNewUserModal = ({
  isOpen,
  setIsOpen,
  rolesList,
  allUsersRefresh,
  allRolesError,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rolesList: { label: string; value: string }[];
  allUsersRefresh: KeyedMutator<any>;
  allRolesError: any;
}) => {
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the error for this field when the user starts typing
    setFormErrors((prev) => prev.filter((error) => error.path[0] !== name));
    setApiError(null);
  };

  const handleSelectChange = (name: string, values: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
    // Clear the error for this field when the user selects a value
    setFormErrors((prev) => prev.filter((error) => error.path[0] !== name));
    setApiError(null);
  };

  const resetForm = () => {
    setLoading(false);
    setFormData(defaultFormData);
    setFormErrors([]);
    setApiError(null);
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const validatedData = formSchema.parse(formData);
      await apiCall({
        endpoint: "/v1/auth/add-user",
        method: "post",
        data: validatedData,
        successMessage: "User created successfully!",
      });
      await allUsersRefresh();
      resetForm();
    } catch (error: any) {
      setLoading(false);
      if (error instanceof z.ZodError) {
        setFormErrors(error.issues);
      } else {
        const message =
          error?.response?.data?.message || "Internal Server Error";
        setApiError(`User creation failed: ${message}.`);
      }
    }
  };

  const isFormFilled = formSchema.safeParse(formData).success;

  const getFieldError = (fieldName: string) => {
    return formErrors.find((error) => error.path[0] === fieldName)?.message;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      layout="right"
      bodyStyle="pb-44"
    >
      <form className="flex flex-col items-center bg-white">
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
            New User
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center w-full px-4 gap-4 py-8">
          <Input
            type="text"
            name="firstname"
            label="FIRST NAME"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            required={true}
            errorMessage={getFieldError("firstname")}
          />
          <Input
            type="text"
            name="lastname"
            label="LAST NAME"
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            required={true}
            errorMessage={getFieldError("lastname")}
          />
          <Input
            type="email"
            name="email"
            label="EMAIL"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required={true}
            errorMessage={getFieldError("email")}
          />
          <Input
            type="text"
            name="phone"
            label="PHONE NUMBER"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required={true}
            errorMessage={getFieldError("phone")}
          />
          <SelectInput
            label="Role"
            options={rolesList || []}
            value={formData.role}
            onChange={(selectedValue) =>
              handleSelectChange("role", selectedValue)
            }
            required={true}
            placeholder="Select a role"
            errorMessage={
              allRolesError
                ? "Failed to fetch user roles."
                : getFieldError("role")
            }
          />
          <Input
            type="text"
            name="location"
            label="LOCATION"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            required={true}
            errorMessage={getFieldError("location")}
          />
          {apiError && (
            <div className="text-errorTwo text-sm mt-2 text-center font-medium w-full">
              {apiError}
            </div>
          )}
          <ProceedButton
            type="submit"
            variant={isFormFilled ? "gradient" : "gray"}
            loading={loading}
            disabled={!isFormFilled}
            onClick={handleSubmit}
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateNewUserModal;
