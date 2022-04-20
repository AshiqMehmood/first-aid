import { useEffect, useState } from "react";
import {
  IonButton,
  IonItem,
  IonContent,
  IonIcon,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonLabel,
  IonChip,
  IonListHeader,
} from "@ionic/react";
import {
  addCircle,
  addCircleOutline,
  addOutline,
  closeOutline,
  filter,
  informationCircleOutline,
  personCircle,
  receipt,
  save,
} from "ionicons/icons";
import {
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  collection,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import useStore from "../store";
import firebaseModules from "../firebaseService";
import ToastComponent from "./ToastComponent";

const { db } = firebaseModules;

interface ContainerProps {
  exitModal: () => void;
}

const Contacts: React.FC<ContainerProps> = ({ exitModal }) => {
  const [myRecipients, setRecipients] = useState<Array<any>>([]);
  const [allContacts, setContacts] = useState<Array<any>>([]);
  const [showToast, setShowToast] = useState(false);
  const { username } = useStore();
  const RECIPIENT_LIMIT = 6;
  useEffect(() => {
    //fetch all contacts from firebase
    fetchAllContacts();
  }, []);

  const fetchAllContacts = async () => {
    // first fetch all added recipients
    const docSnap = await fetchMyRecipients();
    if (docSnap.exists()) {
      setRecipients([...(docSnap.data().people || [])]);
    }
    // now fetch all contacts list
    const q = query(collection(db, "users"));
    const listOfContacts: Array<any> = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      listOfContacts.push(doc.data());
    });
    // compare list to filter out already added recipients
    let contactsNotAdded: Array<any> = [];
    if (docSnap.exists()) {
      contactsNotAdded = listOfContacts.filter((user) => {
        const data: Array<any> = docSnap.data().people || [];
        return !data.find((recip: any) => recip.firstname === user.firstname);
      });
      // also filter out current sign-in user from list
      setContacts([
        ...contactsNotAdded.filter((user) => user.firstname !== username),
      ]);
      console.log("running fetch contacts...");
    }
  };

  const fetchMyRecipients = async () => {
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);
    return docSnap;
  };

  const updateRecipientsList = async (val: any) => {
    // save new recipients to firebase
    const userDetails = doc(db, "users", username);
    const user = val.firstname;
    const tokenId = val.tokenId;
    await updateDoc(userDetails, {
      people: arrayUnion({ firstname: user, tokenId: tokenId }),
    });
  };
  const deleteFromRecipientsList = async (val: any) => {
    // save new recipients to firebase
    const userDetails = doc(db, "users", username);
    const user = val.firstname;
    const tokenId = val.tokenId;
    await updateDoc(userDetails, {
      people: arrayRemove({ firstname: user, tokenId: tokenId }),
    });
  };

  const addRecipient = (val: any) => {
    if (myRecipients.length !== RECIPIENT_LIMIT) {
      setRecipients([...myRecipients, val]);
      const filteredContactsList = allContacts.filter(
        (contacts) => contacts.firstname !== val.firstname
      );
      setContacts([...filteredContactsList]);
      //push to firebase
      updateRecipientsList(val);
    } else {
      setShowToast(true);
    }
  };
  const removeRecipient = (val: any) => {
    const listOfRemovedRecipients: Array<any> = [];
    const filteredList = myRecipients.filter((users) => {
      if (users.firstname !== val.firstname) {
        return users;
      }
      listOfRemovedRecipients.push(users);
      return null;
    });
    setRecipients([...filteredList]);
    setContacts([...allContacts, ...listOfRemovedRecipients]);
    //delete from firebase
    deleteFromRecipientsList(val);
  };

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
          <IonListHeader>My Recipients</IonListHeader>
          {myRecipients &&
            myRecipients.map((item) => (
              <IonChip key={item.firstname} color="tertiary">
                <IonIcon icon={personCircle} color="tertiary" />
                <IonLabel>{item.firstname}</IonLabel>
                <IonIcon
                  color="danger"
                  icon={closeOutline}
                  onClick={() => removeRecipient(item)}
                />
              </IonChip>
            ))}
          {myRecipients.length === 0 && (
            <IonItem>
              <IonIcon slot="start" icon={informationCircleOutline}></IonIcon>
              <IonLabel>
                <h3>No Contacts added</h3>
              </IonLabel>
            </IonItem>
          )}
          <IonListHeader>All Contacts</IonListHeader>

          {allContacts &&
            allContacts.map((item) => (
              <IonItem key={item.firstname}>
                <IonIcon slot="start" icon={personCircle}></IonIcon>
                <IonLabel>
                  <h3>{item.firstname}</h3>
                  <p>location: {item.place || "unknown"}</p>
                </IonLabel>
                <IonButton
                  color="tertiary"
                  slot="end"
                  onClick={() => addRecipient(item)}
                >
                  Add
                  <IonIcon slot="end" icon={addOutline}></IonIcon>
                </IonButton>
              </IonItem>
            ))}
        </IonList>
        <ToastComponent
          message={`You can only add upto ${RECIPIENT_LIMIT} contacts`}
          infoIcon={informationCircleOutline}
          showToast={showToast}
          onDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Contacts;
