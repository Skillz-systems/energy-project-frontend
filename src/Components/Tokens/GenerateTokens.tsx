import { useApiCall, useGetRequest } from "@/utils/useApiCall";
import React, { useState, useEffect } from "react";
import { KeyedMutator } from "swr";
import { z } from "zod";
import { Modal } from "../ModalComponent/Modal";
import { FileInput, Input, SelectInput } from "../InputComponent/Input";
import ApiErrorMessage from "../ApiErrorMessage";
import ProceedButton from "../ProceedButtonComponent/ProceedButtonComponent";
import { RxFilePlus } from "react-icons/rx";
import jsPDF from "jspdf";

interface GenerateTokensProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    allDevicesRefresh: KeyedMutator<any>;
    formType: "singleUpload" | "batchUpload";
}

const DeviceFormSchema = z.object({
    deviceID: z.string().trim().min(1, "Device selection is required"),
    tokenDuration: z
        .string()
        .trim()
        .min(1, "Token duration is required")
        .refine((val) => /^\d+$/.test(val), {
            message: "Token duration must be a valid number (days)",
        }),
});

const GenerateTokens = ({ isOpen, setIsOpen, allDevicesRefresh, formType }: GenerateTokensProps) => {
    const { apiCall } = useApiCall();
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
    const [apiError, setApiError] = useState<string | Record<string, string[]>>("");
    const [generatedToken, setGeneratedToken] = useState<any>(null);
    const [formData, setFormData] = useState({
        deviceID: "",
        tokenDuration: "",
        devicesFile: null as File | null,
    });

    // Fetch available devices for selection
    const {
        data: devicesData,
        isLoading: devicesLoading,
    } = useGetRequest("/v1/device", isOpen);

    // Convert devices data to options for SelectInput
    const deviceOptions = devicesData?.devices?.map((device: any) => ({
        label: `${device.serialNumber} (${device.hardwareModel})`,
        value: device.id,
    })) || [];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formType === "singleUpload") {
                const result = DeviceFormSchema.safeParse(formData);

                if (!result.success) {
                    setFormErrors(result.error.issues);
                    return;
                }

                const validatedData = result.data;
                
                // Find the selected device to get its key
                const selectedDevice = devicesData?.devices?.find((device: any) => device.id === validatedData.deviceID);
                if (!selectedDevice) {
                    throw new Error("Selected device not found");
                }
                
                // Send deviceId and tokenDuration to match API spec
                const apiData = {
                    deviceId: validatedData.deviceID,
                    tokenDuration: Number(validatedData.tokenDuration)
                };
                
                console.log('Sending API request with:', {
                    endpoint: `/v1/device/${validatedData.deviceID}/generate-token`,
                    data: apiData,
                    selectedDevice: selectedDevice
                });
                
                const response = await apiCall({
                    endpoint: `/v1/device/${validatedData.deviceID}/generate-token`,
                    method: "post",
                    data: apiData,
                    successMessage: "Token generated successfully!",
                });

                // Store the generated token response - extract data from Axios response
                console.log('Token generation response:', response);
                setGeneratedToken(response?.data || response);
                
            } else {
                // For batch upload
                if (!formData.devicesFile) {
                    throw new Error("Device file is required");
                }

                const formDataToSend = new FormData();
                formDataToSend.append("file", formData.devicesFile);

                const response = await apiCall({
                    endpoint: "/v1/device/batch/generate-tokens",
                    method: "post",
                    data: formDataToSend,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    successMessage: "Tokens generated successfully!",
                });

                // Store the batch generation response - extract data from Axios response
                console.log('Batch token generation response:', response);
                setGeneratedToken(response?.data || response);
            }

            await allDevicesRefresh();
            // Don't close modal immediately - let user see the token
            
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                setFormErrors(error.issues);
            } else {
                const message =
                    error?.response?.data?.message ||
                    `Token${formType === "batchUpload" ? "s" : ""} Generation Failed: Internal Server Error`;
                setApiError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    const isFormFilled = formType === "singleUpload" 
        ? formData.deviceID && formData.tokenDuration 
        : !!formData.devicesFile;

    const getFieldError = (name: string) => {
        return formErrors.find((error: z.ZodIssue) => error.path[0] === name)?.message || "";
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setApiError(""); // Clear API errors on change
        
        // Clear field-specific errors
        setFormErrors(prev => prev.filter(error => error.path[0] !== name));
    };

    // Handle SelectInput onChange (receives value directly)
    const handleDeviceSelect = (value: string) => {
        setFormData({ ...formData, deviceID: value });
        setApiError(""); // Clear API errors on change
        
        // Clear field-specific errors
        setFormErrors(prev => prev.filter(error => error.path[0] !== "deviceID"));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData({ ...formData, devicesFile: file });
        setApiError(""); // Clear API errors on change
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setFormData({
            deviceID: "",
            tokenDuration: "",
            devicesFile: null,
        });
        setFormErrors([]);
        setApiError("");
        setGeneratedToken(null); // Clear generated token when closing
    };

    const handleGenerateAnother = () => {
        setFormData({
            deviceID: "",
            tokenDuration: "",
            devicesFile: null,
        });
        setFormErrors([]);
        setApiError("");
        setGeneratedToken(null); // Clear generated token to show form again
    };

    const handleExportToPDF = () => {
        if (!generatedToken) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 30;

        // Title
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Token Generation Report", margin, yPosition);
        
        yPosition += 20;
        
        // Date
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);
        
        yPosition += 20;

        // Token details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Token Details:", margin, yPosition);
        
        yPosition += 15;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        // Token Value
        const tokenValue = generatedToken?.deviceToken || generatedToken?.token || generatedToken?.tokenValue || 'N/A';
        doc.text(`Token: ${tokenValue}`, margin, yPosition);
        yPosition += 10;

        // Duration
        if (generatedToken?.tokenDuration) {
            doc.text(`Duration: ${generatedToken.tokenDuration}`, margin, yPosition);
            yPosition += 10;
        }

        // Device Serial Number
        if (generatedToken?.deviceSerialNumber) {
            doc.text(`Device Serial Number: ${generatedToken.deviceSerialNumber}`, margin, yPosition);
            yPosition += 10;
        }

        // Device ID
        if (generatedToken?.deviceId) {
            doc.text(`Device ID: ${generatedToken.deviceId}`, margin, yPosition);
            yPosition += 10;
        }

        // Token ID
        if (generatedToken?.tokenId) {
            doc.text(`Token ID: ${generatedToken.tokenId}`, margin, yPosition);
            yPosition += 10;
        }

        // Add a border around the token value for emphasis
        yPosition += 10;
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 30);
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Important: Keep this token secure", margin + 5, yPosition + 15);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("This token provides access to your device. Do not share it with unauthorized users.", margin + 5, yPosition + 25);

        // Save the PDF
        const fileName = `token_${generatedToken?.deviceSerialNumber || 'device'}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            layout="right"
            bodyStyle="pb-[100px]"
        >
            <form
                className="flex flex-col items-center bg-white"
                onSubmit={handleSubmit}
                noValidate
            >
                <div
                    className={`flex items-center justify-center px-4 w-full min-h-[64px] border-b-[0.6px] border-strokeGreyThree ${isFormFilled
                            ? "bg-paleCreamGradientLeft"
                            : "bg-paleGrayGradientLeft"
                        }`}
                >
                    <h2
                        style={{ textShadow: "1px 1px grey" }}
                        className="text-xl text-textBlack font-semibold font-secondary"
                    >
                        {formType === "singleUpload"
                            ? "Generate Tokens"
                            : "Generate Tokens (Batch)"}
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-center w-full px-4 gap-4 py-8">
                    {generatedToken ? (
                        // Show generated token response
                        <div className="w-full">
                            <div className="bg-white border border-strokeGreyThree rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-4 h-4 bg-success rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-textBlack font-secondary">
                                        Token Generated Successfully!
                                    </h3>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-textDarkGrey mb-3">
                                            Generated Token:
                                        </label>
                                        <div className="bg-paleGrayGradient border border-strokeGreyTwo rounded-md p-4">
                                            <code className="text-base font-mono text-textBlack break-all font-semibold">
                                                {generatedToken?.deviceToken || generatedToken?.token || generatedToken?.tokenValue || 'Token not found'}
                                            </code>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const tokenText = generatedToken?.deviceToken || generatedToken?.token || generatedToken?.tokenValue || 'Token not found';
                                                navigator.clipboard.writeText(tokenText);
                                            }}
                                            className="mt-3 text-sm text-primary hover:text-primaryDark underline font-medium"
                                        >
                                            Copy to clipboard
                                        </button>
                                    </div>
                                    
                                    {generatedToken?.tokenDuration && (
                                        <div>
                                            <label className="block text-sm font-medium text-textDarkGrey mb-2">
                                                Duration:
                                            </label>
                                            <div className="flex items-center gap-2 bg-paleGrayGradient px-3 py-2 w-max border border-strokeGreyTwo rounded-full">
                                                <p className="text-sm text-textBlack font-medium">
                                                    {generatedToken.tokenDuration}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {generatedToken?.deviceSerialNumber && (
                                        <div>
                                            <label className="block text-sm font-medium text-textDarkGrey mb-2">
                                                Device Serial Number:
                                            </label>
                                            <div className="flex items-center gap-2 bg-paleGrayGradient px-3 py-2 w-max border border-strokeGreyTwo rounded-full">
                                                <p className="text-sm text-textBlack font-mono font-medium">
                                                    {generatedToken.deviceSerialNumber}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {generatedToken?.deviceId && (
                                        <div>
                                            <label className="block text-sm font-medium text-textDarkGrey mb-2">
                                                Device ID:
                                            </label>
                                            <div className="flex items-center gap-2 bg-paleGrayGradient px-3 py-2 w-max border border-strokeGreyTwo rounded-full">
                                                <p className="text-sm text-textBlack font-mono font-medium">
                                                    {generatedToken.deviceId}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {generatedToken?.tokenId && (
                                        <div>
                                            <label className="block text-sm font-medium text-textDarkGrey mb-2">
                                                Token ID:
                                            </label>
                                            <div className="flex items-center gap-2 bg-paleGrayGradient px-3 py-2 w-max border border-strokeGreyTwo rounded-full">
                                                <p className="text-sm text-textBlack font-mono font-medium">
                                                    {generatedToken.tokenId}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-8 justify-center">
                                    <button
                                        type="button"
                                        onClick={handleGenerateAnother}
                                        className="bg-gradient-to-r from-[#982214] to-[#F8CB48] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-medium text-sm"
                                    >
                                        Generate Another
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleExportToPDF}
                                        className="bg-gradient-to-r from-[#982214] to-[#F8CB48] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-medium text-sm"
                                    >
                                        Export to PDF
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="bg-strokeGreyTwo text-textDarkGrey px-4 py-2 rounded-md hover:bg-strokeGreyThree transition-colors font-medium text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Show form when no token generated yet
                        <>
                            {formType === "singleUpload" ? (
                                <>
                                    <SelectInput
                                        label="Select Device"
                                        value={formData.deviceID}
                                        onChange={handleDeviceSelect}
                                        required={true}
                                        errorMessage={getFieldError("deviceID")}
                                        options={deviceOptions}
                                        placeholder={devicesLoading ? "Loading devices..." : "Select a device"}
                                        disabled={devicesLoading}
                                    />

                                    <Input
                                        type="text"
                                        name="tokenDuration"
                                        label="Token Duration (days)"
                                        value={formData.tokenDuration}
                                        onChange={handleInputChange}
                                        placeholder="Enter duration in days (e.g., 30)"
                                        required={true}
                                        errorMessage={getFieldError("tokenDuration")}
                                    />
                                </>
                            ) : (
                                <FileInput
                                    name="devicesFile"
                                    label="Devices File"
                                    onChange={handleFileChange}
                                    required={true}
                                    accept=".csv,.xlsx"
                                    placeholder="Upload Device File"
                                    errorMessage={getFieldError("devicesFile")}
                                    iconRight={<RxFilePlus color="black" title="Upload File" />}
                                    description="Only .csv and .xlsx files are allowed"
                                />
                            )}

                            <ApiErrorMessage apiError={apiError} />

                            <ProceedButton
                                type="submit"
                                loading={loading}
                                variant={isFormFilled ? "gradient" : "gray"}
                                disabled={!isFormFilled}
                            />
                        </>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default GenerateTokens;
