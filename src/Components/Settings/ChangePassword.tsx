import React, { useState } from "react";
import { z } from "zod";
import lightCheckeredBg from "../../assets/lightCheckeredBg.png";
import eyeclosed from "../../assets/eyeclosed.svg";
import eyeopen from "../../assets/eyeopen.svg";
import { Input } from "../InputComponent/Input";
import { useApiCall } from "../../utils/useApiCall";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import useTokens from "../../hooks/useTokens";

const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
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
  const { token, id } = useTokens();
  const { apiCall } = useApiCall();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    setLoading(true);
    try {
      // Validate form data using Zod schema
      changePasswordSchema.parse(formData);

      // Use apiCall to handle the password change
      await apiCall({
        endpoint: `/v1/auth/create-user-password/${id}/${token}`,
        method: "post",
        data: {
          password: formData.newPassword,
          confirmPassword: formData.confirmPassword,
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
        setErrors(validationErrors);
      }
    }
    setLoading(false);
  };

  const isFormFilled =
    formData.oldPassword || formData.newPassword || formData.confirmPassword;

  return (
    <form
      className="relative flex flex-col justify-end bg-white p-4 w-full lg:max-w-[700px] min-h-[414px] border-[0.6px] border-strokeGreyThree rounded-[20px]"
      onSubmit={handleSubmit}
    >
      <img
        src={lightCheckeredBg}
        alt="Light Checkered Background"
        className="absolute top-0 left-0 w-full"
      />
      <div className="z-10 flex flex-col gap-4 mt-[80px]">
        <p className="flex items-center justify-center bg-paleLightBlue w-max h-[24px] text-textDarkGrey text-xs px-2 py-1 rounded-full">
          Click any field below to make changes
        </p>
        <Input
          type={showPassword ? "text" : "password"}
          name="oldPassword"
          label="Old Password"
          value={formData.oldPassword}
          onChange={handleChange}
          required={true}
          placeholder="OLD PASSWORD"
          style={`${
            isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
          } max-w-none`}
          errorMessage={errors.oldPassword || ""}
          iconRight={
            <img
              src={showPassword ? eyeopen : eyeclosed}
              className="w-[16px] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
        <Input
          type={showPassword ? "text" : "password"}
          name="newPassword"
          label="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required={true}
          placeholder="ENTER NEW PASSWORD"
          style={`${
            isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
          } max-w-none`}
          errorMessage={errors.newPassword || ""}
          iconRight={
            <img
              src={showPassword ? eyeopen : eyeclosed}
              className="w-[16px] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
        <Input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required={true}
          placeholder="CONFIRM NEW PASSWORD"
          style={`${
            isFormFilled ? "border-[#D3C6A1]" : "border-strokeGrey"
          } max-w-none`}
          errorMessage={errors.confirmPassword || ""}
          iconRight={
            <img
              src={showPassword ? eyeopen : eyeclosed}
              className="w-[16px] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
        <div className="flex items-center justify-center w-full pt-10 pb-5">
          <ProceedButton
            type="submit"
            loading={loading}
            variant={isFormFilled ? "gradient" : "gray"}
          />
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
