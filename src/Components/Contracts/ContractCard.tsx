import { useState } from "react";
import gradientcontract from "../../assets/contracts/gradientcontract.svg";
import roletwo from "../../assets/table/roletwo.svg";
import { useApiCall }   from "@/utils/useApiCall";

export const ContractCard = ({
    id,
    date,
    fullNameAsOnID,
    contractSigned,
    handleContractClick,
    refreshTable,
  }: {
    id: string;
    date: string;
    fullNameAsOnID: string;
    contractSigned: string | null;
    handleContractClick: () => void;
    refreshTable: () => void;
  }) => {
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