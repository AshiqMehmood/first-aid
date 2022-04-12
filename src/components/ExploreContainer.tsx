import { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import { IonButton, IonItem, IonContent, IonIcon,
  IonButtons, IonHeader, IonPage, IonTitle, IonToolbar,  IonBadge, IonModal } from "@ionic/react"
  import { closeCircleOutline, closeOutline, notificationsSharp, personCircleOutline} from "ionicons/icons"
import firebaseModules  from "../firebaseService";
import useStore from "../store";
import { App } from "@capacitor/app";
import Home from './Home';
import Activity from './Activity';
import Map from './Map';
import Settings from './Settings';
import Login from '../pages/Login';
import './ExploreContainer.css';

const { db } = firebaseModules;

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const {username, isLoggedIn, setLogin, setUsername, isModalOpen, setModalOpen} = useStore();
  const history = useHistory();

  const tabToRender = (name:string) => {
    switch (name) {
      case "Home":
        return <Home />;
      case "Activity":
        return <Activity />;
      case "Map":
        return <Map />;
      case "Settings":
        return <Settings />;
      default:
        return <Home />;
    }
  }
  return (
    <IonPage>
      <IonHeader>
                <IonToolbar color="primary">
                  <IonButtons slot="start">
                    <IonButton onClick={async () => {
                      try {
                        await App.exitApp()
                      }
                      catch(err) {
                        console.log('Cannot close in web mode', err)
                      }
                    }}>
                      <IonIcon slot="icon-only" icon={closeOutline}/>
                    </IonButton>
                  </IonButtons>
                  
                    <IonButtons slot="end">
                      <IonItem  lines="none" color="primary" slot="end" onClick={() => alert('notification panel')}>
                        <IonIcon size="small" icon={notificationsSharp}/>
                        <IonBadge color="danger">7</IonBadge>
                      </IonItem>
                      <IonButton onClick={async () => {
                        await setLogin(false)
                        await setUsername('')
                        await setModalOpen(true)
                      }}>
                        <IonIcon slot="icon-only" icon={personCircleOutline}/>
                      </IonButton>
                    </IonButtons>
                    <IonTitle>{name}</IonTitle>
                </IonToolbar>
          </IonHeader>

        <IonContent fullscreen>
            <IonModal
              isOpen={!isLoggedIn}
              //onDidDismiss={() => setModalOpen(false)}
              //swipeToClose={true}
              //presentingElement={router || undefined}
            >
                <Login />
            </IonModal>

            {tabToRender(name)}
        </IonContent>                    
    </IonPage>
  );
};

export default ExploreContainer;
