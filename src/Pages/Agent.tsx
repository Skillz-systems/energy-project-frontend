import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PageLayout from "./PageLayout";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import inventorybadge from "../assets/inventory/inventorybadge.png";
import { TitlePill } from "@/Components/TitlePillComponent/TitlePill";
import avatar from "../assets/agents/avatar.svg";
import cancelled from "../assets/cancelled.svg";
import wallet from "../assets/agents/wallet.svg";
import circleAction from "../assets/settings/addCircle.svg";
import ActionButton from "@/Components/ActionButtonComponent/ActionButton";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import { SideMenu } from "@/Components/SideMenuComponent/SideMenu";
import CreateNewAgents, { AgentsFormType,} from "@/Components/Agents/CreateNewAgents";
import { generateAgentEntries, generateRandomProductEntries } from "@/Components/TableComponent/sampleData";

const AgentsTable = lazy(
  () => import("@/Components/Agents/AgentsTable")
);

const Agent = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [agentsData, setAgentsData] = useState<any>(null); // Temporary
  const [productData, setProductData] = useState<any>(null); 
  const [formType, setFormType] = useState<AgentsFormType>("newAgents");
  //   const {
  //     data: productData,
  //     isLoading: productLoading,
  //     mutate: allProductsRefresh,
  //   } = useGetRequest("/v1/products", true, 60000);

  const navigationList = [
    {
      title: "All Agents",
      link: "/agents/all",
      count: 100,
      onclick: () => {},
    },
    {
      title: "Active Agents",
      link: "/agents/active",
      count: 70,
      onclick: () => {},
    },
    {
      title: "Barred Agents",
      link: "/agents/barred",
      count: 20,
      onclick: () => {},
    },
  ];

  useEffect(() => {
    switch (location.pathname) {
      case "/agents/all":
        setAgentsData(
          generateAgentEntries(100, {
            classTags: ["all"]
          })
        );
        break;
      case "/agents/active":
        setAgentsData(
          generateAgentEntries(70, {
            classTags: ["active"]
          })
        );
        break;
      case "/agents/barred":
        setAgentsData(
          generateAgentEntries(20, {
            classTags: ["barred"]
          })
        );
        break;
      default:
        setAgentsData(generateAgentEntries(100, { classTags: ["all"] }));
    }
  }, [location.pathname]);

  const dropDownList = {
    items: [
      "Add Existing Agent",
      "Export List",
    ],
    onClickLink: (index: number) => {
      switch (index) {
        case 0:
          setFormType("newAgents");
          setIsOpen(true);
          break;
        case 1:
          setFormType("existingAgents");
          setIsOpen(true);
          break;
        case 4:
          console.log("Exporting list...");
          break;
        default:
          break;
      }
    },
    showCustomButton: true,
  };

  const agentsPaths = ["all", "active", "barred"];

  return (
    <>
      <PageLayout pageName="Agents" badge={inventorybadge}>
        <section className="flex flex-col-reverse sm:flex-row items-center justify-between w-full bg-paleGrayGradient px-2 md:px-8 py-4 gap-2 min-h-[64px]">
          <div className="flex flex-wrap w-full items-center gap-2 gap-y-3">
            <TitlePill
              icon={wallet}
              iconBgColor="bg-[#E3FAD6]"
              topText="Revenue From"
              bottomText="Agents"
              value={12558668.00}
            />
            <TitlePill
              icon={avatar}
              iconBgColor="bg-[#FDEEC2]"
              topText="Total"
              bottomText="Agents"
              value={2552}
            />
             <TitlePill
              icon={avatar}
              iconBgColor="bg-[#FDEEC2]"
              topText="Sales Done by"
              bottomText="Agents"
              value={5808}
            />
            <TitlePill
              icon={cancelled}
              iconBgColor="bg-[#FFDBDE]"
              topText="Barred"
              bottomText="Agents"
              value={58}
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-max sm:w-max sm:justify-end">
            <ActionButton
              label="New Agents"
              icon={<img src={circleAction} />}
              onClick={() => setIsOpen(true)}
            />
            <DropDown {...dropDownList} />
          </div>
        </section>
        <div className="flex flex-col w-full px-2 py-8 gap-4 lg:flex-row md:p-8">
          <SideMenu navigationList={navigationList} />
          <section className="relative items-start justify-center flex min-h-[415px] w-full overflow-hidden">
            <Suspense
              fallback={
                <LoadingSpinner parentClass="absolute top-[50%] w-full" />
              }
            >
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/agents/all" replace />}
                />
                {agentsPaths.map((path) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <AgentsTable
                        agentData={agentsData}
                        isLoading={!agentsData?.length}
                      />
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </section>
        </div>
      </PageLayout>
      {isOpen ? (
        <CreateNewAgents
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          formType={formType}
        />
      ) : null}
    </>
  );
};

export default Agent;
