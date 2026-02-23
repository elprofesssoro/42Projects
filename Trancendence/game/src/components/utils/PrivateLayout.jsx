import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import { useAuth } from "./AuthContext";
import PrivacyPolicy from "../PrivacyPolicy/PrivacyPolicy";

const PrivateLayout = () => {

  
  const { user } = useAuth();

  return (
    <>
      <Outlet />
      <PrivacyPolicy/>
      <Footer profileId={user?.id} />
    </>
  );
};

export default PrivateLayout;
