import { Outlet } from "react-router";
import Header from "../components/common/Header/Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main></main>
      <footer>{/* Footer content  */}</footer>
    </>
  );
};

export default MainLayout;
