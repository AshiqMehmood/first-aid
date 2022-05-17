import { useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonIcon,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import useStore from "../store";

interface MapProps {
  havePermission: boolean;
  originCoords: {
    latitude: string;
    longitude: string;
  };
  exitModal: () => void;
}

const Map: React.FC<MapProps> = ({
  exitModal,
  originCoords,
  havePermission,
}) => {
  const { selectedActivity } = useStore();

  useEffect(() => {
    console.log(">>>>>> origin >>", originCoords);
    console.log(">>>>>> locate friend >>", selectedActivity);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton slot="start" onClick={() => exitModal()}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Google Map</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ height: "100%" }}>
          {havePermission && (
            <iframe
              title="gmap"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/directions?zoom=16&center=${
                selectedActivity.latitude + "," + selectedActivity.longitude
              }&key=AIzaSyBBOdS9_BPX98FOo59Gsv2zwHhNHCoFkt8&origin=${
                originCoords.latitude + "," + originCoords.longitude
              }
            &destination=${
              selectedActivity.latitude + "," + selectedActivity.longitude
            }&mode=driving&avoid=tolls|highways`}
            ></iframe>
          )}
          {!havePermission && (
            <iframe
              title="error"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?zoom=14&q=${
                selectedActivity.latitude + "," + selectedActivity.longitude
              }&key=AIzaSyBBOdS9_BPX98FOo59Gsv2zwHhNHCoFkt8`}
            ></iframe>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Map;
