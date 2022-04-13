import {useEffect, useState} from 'react'
import { IonButton, IonListHeader, IonList, IonText, IonLabel, IonItem, IonContent, IonIcon,
IonFab, IonFabButton, IonFabList, IonBadge, IonModal } from "@ionic/react"
import {
  checkmarkDoneCircleSharp,
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
  const [contactsModalOpen, setContactsModals] = useState(false);
  const countdown = 10 * 1000;
  const [timer, setTimer] = useState(countdown);

  const isPushNotificationAvailable =
    Capacitor.isPluginAvailable("PushNotifications");

  useEffect(() => {
    console.info(
      "is PushNotification available ? ",
      isPushNotificationAvailable
    );
    let isMounted = true; //flag
    if (isPushNotificationAvailable && username.length !== 0) {
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

    return () => {
      isMounted = false;
    }; //cleanup values
  }, [username]);

  const registerPush = async (isMounted: boolean) => {
    console.log(">> Initializing App ...");
    if (isPushNotificationAvailable && username.length !== 0) {
      await PushNotifications.register();
      await PushNotifications.addListener("registration", (token: Token) => {
        console.info("Registration token", token.value);
        if (isMounted) {
          setRegToken(token.value);
          showToast("Push registration success !");
        }
      });
      await PushNotifications.addListener("registrationError", (err: any) => {
        showToast("registration of token failed !");
      });
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
    }

    try {
      // const docRef = await addDoc(collection(db, "users"), {
      //   first: "Ada",
      //   last: "Lovelace",
      //   contact: "12345"
      // });
      // console.log('>>Document written with ID', docRef.id)
      //to set document with specific ID
      // await setDoc(doc(db, "users", "monster-token"), {
      //   first: 'Monster',
      //   tokenId: '##&^#^*#$jjjjj111223',
      //   timestamp: serverTimestamp()
      // })
      //create new collection and add data to it
      // const emerId = await addDoc(collection(db, "emergency"), {
      //   name: 'hospital',
      //   contact: '571293900'
      // })
      // console.log('emergency contact added', emerId)
      //to delete document from collection
      //await deleteDoc(doc(db, "users", "OfdyIreZ7joRJjUeASrs"))
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

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setContactsModals(true)}>
          <IonIcon icon={personAddSharp}></IonIcon>
        </IonFabButton>
      </IonFab>

      <IonListHeader mode="md" lines="inset">
        <IonLabel>Notifications</IonLabel>
      </IonListHeader>
      <IonModal
        isOpen={contactsModalOpen}
        //onDidDismiss={() => setContactsModals(false)}
        //swipeToClose={true}
        //presentingElement={router || undefined}
      >
        <Contacts exitModal={closeContactsModal} />
      </IonModal>
      {notifications.length !== 0 && (
        <IonList>
          {notifications.map((notif: any) => (
            <IonItem key={notif.id}>
              <IonLabel>
                <IonText>
                  <h3 className="notif-title">{notif.title}</h3>
                </IonText>
                <p>{notif.body}</p>
                {notif.type === "foreground" && (
                  <p>This data was received in foreground</p>
                )}
                {notif.type === "action" && (
                  <p>This data was received on tap</p>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}

      <h6>{username}</h6>
      <p>{registrationTokenId}</p>
      <AlertSOSComponent />
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
    </>
  );
};

export default Home;