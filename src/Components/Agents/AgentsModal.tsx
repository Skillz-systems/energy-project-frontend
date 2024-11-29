import { useState } from "react";
import { Modal } from "../ModalComponent/Modal";
import { DropDown } from "../DropDownComponent/DropDown";
import TabComponent from "../TabComponent/TabComponent";
import { useGetRequest } from "../../utils/useApiCall";

interface AgentUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  location: string;
  addressType: string;
  status: string;
  emailVerified: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Agent {
  id: string;
  agentId: number;
  createdAt: string;
  updatedAt: string;
  user: AgentUser;
}
const AgentModal = ({
  isOpen,
  setIsOpen,
  agentId,
}) => {
  //const { apiCall } = useApiCall();
  const { data, isLoading, error } = useGetRequest(
    `/v1/agents/${agentId}`,
    false
  );

  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [tabContent, setTabContent] = useState<string>("agentDetails");

  const handleCancelClick = () => {
    setDisplayInput(false);
  };

  const dropDownList = {
    items: ["Edit Agent", "Cancel Agent"],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setDisplayInput(true);
          console.log("Edit Agent");
          break;
        case 1:
          console.log("Cancel Agent");
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  const tabNames = [
    { name: "Agent Details", key: "agentDetails", count: null },
    { name: "Stats", key: "stats", count: null },
    { name: "Transactions", key: "transactions", count: null },
    { name: "Customers", key: "customers", count: 0 },
  ];

  return (
    <Modal
      layout="right"
      size="large"
      bodyStyle="pb-44 overflow-auto"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setTabContent("agentDetails");
      }}
      rightHeaderComponents={
        displayInput ? (
          <p
            className="text-xs text-textDarkGrey font-semibold cursor-pointer over"
            onClick={handleCancelClick}
            title="Cancel editing agent details"
          >
            Cancel Edit
          </p>
        ) : (
          <button
            className="flex items-center justify-center w-[24px] h-[24px] bg-white border border-strokeGreyTwo rounded-full hover:bg-slate-100"
            onClick={() => setDisplayInput(true)}
          >
            {/* <img src={editInput} alt="Edit Button" width="15px" /> */}
          </button>
        )
      }
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Oops, an error occurred: {error}</div>
      ) : (
        <div className="bg-white">
          <header className="flex items-center justify-between bg-paleGrayGradientLeft p-4 min-h-[64px] border-b-[0.6px] border-b-strokeGreyThree">
            <p className="flex items-center justify-center bg-paleLightBlue w-max p-2 h-[24px] text-textBlack text-xs font-semibold rounded-full">
              {data.agentId} - {data.user.firstname} {data.user.lastname}
            </p>
            <div className="flex items-center justify-end gap-2">
              <DropDown {...dropDownList} />
            </div>
          </header>
          <div className="flex flex-col w-full gap-4 px-4 py-2">
            <TabComponent
              tabs={tabNames.map(({ name, key, count }) => ({
                name,
                key,
                count,
              }))}
              onTabSelect={(key) => setTabContent(key)}
            />
            {tabContent === "agentDetails" && (
              <div>
                <h2>Agent Details</h2>
                <p>Agent ID: {data.agentId}</p>
                <p>Name: {data.user.firstname} {data.user.lastname}</p>
                <p>Email: {data.user.email}</p>
                <p>Location: {data.user.location}</p>
                <p>Address Type: {data.user.addressType}</p>
                <p>Status: {data.user.status}</p>
                <p>Email Verified: {data.user.emailVerified ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AgentModal;