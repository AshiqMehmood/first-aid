import {useEffect} from 'react'
import { IonButton, IonItem, IonContent, IonIcon,
IonButtons, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
IonLabel, IonInput, IonToggle, IonRadio, IonCheckbox, IonItemSliding, IonListHeader } from "@ionic/react"
import { addCircle, addCircleOutline, addOutline, closeOutline, personCircle } from 'ionicons/icons';
import useStore from '../store';
    
interface ContainerProps {
    exitModal: () => void;
}


const Contacts:React.FC<ContainerProps> = ({ exitModal }) => {
    
useEffect(() => {
  //fetch all contacts from firebase
});
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
      <IonList>
        <IonListHeader>Available friends</IonListHeader>
        <IonItem>
          <IonIcon slot="start" icon={personCircle}></IonIcon>
          <IonLabel>
            <h3>Ashiq mehmood</h3>
            <p>Trivandrum</p>
          </IonLabel>
          <IonButton slot="end">
            <IonIcon icon={addOutline}></IonIcon>
          </IonButton>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" icon={personCircle}></IonIcon>
          <IonLabel>
            <h3>James Tut</h3>
            <p>Trivandrum</p>
          </IonLabel>
          <IonButton slot="end">
            <IonIcon icon={addOutline}></IonIcon>
          </IonButton>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" icon={personCircle}></IonIcon>
          <IonLabel>
            <h3>Neymar</h3>
            <p>kochi</p>
          </IonLabel>
          <IonButton slot="end">
            <IonIcon icon={addOutline}></IonIcon>
          </IonButton>
        </IonItem>
        <IonListHeader>Emergency response center</IonListHeader>
        <IonItem>
          <IonIcon slot="start" icon={personCircle}></IonIcon>
          <IonLabel>
            <h3>Ambulance</h3>
            <p>KIMS, Tvm</p>
          </IonLabel>
          <IonButton slot="end">
            <IonIcon icon={addOutline}></IonIcon>
          </IonButton>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
);
}

export default Contacts