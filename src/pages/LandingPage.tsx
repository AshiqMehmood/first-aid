import React, { useEffect, useState } from "react";
import LoginComponent from "../components/LoginComponent";

const LandingPage: React.FC = () => {
  return <LoginComponent isLandingPage={true} exitModal={() => null} />;
};

export default LandingPage;