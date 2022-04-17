import { useEffect, useState } from "react";
import {
  IonButton,
  IonItem,
  IonContent,
  IonIcon,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
} from "@ionic/react";
import { happyOutline } from "ionicons/icons";
import ToastComponent from "./ToastComponent";
import useStore from "../store";

interface ContainerProps {
  exitModal: () => void;
}

const LoginModal: React.FC<ContainerProps> = ({ exitModal }) => {
  const { isLoggedIn, setUsername, setLogin } = useStore();
  const [textValue, setValue] = useState("");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login to Explore</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ToastComponent
          onDismiss={() => console.log(">> dismissed")}
          showToast={isLoggedIn}
          message="Succesfully signed in!"
          infoIcon={happyOutline}
        />
        <IonItem>
          <IonLabel position="floating">Enter your name</IonLabel>
          <IonInput
            onIonChange={(e) => {
              //@ts-ignore
              setValue(e.detail.value);
            }}
          ></IonInput>
        </IonItem>
        <IonButton
          disabled={textValue.length === 0}
          onClick={() => {
            localStorage.setItem("app-username", textValue.toLowerCase());
            setUsername(textValue);
            if (localStorage.getItem("app-username")) {
              setLogin(true);
            }
            setTimeout(() => {
              exitModal();
            }, 1000);
          }}
        >
          Sign In
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoginModal;
