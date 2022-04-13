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

interface CardProps {
  contactName: string;
  reportingTime: string;
  placeofIncidence: string;
  status: string;
}
const CardComponent: React.FC<CardProps> = ({
  contactName,
  reportingTime,
  placeofIncidence,
  status,
}) => {
  return (
    <IonCard>
      <IonCardHeader style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            flexGrow: "8",
          }}
        >
          <IonCardSubtitle>{reportingTime}</IonCardSubtitle>
          <IonCardTitle>{contactName}</IonCardTitle>
        </div>
        <IonItem lines="none" style={{ justifyContent: "flex-end" }}>
          <IonIcon
            icon={personCircleSharp}
            color={status === "Active" ? "danger" : "medium"}
            size="large"
          />
        </IonItem>
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
      <IonButton color="danger" expand="block" fill="solid" shape="round">
        Locate
      </IonButton>
    </IonCard>
  );
};

export default CardComponent;
