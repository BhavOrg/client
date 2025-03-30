import { Outlet } from "react-router";
import Header from "../components/common/Header/Header";
import MissionSection from "../components/common/MissionSection/MissionSection";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <MissionSection />
      </main>
      <footer>{/* Footer content  */}</footer>
    </>
  );
};

export default MainLayout;
