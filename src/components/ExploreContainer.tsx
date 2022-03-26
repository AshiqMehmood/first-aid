import { useEffect, useState } from 'react';
import { 
  PushNotificationSchema, 
  PushNotifications, 
  Token, 
  ActionPerformed, 
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Toast } from "@capacitor/toast";
import { IonButton, IonListHeader, IonList, IonText, IonLabel, IonItem, IonContent } from "@ionic/react"
import './ExploreContainer.css';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const nullEntry: any[] = []
  const [notifications, setNotifications] = useState(nullEntry);

  const isPushNotificationAvailable = Capacitor.isPluginAvailable('PushNotifications');

  useEffect(() => {
    console.info('is PushNotification available ? ', isPushNotificationAvailable)
    if(isPushNotificationAvailable) {
      PushNotifications.checkPermissions().then((res) => {
        if (res.receive !== 'granted') {
          PushNotifications.requestPermissions().then((res) => {
            if (res.receive === 'denied') {
              showToast('Push Notification permission denied');
            }
            else {
              showToast('Push Notification permission granted');
              registerPush();
            }
          });
        }
        else {
              registerPush();
        }
      });
    }
  }, []);

  const registerPush = async() => {
    console.log('>> Initializing App ...');
    if(isPushNotificationAvailable) {
      await PushNotifications.register()
    await PushNotifications.addListener('registration', (token: Token) => {
      console.info('Registration token', token.value);
      showToast('Push registration success !')
    });
    await PushNotifications.addListener('registrationError', (err:any) => {
      console.info('Registration failed', err)
    });
    await PushNotifications.addListener('pushNotificationReceived', (notif: PushNotificationSchema) => {
      console.log('Recieved Push notification !!!')
      setNotifications([...notifications, {id: notif.id, title: notif.title, body: notif.body, type: 'foreground'}])
    });
    await PushNotifications.addListener('pushNotificationActionPerformed', (notif: ActionPerformed) => {
      console.log('user tapped on notification ...!')
      setNotifications([...notifications, { id: notif.notification.data.id, title: notif.notification.data.title, body: notif.notification.data.body, type: 'action' }])    
    });
    }

  }

  const showToast = async (msg: string) => {
    await Toast.show({
        text: msg
    })
}

  return (
    <IonContent>
      <IonButton expand="block" onClick={() => registerPush()}>Register for Push</IonButton>
      <IonListHeader mode="md" lines="inset">
                    <IonLabel>Notifications</IonLabel>
                </IonListHeader>
                {notifications.length !== 0 &&
                    <IonList>

                        {notifications.map((notif: any) =>
                            <IonItem key={notif.id}>
                                <IonLabel>
                                    <IonText>
                                        <h3 className="notif-title">{notif.title}</h3>
                                    </IonText>
                                    <p>{notif.body}</p>
                                    {notif.type==='foreground' && <p>This data was received in foreground</p>}
                                    {notif.type==='action' && <p>This data was received on tap</p>}
                                </IonLabel>
                            </IonItem>
                        )}
                    </IonList>}

    </IonContent>
  );
};

export default ExploreContainer;
