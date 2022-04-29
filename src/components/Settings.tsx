import { useEffect, useState } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonToggle,
  IonButton,
  IonInput,
  IonIcon,
} from "@ionic/react";
import {
  setDoc,
  getDocs,
  doc,
  query,
  where,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { addOutline, trashBinOutline } from "ionicons/icons";
import useStore from "../store";
import firebaseModules from "../firebaseService";

const { db } = firebaseModules;

const Settings: React.FC = () => {
  const [isConnectionSent, setConnectionSent] = useState(false);
  const [isCentresEnabled, setCentres] = useState(false);
  const [isDeviceRequired, setDeviceRequired] = useState(false);
  const [inputDeviceId, setDeviceInput] = useState<any>("");
  const {
    deviceId,
    setDeviceId,
    username,
    isDeviceConnected,
    setDeviceConnection,
  } = useStore();

  useEffect(() => {
    checkDeviceConnection();
  }, []);
  const checkDeviceConnection = async () => {
    const q = query(
      collection(db, "devices"),
      where("deviceUser", "==", username)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docs) => {
      if (docs.exists()) {
        setDeviceInput(docs.data().deviceId);
        setDeviceId(docs.data().deviceId);
        setDeviceRequired(true);
        if (docs.data().status === "connecting") {
          setConnectionSent(true);
        }
        if (docs.data().status === "approved") {
          setDeviceConnection(true);
        }
      }
      // get update from device
    });
  };
  const connectToDevice = async () => {
    //push to firebase
    const deviceDetails = doc(db, "devices", inputDeviceId);
    await setDoc(deviceDetails, {
      deviceId: inputDeviceId,
      deviceUser: username,
      status: "connecting",
    });
    //push to store
    setDeviceId(inputDeviceId);
    setConnectionSent(true);
  };

  const removeDevice = async () => {
    console.log(">>>>removed", deviceId);
    const deviceDetails = doc(db, "devices", deviceId);
    await deleteDoc(deviceDetails);
    setDeviceConnection(false);
  };
  return (
    <div>
      <IonList>
        <IonListHeader>
          <IonLabel color="medium">Device Configuration</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonLabel>Connect with sensor</IonLabel>
          <IonToggle
            color="tertiary"
            checked={isDeviceRequired}
            onIonChange={(e) => {
              setDeviceRequired(e.detail.checked);
              if (!e.detail.checked) removeDevice();
            }}
          />
        </IonItem>
        {isDeviceRequired && (
          <IonItem>
            <IonLabel>Sensor:</IonLabel>
            <IonInput
              value={inputDeviceId}
              placeholder={`ex: ${deviceId}`}
              onIonChange={(e) => setDeviceInput(e.detail.value)}
            />
            <IonButton
              slot="end"
              color="tertiary"
              disabled={isDeviceConnected || isConnectionSent}
              onClick={() => connectToDevice()}
            >
              {isDeviceConnected ? "Connected" : "Connect"}
            </IonButton>
          </IonItem>
        )}
        <IonListHeader>
          <IonLabel color="medium">App Settings</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonLabel>Alert Emergency Centres</IonLabel>
          <IonToggle
            color="tertiary"
            checked={isCentresEnabled}
            onIonChange={(e) => setCentres(e.detail.checked)}
          />
        </IonItem>
      </IonList>
    </div>
  );
};

export default Settings;
