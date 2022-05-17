import { Timestamp } from "@firebase/firestore";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
} from "@ionic/react";
import {
  copyOutline,
  personCircleSharp,
  shareSocialOutline,
  trashBinOutline,
} from "ionicons/icons";
import "./CardComponent.css";

interface CardProps {
  contactName: string;
  reportingTime: Timestamp;
  placeofIncidence: {
    latitude: string;
    longitude: string;
  };
  status: string;
  onDelete: () => void;
  locatePersonOnMap: () => void;
}
const CardComponent: React.FC<CardProps> = ({
  contactName,
  reportingTime,
  placeofIncidence,
  status,
  onDelete,
  locatePersonOnMap,
}) => {
  const formatDate = () => {
    const dateTime = new Date(reportingTime.seconds * 1000);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    //@ts-ignore
    const formattedDate = dateTime.toLocaleDateString("en-US", options);
    return formattedDate.toString();
  };
  const formatTime = () => {
    const dateTime = new Date(reportingTime.seconds * 1000);
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedTime = dateTime //@ts-ignore
      .toLocaleDateString("en-US", options)
      .split(",")[1]
      .trim();
    return formattedTime.toString();
  };

  return (
    <IonCard className="custom-card">
      <IonCardHeader style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            flexGrow: "2",
          }}
        >
          <IonCardSubtitle>{formatDate()}</IonCardSubtitle>
          <IonCardTitle>{contactName}</IonCardTitle>
        </div>
        <div style={{ justifyContent: "flex-end" }}>
          <b>{formatTime()}</b>
        </div>
      </IonCardHeader>

      <IonCardContent
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            flexGrow: "8",
          }}
        >
          <IonLabel>
            <b>Status:</b> {status}
          </IonLabel>
          <IonLabel>
            [{placeofIncidence.latitude || "lat"},{" "}
            {placeofIncidence.longitude || "lon"}]
          </IonLabel>
        </div>
        <div
          style={{
            display: "flex",
            justifySelf: "flex-end",
          }}
        >
          <IonButton color="tertiary" fill="clear">
            <IonIcon icon={shareSocialOutline} />
          </IonButton>

          <IonButton color="danger" fill="clear" onClick={() => onDelete()}>
            <IonIcon icon={trashBinOutline} />
          </IonButton>
        </div>
      </IonCardContent>
      <IonButton
        color={status === "active" ? "tertiary" : "medium"}
        expand="block"
        fill="solid"
        shape="round"
        onClick={locatePersonOnMap}
        //href={`https://www.google.com/maps/@${placeofIncidence.latitude},${placeofIncidence.longitude}`}
      >
        Locate
      </IonButton>
    </IonCard>
  );
};

export default CardComponent;
