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
  IonAlert,
} from "@ionic/react";
import {
  checkmarkDoneCircleSharp,
  happy,
  informationCircleOutline,
  locate,
  personAddSharp,
} from "ionicons/icons";
import firebaseModules from "../firebaseService";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
  GeoPoint,
} from "firebase/firestore";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { App } from "@capacitor/app";
import { Geolocation } from "@capacitor/geolocation";
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
import ToastComponent from "./ToastComponent";
import "./Home.css";

const { db } = firebaseModules;

interface ContainerProps {}
interface GeoTypes {
  lat: number;
  lon: number;
}
const Home: React.FC<ContainerProps> = () => {
  const {
    username,
    isLoggedIn,
    registrationTokenId,
    setRegToken,
    showCountdown,
    setShowCountdown,
    speed,
    setSpeed,
    setDeviceConnection,
    currentUserDetails,
    setCurrentUserDetails,
    recipientCount,
    setUserLocation,
  } = useStore();
  const nullEntry: any[] = [];
  const [notifications, setNotifications] = useState(nullEntry);
  const [notifModalOpen, setNotifModal] = useState(false);
  const [contactsModalOpen, setContactsModals] = useState(false);
  const [showAddContactsError, setShowContactsError] = useState(false);
  const [haveGpsPermission, setGpsPermission] = useState(true);
  const countdown = 10 * 1000;
  const [timer, setTimer] = useState(countdown);
  const [currentLocation, setCurrentLocation] = useState<GeoTypes>({
    lat: 0,
    lon: 0,
  });

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
  }, [username, isLoggedIn]);

  useEffect(() => {
    geoLocationOfUser();
  }, []);

  useEffect(() => {
    getUserDetails();
  }, [recipientCount, username, isLoggedIn]);

  const getUserDetails = async () => {
    const userDetails = doc(db, "users", username);
    const docs = await getDoc(userDetails);
    if (docs.exists()) {
      setCurrentUserDetails(docs.data());
      if (docs.data().deviceStatus === "connected") setDeviceConnection(true);
      else setDeviceConnection(false);
    }
  };

  const registerPush = async (isMounted: boolean) => {
    if (isPushNotificationAvailable) {
      await PushNotifications.register();
      await PushNotifications.addListener("registration", (token: Token) => {
        console.info("Registration token generated: ", token.value);
        if (isMounted) {
          setRegToken(token.value);
          localStorage.setItem("app-token", token.value); //store token to local storage
          console.info(">> sending token to firebase..");
          //store regToken in firebase
          updateToken(token.value);
          showToast("Push registration success !");
        }
      });
      await PushNotifications.addListener("registrationError", (err: any) => {
        showToast("Push registration failed");
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
    const sfDocRef = doc(db, "users", username);
    try {
      await runTransaction(db, async (transaction) => {
        const sfdoc = await transaction.get(sfDocRef);
        if (!sfdoc.exists()) {
          throw new Error("Document does not exist !");
        }
        sendPushNotification();
        const listOfRecipients = [...sfdoc.data()?.people];
        listOfRecipients.forEach((item) => {
          let recipDocRef = doc(
            collection(db, "users", item.firstname, "activity")
          );
          transaction.set(recipDocRef, {
            contact: username,
            created_at: serverTimestamp(),
            status: "active",
            location: new GeoPoint(currentLocation.lat, currentLocation.lon),
          });
        });
        console.log("Transaction successfully committed!");
      });
    } catch (err) {
      console.error(err);
    }
    console.log("Pushed to firebase !");
  };

  const sendPushNotification = async () => {
    const docRef = await addDoc(collection(db, "messages"), currentUserDetails);
    console.log(">>> added to messages collection for push", docRef.id);
  };

  const updateToken = async (value: string) => {
    const userDetails = doc(db, "users", username);
    await updateDoc(userDetails, {
      tokenId: value,
    });
  };

  const geoLocationOfUser = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const location = {
        lat: coordinates.coords.latitude,
        lon: coordinates.coords.longitude,
      };
      setCurrentLocation(location);
      setUserLocation(location);
    } catch (err) {
      console.error("Unable to fetch coordinates", err);
      setGpsPermission(false);
    }
  };

  const checkRecipientsAdded = async () => {
    const userDetails = doc(db, "users", username);
    const fields = await getDoc(userDetails);
    if (fields.exists()) {
      //if there are recipients added, then only start countdown
      if (fields.data().people && fields.data().people.length > 0) {
        setShowCountdown(true);
        setSpeed("1");
      } else {
        //show alert that no recipients are available
        setShowContactsError(true);
      }
    }
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
          <IonCardSubtitle color="medium">
            ID: {registrationTokenId.slice(0, 16)}
          </IonCardSubtitle>
          <IonCardTitle>Hi, {username.toUpperCase()}</IonCardTitle>
          <div className="user-card-container">
            <div className="user-card-items">
              <IonLabel style={{ fontSize: ".7rem" }}>Device</IonLabel>
              <IonLabel style={{ fontSize: ".9rem", fontWeight: "bold" }}>
                {currentUserDetails.deviceStatus
                  ? currentUserDetails.deviceStatus
                  : "NA"}
              </IonLabel>
            </div>
            <div className="user-card-items">
              <IonLabel style={{ fontSize: ".7rem" }}>Contacts</IonLabel>
              <IonLabel style={{ fontSize: ".9rem", fontWeight: "bold" }}>
                {(currentUserDetails.people &&
                  currentUserDetails.people.length) ||
                  "0"}
              </IonLabel>
            </div>
            <div className="user-card-items">
              <IonLabel style={{ fontSize: ".7rem" }}>Location</IonLabel>
              <IonLabel style={{ fontSize: ".9rem", fontWeight: "bold" }}>
                {currentUserDetails.place || "Not Available"}
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
      <ToastComponent
        onDismiss={() => setShowContactsError(false)}
        message="Please add any contacts to continue."
        infoIcon={informationCircleOutline}
        showToast={showAddContactsError}
      />
      <ToastComponent
        infoIcon={informationCircleOutline}
        showToast={!haveGpsPermission}
        message="GPS is offline."
        onDismiss={() => console.log("dismissed")}
      />

      <AlertSOSComponent alert={sendAlert} />
      <div style={{ marginTop: "2em" }}>
        <IonButton
          disabled={showCountdown}
          expand="block"
          color="danger"
          onClick={() => checkRecipientsAdded()}
          shape="round"
          fill="solid"
        >
          {showCountdown ? <span>Alerting...</span> : <span>Alert</span>}
          <IonIcon slot="end" icon={checkmarkDoneCircleSharp} />
        </IonButton>
        {showCountdown && (
          <IonButton
            disabled={!showCountdown}
            expand="block"
            color="success"
            onClick={() => {
              setShowCountdown(false);
              setSpeed("100");
            }}
            shape="round"
            fill="solid"
          >
            I am alright !! Abort SOS
            <IonIcon slot="end" icon={happy} />
          </IonButton>
        )}
      </div>
    </>
  );
};

export default Home;