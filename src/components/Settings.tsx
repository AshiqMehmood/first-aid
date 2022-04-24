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
} from "firebase/firestore";
import { addOutline, trashBinOutline } from "ionicons/icons";
import useStore from "../store";
import firebaseModules from "../firebaseService";

const { db } = firebaseModules;

const Settings: React.FC = () => {
  const [isDeviceAvailable, setDevice] = useState(false);
  const [isCentresEnabled, setCentres] = useState(false);
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
  }, [isDeviceConnected]);
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
        setDeviceConnection(true);
      }
      // get update from device
      // set status as 'connected' in App
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
            checked={isDeviceConnected}
            onIonChange={(e) => setDeviceConnection(e.detail.checked)}
          />
        </IonItem>
        {isDeviceConnected && (
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
              onClick={() => connectToDevice()}
            >
              Connect
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
