import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonPage,
  IonContent,
  IonInput,
  IonLabel,
  IonItem,
  useIonRouter,
  IonButtons,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import useStore from "../store";
import { App } from "@capacitor/app";
import { closeOutline } from "ionicons/icons";

const LandingPage: React.FC = () => {
  const history = useHistory();
  const [textValue, setValue] = useState("");
  const {
    username,
    setUsername,
    setLogin,
    setLoginModalOpen,
    isLoginModalOpen,
  } = useStore();
  const ionRouter = useIonRouter();
  document.addEventListener("ionBackButton", (ev) => {
    //@ts-ignore
    ev.detail.register(-1, () => {
      if (!ionRouter.canGoBack()) {
        App.exitApp();
      }
    });
  });

  const redirectToHomePage = () => {
    setUsername(textValue);
    localStorage.setItem("app-username", textValue.toLowerCase()); //store username to localstorage
    if (localStorage.getItem("app-username")) {
      setLogin(true);
      let path = "/page/Home";
      if (!isLoginModalOpen) {
        history.push(path);
      }
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton
              slot="start"
              onClick={async () => {
                try {
                  await App.exitApp();
                } catch (err) {
                  console.log("Cannot close in web mode", err);
                }
              }}
            >
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>First AID</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
          onClick={redirectToHomePage}
        >
          Sign In
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
