import TopNavComponent from "../Components/TopNavComponent/TopNavComponent";
import HeaderBadge from "../Components/HeaderBadgeComponent/HeaderBadge";
import dashboardbadge from "../assets/dashboard/dashboardbadge.png";

const Dashboard = () => {
  return (
    <main className="relative flex flex-col items-center w-full pt-[67px] min-h-screen">
      <div className="flex flex-col items-center justify-center w-full max-w-[1440px]">
        <TopNavComponent />
        <HeaderBadge pageName="Dashboard" image={dashboardbadge} />
      </div>
    </main>
  );
};

export default Dashboard;
