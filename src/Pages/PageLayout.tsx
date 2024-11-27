import React from "react";
import TopNavComponent from "../Components/TopNavComponent/TopNavComponent";
import HeaderBadge from "../Components/HeaderBadgeComponent/HeaderBadge";

interface LayoutProps {
  pageName: string;
  badge: string;
  children: React.ReactNode;
}
const PageLayout: React.FC<LayoutProps> = ({ pageName, badge, children }) => {
  return (
    <main className="relative flex flex-col items-center w-full pt-[67px] min-h-screen overflow-y-auto">
      <div className="flex flex-col items-center justify-center w-full max-w-[1440px]">
        <TopNavComponent />
        <HeaderBadge pageName={pageName} image={badge} />
        {children}
      </div>
    </main>
  );
};

export default PageLayout;
