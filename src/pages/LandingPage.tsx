import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseModules from "../firebaseService";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
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

  const routeChange = () => {
    setUsername(textValue);
    let path = "/page/Home";
    if (!isLoginModalOpen) {
      history.push(path);
    }
    setLogin(true);
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
        <IonButton disabled={textValue.length === 0} onClick={routeChange}>
          Sign In
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
