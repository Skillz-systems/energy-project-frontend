import React, { useState } from "react";
import { z } from "zod";
import lightCheckeredBg from "../../assets/lightCheckeredBg.png";
import { Input } from "../InputComponent/Input";
import sampleButton from "../../assets/settings/samplebutton.svg";
import { useApiCall } from "../../utils/useApiCall";

const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Old password must be at least 6 characters long" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "New password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "New password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "New password must contain at least one number",
      }),
    confirmPassword: z.string().min(8, {
      message: "Confirmation password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation password must match",
    path: ["confirmPassword"],
  });

const ChangePassword = () => {
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate form data using Zod schema
      changePasswordSchema.parse(formData);

      // Use apiCall to handle the password change
      await apiCall({
        endpoint: "/change-password", // Specify your API endpoint
        method: "post",
        data: {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        successMessage: "Password changed successfully!",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Collect validation errors
        const validationErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
      }
    }
  };

  return (
    <form
      className="relative flex flex-col justify-end bg-white p-4 w-full max-w-[700px] min-h-[414px] border-[0.6px] border-strokeGreyThree rounded-[20px]"
      onSubmit={handleSubmit}
    >
      <img
        src={lightCheckeredBg}
        alt="Light Checkered Background"
        className="absolute top-0 left-0 w-full"
      />
      <div className="z-10 flex flex-col gap-4 mt-[160px]">
        <p className="flex items-center justify-center bg-paleLightBlue w-max h-[24px] text-textDarkGrey text-xs px-2 py-1 rounded-full">
          Click any field below to make changes
        </p>
        <Input
          type="password"
          name="oldPassword"
          label="Old Password"
          value={formData.oldPassword}
          onChange={handleChange}
          required={true}
          placeholder="OLD PASSWORD"
          style="max-w-none"
          errorMessage={errors.oldPassword}
        />
        <Input
          type="password"
          name="newPassword"
          label="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required={true}
          placeholder="ENTER NEW PASSWORD"
          style="max-w-none"
          errorMessage={errors.newPassword}
        />
        <Input
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required={true}
          placeholder="CONFIRM NEW PASSWORD"
          style="max-w-none"
          errorMessage={errors.confirmPassword}
        />
        <div className="flex items-center justify-center w-full pt-10 pb-5">
          <button type="submit" className="cursor-pointer">
            <img src={sampleButton} alt="Submit" width="54px" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
