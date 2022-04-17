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
} from "ionicons/icons";
import "./CardComponent.css";

interface CardProps {
  contactName: string;
  reportingTime: Timestamp;
  placeofIncidence: string;
  status: string;
}
const CardComponent: React.FC<CardProps> = ({
  contactName,
  reportingTime,
  placeofIncidence,
  status,
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
            <b>Place:</b> {placeofIncidence}
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

          <IonButton color="tertiary" fill="clear">
            <IonIcon icon={copyOutline} />
          </IonButton>
        </div>
      </IonCardContent>
      <IonButton
        color={status === "active" ? "tertiary" : "medium"}
        expand="block"
        fill="solid"
        shape="round"
      >
        Locate
      </IonButton>
    </IonCard>
  );
};

export default CardComponent;
