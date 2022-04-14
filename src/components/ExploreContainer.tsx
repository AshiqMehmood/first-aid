import { useState, lazy, Suspense } from "react";
import { useHistory } from "react-router-dom";
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
  IonBadge,
  IonModal,
  IonAlert,
  IonSpinner,
} from "@ionic/react";
import {
  informationCircleOutline,
  closeOutline,
  notificationsSharp,
  personCircleOutline,
} from "ionicons/icons";
import firebaseModules from "../firebaseService";
import useStore from "../store";
import { App } from "@capacitor/app";
import Home from "./Home";
import Activity from "./Activity";
import Map from "./Map";
import Settings from "./Settings";
import LoginModal from "./LoginModal";
import ToastComponent from "./ToastComponent";
import "./ExploreContainer.css";

const { db } = firebaseModules;

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const { setLogin, isLoginModalOpen, setLoginModalOpen } = useStore();
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const tabToRender = (name: string) => {
    switch (name) {
      case "Home":
        return <Home />;
      case "Activity":
        return <Activity />;
      case "Map":
        return <Map />;
      case "Settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton
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

          <IonButtons slot="end">
            <IonItem
              lines="none"
              color="primary"
              slot="end"
              onClick={() => alert("notification panel")}
            >
              <IonIcon size="small" icon={notificationsSharp} />
              <IonBadge color="danger">7</IonBadge>
            </IonItem>
            <IonButton
              onClick={async () => {
                await setShowPopover(true);
              }}
            >
              <IonIcon slot="icon-only" icon={personCircleOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <ToastComponent
          onDismiss={() => setShowToast(false)}
          showToast={showToast}
          message="Signed out !"
          infoIcon={informationCircleOutline}
        />
        <IonAlert
          isOpen={showPopover}
          onDidDismiss={() => setShowPopover(false)}
          cssClass="my-custom-class"
          header={"Sign out ?"}
          message={"You need to sign in to continue using the app"}
          buttons={[
            {
              text: "Not yet",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: () => {
                console.log("dismissed !");
              },
            },
            {
              text: "Yes",
              id: "confirm-button",
              cssClass: "confirm-button",
              handler: () => {
                localStorage.removeItem("app-username");
                setShowToast(true);
                setLogin(false);
                setLoginModalOpen(true);
              },
            },
          ]}
        />
        <IonModal
          isOpen={isLoginModalOpen}
          //onDidDismiss={() => setLoginModalOpen(false)}
          //swipeToClose={true}
          //presentingElement={router || undefined}
        >
          <LoginModal exitModal={closeLoginModal} />
        </IonModal>

        {tabToRender(name)}
      </IonContent>
    </IonPage>
  );
};

export default ExploreContainer;
