import { useState } from "react";
import gradientcontract from "../../assets/contracts/gradientcontract.svg";
import roletwo from "../../assets/table/roletwo.svg";
import { useApiCall }   from "@/utils/useApiCall";

interface ContractEntries {
    id: string;
    date: string;
    fullNameAsOnID: string;
    contractSigned: string | null;
    handleContractClick: () => void;
    refreshTable: () => void;
}

export const ContractCard = ({
    id,
    date,
    fullNameAsOnID,
    contractSigned,
    handleContractClick,
    refreshTable,
}: ContractEntries) => {
    const [file, setFile] = useState<File | null>(null);
     const { apiCall } = useApiCall();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUploadSignature = async (contractId: string, file: File) => {
        if (!contractId) {
            console.error("Error: Contract ID is missing.");
            return;
        }

        const formData = new FormData();
        formData.append("signature", file);

        try {
            await apiCall({
                endpoint: `/v1/contract/${contractId}/upload-signage`,
                method: "post",
                data: formData,
                successMessage: "Signature uploaded successfully!",
            });
            refreshTable();
        } catch (error) {
            console.error("Error uploading signature:", error);
        }
    };

    return (
        <div
            className={`relative flex flex-col justify-between gap-2 w-[32%] min-w-[204px] min-h-[220px] p-4 bg-white border-[0.6px] border-strokeGreyThree rounded-xl shadow-sm ${
                contractSigned ? "group cursor-pointer transition-all hover:bg-[#F6F8FA]" : ""
            }`}
            onClick={handleContractClick}
            title={contractSigned ? "Open Contract Document" : "No Signed Contract Document"}
        >
            <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#FEF5DA] border-[0.2px] border-strokeGreyTwo">
                    <img src={gradientcontract} alt="Pill Icon" className="w-[16px] h-[16px]" />
                </div>
                <div className="hidden items-center justify-center w-[32px] h-[32px] rounded-full bg-white border-[0.2px] border-strokeGreyTwo group-hover:flex">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clipPath="url(#clip0_4112_52364)">
                            <path
                                d="M17.3523 12.4938C16.9471 12.2101 16.6223 11.3861 16.3982 10.6253C16.1076 9.64544 15.9718 8.62253 16.0352 7.60325C16.0828 6.83902 16.2231 5.97038 16.5887 5.44831M16.5887 5.44831C16.2231 5.97038 15.4544 6.39983 14.753 6.70541C13.8163 7.11326 12.8086 7.33546 11.7896 7.39834C10.9975 7.44755 10.111 7.4234 9.70688 7.14043M16.5887 5.44831L7.41144 18.5547"
                                stroke="#E0E0E0"
                                strokeWidth="1.33333"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_4112_52364">
                                <rect width="16" height="16" fill="white" transform="translate(23.1418 10.0352) rotate(125)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
            <div className="flex flex-col gap-2.5 w-full">
                <div className="flex items-center gap-1 pl-1 pr-2 py-1 w-max bg-[#F6F8FA] border-[0.4px] border-strokeGreyTwo rounded-full">
                    <p className="text-textBlack text-xs">{date}</p>
                </div>
                <div className="flex items-center gap-1 w-max">
                    <img src={roletwo} alt="icon" />
                    <span className="bg-[#EFF2FF] px-2 py-1 text-xs text-textBlack font-semibold rounded-full capitalize">
                        {fullNameAsOnID}
                    </span>
                </div>
                <div className="flex items-center justify-between pl-2 py-1 pr-1 border-[0.6px] border-strokeGreyThree rounded-full">
                    <p className="text-textGrey text-xs">Status</p>
                    {contractSigned ? (
                        <p className="px-2 py-0.5 text-xs font-medium bg-successTwo text-success rounded-full">
                            Signed
                        </p>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                                id="fileInput"
                            />
                            <label
                                htmlFor="fileInput"
                                className="px-2 py-0.5 text-xs font-medium bg-[#FFEBEC] text-errorTwo rounded-full cursor-pointer hover:bg-[#FFDBDE] transition-colors"
                            >
                                Sign Contract
                            </label>
                            {file && (
                                <button
                                    onClick={() => file && handleUploadSignature(id, file)}
                                    className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                >
                                    Upload Signature
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
