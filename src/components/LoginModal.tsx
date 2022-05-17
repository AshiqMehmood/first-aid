import LoginComponent from "./LoginComponent";

interface ContainerProps {
  exitModal: () => void;
}

const LoginModal: React.FC<ContainerProps> = ({ exitModal }) => {
  return <LoginComponent isLandingPage={false} exitModal={exitModal} />;
};

export default LoginModal;
