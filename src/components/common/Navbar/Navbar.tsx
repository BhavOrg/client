import React from "react";
import { Link } from "react-router";

// import bhav_logo from "../../../assets/icons/bhav_logo.svg";

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
  return (
    <nav>
      <div>
        <div>
          {/* <Link to="/">
            <img src={bhav_logo} alt="Bhaav logo" />
          </Link> */}
          Navbar
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
