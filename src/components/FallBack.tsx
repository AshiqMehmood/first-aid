import {
  IonButton,
  IonItem,
  IonContent,
  IonIcon,
  IonHeader,
  IonPage,
  IonToolbar,
  IonSpinner,
} from "@ionic/react";

const FallBack: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"></IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div
          style={{
            margin: "0",
            position: "absolute",
            top: "50%",
            right: "50%",
            transform: "translate(50%, 50%)",
          }}
        >
          <IonSpinner name="lines-sharp" color="primary" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FallBack;
