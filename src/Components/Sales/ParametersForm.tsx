import { useState } from "react";
import { Input, SelectInput } from "../InputComponent/Input";
import { z } from "zod";
import { SaleStore } from "@/stores/SaleStore";

const formSchema = z.object({
  paymentMode: z.enum(["INSTALLMENT", "ONE_OFF"], {
    required_error: "Payment mode is required",
  }),
  installmentDuration: z.number().nullable(),
  installmentStartingPrice: z.number().nullable(),
  discount: z.number().nullable(),
});

type FormData = z.infer<typeof formSchema>;

const defaultFormData: FormData = {
  paymentMode: "ONE_OFF",
  installmentDuration: "" as unknown as number,
  installmentStartingPrice: "" as unknown as number,
  discount: "" as unknown as number,
};

const ParametersForm = ({
  handleClose,
  currentProductId,
}: {
  handleClose: () => void;
  currentProductId: string;
}) => {
  const [formData, setFormData] = useState<FormData>(
    SaleStore.getParametersByProductId(currentProductId) || defaultFormData
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

  const isFormFilled =
    formData.paymentMode === "ONE_OFF"
      ? Boolean(formData.paymentMode)
      : Boolean(
          formData.paymentMode &&
            formData.installmentDuration &&
            formData.installmentStartingPrice
        );
  const getFieldError = (fieldName: string) => {
    return formErrors.find((error) => error.path[0] === fieldName)?.message;
  };

  const validateItems = () => {
    const result = formSchema.safeParse({
      ...formData,
      installmentDuration:
        Number.parseFloat(formData.installmentDuration?.toString() || "") || 0,
      installmentStartingPrice:
        Number.parseFloat(
          formData.installmentStartingPrice?.toString() || ""
        ) || 0,
      discount: Number.parseFloat(formData.discount?.toString() || "") || 0,
    });
    if (!result.success) {
      setFormErrors(result.error.issues);
      return false;
    }
    setFormErrors([]);
    return true;
  };

  const saveForm = () => {
    if (!validateItems()) return;
    SaleStore.addParameters({
      ...formData,
      currentProductId: currentProductId,
      installmentDuration: Number(formData.installmentDuration),
      installmentStartingPrice: Number(formData.installmentStartingPrice),
      discount: Number(formData.discount),
    });
    SaleStore.addSaleItem(currentProductId);
    handleClose();
  };

  return (
    <div className="flex flex-col justify-between w-full h-full min-h-[360px]">
      <div className="flex flex-col gap-3">
        <SelectInput
          label="Payment Mode"
          options={[
            { label: "Single Deposit", value: "ONE_OFF" },
            { label: "Installment", value: "INSTALLMENT" },
          ]}
          value={formData.paymentMode}
          onChange={(selectedValue) =>
            handleSelectChange("paymentMode", selectedValue)
          }
          placeholder="Select Payment Mode"
          required={true}
          errorMessage={getFieldError("paymentMode")}
        />
        {formData.paymentMode === "INSTALLMENT" ? (
          <Input
            type="number"
            name="installmentDuration"
            label="NUMBER OF INSTALLMENTS"
            value={formData.installmentDuration as number}
            onChange={handleInputChange}
            placeholder="Number of Installments"
            required={true}
            errorMessage={getFieldError("installmentDuration")}
            description={
              formData.installmentDuration === 0
                ? "Enter Number of Installments"
                : ""
            }
          />
        ) : null}
        {formData.paymentMode === "INSTALLMENT" ? (
          <Input
            type="number"
            name="installmentStartingPrice"
            label="INITIAL PAYMENT AMOUNT"
            value={formData.installmentStartingPrice as number}
            onChange={handleInputChange}
            placeholder="Initial Payment Amount"
            required={true}
            errorMessage={getFieldError("installmentStartingPrice")}
            description={
              formData.installmentStartingPrice === 0
                ? "Enter Initial Payment Amount"
                : ""
            }
          />
        ) : null}
        <Input
          type="number"
          name="discount"
          label="DISCOUNT"
          value={formData.discount as number}
          onChange={handleInputChange}
          placeholder="Discount"
          required={false}
          errorMessage={getFieldError("discount")}
          description={formData.discount === 0 ? "Enter Discount Value" : ""}
        />
      </div>
      <div className="flex items-center justify-between gap-1">
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

export default ParametersForm;
