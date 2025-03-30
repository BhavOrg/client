import { Outlet } from "react-router";
import Header from "../components/common/Header/Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* It will renders child components based on the route */}
      </main>
    </>
  );
};

export default MainLayout;
