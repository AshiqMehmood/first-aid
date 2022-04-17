import {
  IonItem,
  IonText,
  IonLabel,
  IonPage,
  IonContent,
  IonButtons,
  IonButton,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonList,
  IonIcon,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import useStore from "../store";

interface NotificationProps {
  notifications: Array<any>;
  exitModal: () => void;
}

const NotificationList: React.FC<NotificationProps> = ({
  notifications,
  exitModal,
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton slot="start" onClick={() => exitModal()}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Contacts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
      </IonContent>
    </IonPage>
  );
};

export default NotificationList;
