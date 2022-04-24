import { useEffect, useState, useCallback } from "react";
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
  collection,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  informationCircleOutline,
  closeOutline,
  notificationsSharp,
  personCircleOutline,
} from "ionicons/icons";

import useStore from "../store";
import { App } from "@capacitor/app";
import Home from "./Home";
import Activity from "./Activity";
import Map from "./Map";
import Settings from "./Settings";
import LoginModal from "./LoginModal";
import ToastComponent from "./ToastComponent";
import "./ExploreContainer.css";
import firebaseModules from "../firebaseService";

interface ContainerProps {
  name: string;
}
const { db } = firebaseModules;

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const {
    setLogin,
    isLoginModalOpen,
    setLoginModalOpen,
    setShowCountdown,
    deviceId,
    isDeviceConnected,
  } = useStore();
  const [showPopover, setShowPopover] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSensorAlert, setSensorAlert] = useState(false);
  const [triggerId, setTriggerId] = useState("");

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
  const memoizedSensorTrigger = useCallback(() => {
    if (isDeviceConnected) {
      console.log(">>>sensor tracker running now .....!", deviceId);
      const q = query(collection(db, "devices", deviceId, "triggers"));
      let listOfSensorReading: Array<any> = [];
      const sensorTracker = onSnapshot(q, (snapshot) => {
        snapshot.forEach((docs) => {
          if (docs.exists()) {
            if (
              listOfSensorReading.length === 0 &&
              docs.data().shouldAlert === "pending"
            ) {
              listOfSensorReading.push(docs.data());
              setTriggerId(docs.id);
              console.log("alertnow !!!");
              setSensorAlert(true);
              setTimeout(() => {
                console.log(">>> sending SOS automatically..", docs.id);
                sendSOSconfirmation(docs.id);
                setSensorAlert(false);
                setShowCountdown(true);
              }, 5000 * 2);
            }
          }
        });
      });

      return sensorTracker;
    }
  }, [isDeviceConnected]);

  useEffect(() => {
    const unsubscribe = memoizedSensorTrigger();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [memoizedSensorTrigger]);

  const sendSOSconfirmation = async (triggerId: string) => {
    await updateDoc(doc(db, "devices", deviceId, "triggers", triggerId), {
      shouldAlert: "yes",
    });
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
              handler: async () => {
                localStorage.removeItem("app-username");
                localStorage.removeItem("app-token");
                localStorage.removeItem("app-activities");
                await setShowToast(true);
                await setLogin(false);
                await setLoginModalOpen(true);
              },
            },
          ]}
        />
        <IonAlert
          isOpen={showSensorAlert}
          onDidDismiss={() => setSensorAlert(false)}
          cssClass="my-custom-class"
          header={"Fall Detected !!"}
          message={`SOS will be automatically sent in few seconds. Please abort if not required`}
          buttons={[
            {
              text: "Abort",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: () => {
                console.log("dismissed !");
              },
            },
            {
              text: "Send Alert",
              id: "confirm-button",
              cssClass: "confirm-button",
              handler: async () => {
                console.log(">>proceed to confirm : ", triggerId);
                sendSOSconfirmation(triggerId);
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
