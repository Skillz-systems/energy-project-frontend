import { useState, useEffect } from "react";
import { Table } from "../TableComponent/Table";
import { CardComponent } from "../CardComponents/CardComponent";
import AgentsModal from "./AgentsModal";
import { useApiCall } from "../../utils/useApiCall";

interface AgentUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  location: string;
  addressType: string;
  status: string;
  emailVerified: boolean;
  agentId: number;
}

interface Agent {
  id: string;
  agentId: number;
  createdAt: string;
  updatedAt: string;
  user: AgentUser;
}

interface AgentEntries {
  datetime: string;
  agentId: string;
  name: string;
  status: string; 
  onGoingSales: number;
  inventoryInPossession: number;
  sales: number;
  registeredCustomers: number;
}



const AgentsTable = ({
  agentData,
}: {
  agentData: any;
 
}) => {
  // const [agentData, setAgentData] = useState<AgentEntries[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAgentDetailsModalOpen, setIsAgentDetailsModalOpen] = useState<boolean>(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    lastPage: 1
  });
  const { apiCall } = useApiCall();

  const fetchAgents = async (page = 1, limit = 10, status = '') => {
    try {
      setIsLoading(true);
      const response = await apiCall({
        endpoint: `/v1/agents?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
        method: 'get'
      });

      const transformedAgents: AgentEntries[] = response.data.map((agent: Agent) => ({
        datetime: agent.createdAt,
        name: `${agent.user.firstname} ${agent.user.lastname}`,
        status: agent.user.status,
        onGoingSales: 0, 
        inventoryInPossession: 0,
        sales: 0,
        registeredCustomers: 0
      }));

      agentData(transformedAgents);
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        lastPage: response.meta.lastPage
      });
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      agentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filterList = [
    {
      name: "All Agents",
      items: ["All Agents", "Active Agents", "Reported Agents", "Barred Agents"],
      onClickLink: (index: number) => {
        const statusMap = ['', 'active', 'reported', 'barred'];
        fetchAgents(1, 10, statusMap[index]);
      },
    },
    {
      name: "Search",
      onSearch: (query: string) => {
        console.log("Query:", query);  
      },
      isSearch: true,
    },
    {
      onDateClick: (date: string) => {
        console.log("Date:", date);
      },
      isDate: true,
    },
  ];

  const handleViewAgentProfile = (agentId: string) => {
    setSelectedAgentId(agentId);
    setIsAgentDetailsModalOpen(true);
  };

  const dropDownList = {
    items: ["View Agent profile", "Barr Agent"],
    onClickLink: (index: number, agentId: string) => {
      switch (index) {
        case 0:
          handleViewAgentProfile(agentId);
          break;
        case 1:
          console.log("Agent Barred");
          break;
        default:
          break;
      }
    },
    defaultStyle: true,
    showCustomButton: true,
  };

  return (
    <>
      <Table
        tableType="card"
        tableTitle="ALL AGENTS"
        tableClassname="flex flex-wrap items-center gap-4"
        tableData={agentData}
        loading={isLoading}
        filterList={filterList}
        cardComponent={(data) => {
          return data?.map((item: AgentEntries, index) => (
            <CardComponent
              key={index}
              variant="agent"
              name={item.name}
              status={item.status}
              onGoingSales={item.onGoingSales}
              inventoryInPossession={item.inventoryInPossession}
              sales={item.sales}
              registeredCustomers={item.registeredCustomers}
              dropDownList={{ ...dropDownList, onClickLink: (index) => dropDownList.onClickLink(index, item.agentId) }}
            />
          ));
        }}
        // pagination={{
        //   page: pagination.page,
        //   limit: pagination.limit,
        //   total: pagination.total,
        //   lastPage: pagination.lastPage,
        //   onPageChange: (page) => fetchAgents(page)
        // }}
      />
      {isAgentDetailsModalOpen && selectedAgentId && (
        <AgentsModal
          isOpen={isAgentDetailsModalOpen}
          setIsOpen={setIsAgentDetailsModalOpen}
          agentId={selectedAgentId}
        />
      )}
    </>
  );
};

export default AgentsTable;