import { useState } from "react";
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
import { addOutline, trashBinOutline } from "ionicons/icons";

const Settings: React.FC = () => {
  const [isDeviceAvailable, setDevice] = useState(false);
  const [isCentresEnabled, setCentres] = useState(false);
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
            checked={isDeviceAvailable}
            onIonChange={(e) => setDevice(e.detail.checked)}
          />
        </IonItem>
        {isDeviceAvailable && (
          <IonItem>
            <IonLabel>Sensor:</IonLabel>
            <IonInput placeholder="Enter your device ID" />
            <IonButton slot="end" color="tertiary">
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
