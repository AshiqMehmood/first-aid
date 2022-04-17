import {useEffect, useState} from 'react'
import {
  IonButton,
  IonListHeader,
  IonList,
  IonText,
  IonLabel,
  IonItem,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonFabList,
  IonBadge,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import {
  checkmarkDoneCircleSharp,
  locate,
  personAddSharp,
  personCircleSharp,
  shareSocialOutline,
} from "ionicons/icons";
import firebaseModules from "../firebaseService";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { App } from "@capacitor/app";
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications";
import useStore from "../store";
import Contacts from "./Contacts";
import AlertSOSComponent from "./AlertSosComponent";
import NotificationList from "./NotificationList";
import "./Home.css";

const { db } = firebaseModules;

interface ContainerProps {}

const Home: React.FC<ContainerProps> = () => {
  const {
    username,
    registrationTokenId,
    setRegToken,
    showCountdown,
    setShowCountdown,
    speed,
    setSpeed,
  } = useStore();
  const nullEntry: any[] = [];
  const [notifications, setNotifications] = useState(nullEntry);
  const [notifModalOpen, setNotifModal] = useState(false);
  const [contactsModalOpen, setContactsModals] = useState(false);
  const countdown = 10 * 1000;
  const [timer, setTimer] = useState(countdown);
  const [inputText, setText] = useState("");

  const isPushNotificationAvailable =
    Capacitor.isPluginAvailable("PushNotifications");

  useEffect(() => {
    console.info(
      "is PushNotification available ? ",
      isPushNotificationAvailable
    );
    let isMounted = true; //flag
    const isTokenAvailable = localStorage.getItem("app-token");
    if (isPushNotificationAvailable && !isTokenAvailable) {
      // if token is not in memory
      PushNotifications.checkPermissions().then((res) => {
        if (res.receive !== "granted") {
          PushNotifications.requestPermissions().then((res) => {
            if (res.receive === "denied") {
              showToast("Push Notification permission denied");
            } else {
              showToast("Push Notification permission granted");
              registerPush(isMounted);
            }
          });
        } else {
          registerPush(isMounted);
        }
      });
    }

    //cleanup values
    return () => {
      isMounted = false;
    };
  }, [username]);

  const registerPush = async (isMounted: boolean) => {
    const isTokenAvailable = localStorage.getItem("app-token");
    if (isPushNotificationAvailable) {
      await PushNotifications.register();
      await PushNotifications.addListener("registration", (token: Token) => {
        console.info("Registration token generated: ", token.value);
        if (isMounted) {
          setRegToken(token.value);
          localStorage.setItem("app-token", token.value); //store token to local storage
          showToast("Push registration success !");
        }
      });
      if (isTokenAvailable) {
        console.info(">> sending token to firebase..");
        //store regToken in firebase
        const userDetails = doc(db, "users", username);
        await updateDoc(userDetails, {
          tokenId: registrationTokenId,
        });
      }
      await PushNotifications.addListener("registrationError", (err: any) => {
        showToast("Token registration failed !");
      });
    }

    try {
      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notif: PushNotificationSchema) => {
          if (isMounted) {
            setNotifications([
              ...notifications,
              {
                id: notif.id,
                title: notif.title,
                body: notif.body,
                type: "foreground",
              },
            ]);
          }
        }
      );
      await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notif: ActionPerformed) => {
          if (isMounted) {
            setNotifications([
              ...notifications,
              {
                id: notif.notification.data.id,
                title: notif.notification.data.title,
                body: notif.notification.data.body,
                type: "action",
              },
            ]);
          }
        }
      );
    } catch (e) {
      console.error(e);
    }
    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach(d => console.log(`ID: ${d.id} >>>> ${JSON.stringify(d.data())}`))
  };

  const showToast = async (msg: string) => {
    await Toast.show({
      text: msg,
    });
  };

  const closeContactsModal = () => {
    setContactsModals(false);
  };
  const closeNotifModal = () => {
    setNotifModal(false);
  };

  const sendAlert = async () => {
    //to set document with specific ID
    // const newData = await addDoc(
    //   collection(db, "users", "mehmood", "activity"),
    //   {
    //     contact: "niranjana",
    //     place: "trivandrum",
    //     created_at: serverTimestamp(),
    //   }
    // );
    console.log("Pushed to firebase !");
  };

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setContactsModals(true)}>
          <IonIcon icon={personAddSharp}></IonIcon>
        </IonFabButton>
      </IonFab>

      <IonCard className="user-card-wrapper">
        <IonCardHeader>
          <IonCardSubtitle>ID: 1234</IonCardSubtitle>
          <IonCardTitle>Hi, {username.toUpperCase()}</IonCardTitle>
          <div className="user-card-container">
            <div className="user-card-items">
              <IonLabel style={{ fontSize: ".7rem" }}>Device</IonLabel>
              <IonLabel style={{ fontSize: ".9rem", fontWeight: "bold" }}>
                connected
              </IonLabel>
            </div>
            <div className="user-card-items">
              <IonLabel style={{ fontSize: ".7rem" }}>Contacts</IonLabel>
              <IonLabel style={{ fontSize: ".9rem", fontWeight: "bold" }}>
                7
              </IonLabel>
            </div>
            <div className="user-card-items">
              <IonLabel style={{ fontSize: ".7rem" }}>Location</IonLabel>
              <IonLabel style={{ fontSize: ".9rem", fontWeight: "bold" }}>
                trivandrum
              </IonLabel>
            </div>
          </div>
        </IonCardHeader>
      </IonCard>
      <IonModal
        isOpen={contactsModalOpen}
        //onDidDismiss={() => setContactsModals(false)}
        //swipeToClose={true}
        //presentingElement={router || undefined}
      >
        <Contacts exitModal={closeContactsModal} />
      </IonModal>
      <IonModal
        isOpen={notifModalOpen}
        //onDidDismiss={() => setContactsModals(false)}
        //swipeToClose={true}
        //presentingElement={router || undefined}
      >
        <NotificationList
          notifications={notifications}
          exitModal={closeNotifModal}
        />
      </IonModal>

      <AlertSOSComponent alert={sendAlert} />
      <div style={{ marginTop: "2em" }}>
        <IonButton
          disabled={showCountdown}
          expand="block"
          color="danger"
          onClick={() => {
            setShowCountdown(true);
            setSpeed("1");
          }}
          shape="round"
          fill="solid"
        >
          {showCountdown ? <span>Sending...</span> : <span>Alert</span>}
          <IonIcon slot="end" icon={checkmarkDoneCircleSharp} />
        </IonButton>
        <IonButton
          disabled={showCountdown}
          expand="block"
          color="danger"
          onClick={() => {
            console.log(">> alert only selected friends");
          }}
          shape="round"
          fill="outline"
        >
          Alert Friends
          <IonIcon slot="end" icon={personCircleSharp} />
        </IonButton>
      </div>
    </>
  );
};

export default Home;