import React, { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { SideMenu } from "@/Components/SideMenuComponent/SideMenu";
import { TitlePill } from "@/Components/TitlePillComponent/TitlePill";
import ActionButton from "@/Components/ActionButtonComponent/ActionButton";
import circleAction from "../assets/settings/addCircle.svg";
import { DropDown } from "@/Components/DropDownComponent/DropDown";
import ProceedButton from "@/Components/ProceedButtonComponent/ProceedButtonComponent";
import { Modal } from "@/Components/LogoComponent/ModalComponent/Modal";
import { Input } from "@/Components/InputComponent/Input";
import LoadingSpinner from "@/Components/Loaders/LoadingSpinner";
import PageLayout from "./PageLayout";
import cancelled from "../assets/cancelled.svg";
import productgreen from "../assets/products/productgreen.svg";
import { generateAgentEntries } from "@/Components/TableComponent/sampleData";
import CardComponent from "@/Components/CardComponents/CardComponent";

const AgentPage = () => {

    const [selectedAgent, setSelectedAgent] = useState<any>(null);
    const [agentData, setAgentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [formState, setFormState] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
        territory: "",
        role: "",
    });
    const [isFormFilled, setIsFormFilled] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleQuantityChange = (agentId: string, newQuantity: number) => {
        console.log(`Agent ${agentId} quantity updated to ${newQuantity}`);
        setAgentData((prevData) =>
            prevData.map((agent) =>
                agent.id === agentId ? { ...agent, quantity: newQuantity } : agent
            )
        );
    };

    const refreshAgentData = async () => {
        setIsLoading(true);
        try {
            const data = generateAgentEntries(50); // Replace with actual data fetching logic
            setAgentData(data);
        } catch (error) {
            console.error("Failed to refresh agent data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshAgentData();
    }, []);

    useEffect(() => {
        const filled = Object.values(formState).every((value) => value.trim() !== "");
        setIsFormFilled(filled);
    }, [formState]);

    const navigationList = [
        { title: "All Agents", link: "/agents", count: "2,500" },
        { title: "Active Agents", link: "/active-agents", count: 300 },
        { title: "Inactive Agents", link: "/inactive-agents", count: 50 },
        { title: "New Agents", link: "/new-agents", count: 20 },
    ];

    const dropDownList = {
        items: ["Add new agent", "Export List"],
        onClickLink: (index: number) => {
            switch (index) {
                case 0:
                    setIsOpen(true);
                    break;
                case 1:
                    console.log("Export List clicked");
                    break;
                default:
                    break;
            }
        },
        showCustomButton: true,
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            console.log("Form Submitted:", formState);
            setLoading(false);
            setIsOpen(false);
        }, 2000);
    };

    return (
        <PageLayout pageName="Agents" badge={productgreen}>
            <div className="flex w-full flex-col px-2 md:px-8 py-4 gap-2">
                <div className="flex justify-between items-center mb-4 bg-paleGrayGradient min-h-[64px] w-full px-2">
                    <div className="flex gap-4 items-center">
                        {navigationList.map((item, index) => (
                            <TitlePill
                                key={index}
                                icon={cancelled}
                                iconBgColor="bg-[#FDEEC2]"
                                topText={item.title}
                                bottomText="AGENTS"
                                value={item.count}
                                parentClass="w-full max-w-none sm:max-w-[250px]"
                            />
                        ))}
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:w-max sm:justify-start">
                        <ActionButton
                            label="New Agent"
                            icon={<img src={circleAction} alt="action icon" />}
                            onClick={() => setIsOpen(true)}
                        />
                        <DropDown {...dropDownList} />
                    </div>
                </div>
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
                            className={`flex items-center justify-center px-4 w-full min-h-[64px] border-b-[0.6px] border-strokeGreyThree ${isFormFilled ? "bg-paleCreamGradientLeft" : "bg-paleGrayGradientLeft"
                                }`}
                        >
                            <h2 className="text-xl text-textBlack font-semibold font-secondary">
                                New Agent
                            </h2>
                        </div>
                        {isLoading ? (
                            <LoadingSpinner parentClass="absolute top-[50%] w-full" />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full px-4 gap-4 py-8">
                                {Object.keys(formState).map((key, index) => (
                                    <Input
                                        key={index}
                                        type="text"
                                        name={key}
                                        label={key.toUpperCase()}
                                        value={formState[key]}
                                        onChange={handleInputChange}
                                        placeholder={key}
                                        required
                                    />
                                ))}
                            </div>
                        )}
                        <ProceedButton
                            type="submit"
                            loading={loading}
                            variant={isFormFilled ? "gradient" : "gray"}
                        />
                    </form>
                </Modal>
                <div className="flex flex-row w-full gap-4">
                    <div className="flex-shrink-0">
                        <SideMenu navigationList={navigationList} />
                    </div>
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agentData.map((agent, index) => (
                            <CardComponent
                                key={index}

                                {...agent}
                                handleCallClick={() => console.log(`Call ${agent.name}`)}
                                handleWhatsAppClick={() =>
                                    console.log(`WhatsApp ${agent.name}`)
                                }
                                onValueChange={(newQuantity) =>
                                    handleQuantityChange(agent.id, newQuantity)
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default AgentPage;
