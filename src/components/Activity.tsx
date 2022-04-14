import { useEffect, useState } from "react";
import { IonButton, IonInput } from "@ionic/react";
import firebaseModules from "../firebaseService";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import useStore from "../store";
import CardComponent from "./CardComponent";

const { db } = firebaseModules;

const Activity: React.FC = () => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const [inputText, setText] = useState("");
  const { username, registrationTokenId, setRegToken } = useStore();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(">>>", doc.data());
    // });
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listOfMessages: Array<any> = [];
      querySnapshot.forEach((doc) => {
        listOfMessages.push(doc.data());
      });
      setMessages([...listOfMessages]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const readMessages = async () => {
    //const q = query(collection(db, "messages"));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(">>>", doc.data());
    // });
  };

  const saveToFirebase = async () => {
    //to set document with specific ID
    const newData = await addDoc(collection(db, "messages"), {
      message: inputText,
      timestamp: serverTimestamp(),
    });
    console.log("Pushed to firebase !", newData.id);
  };

  return (
    <div>
      <IonInput
        type="text"
        onIonChange={(e) => {
          //@ts-ignore
          setText(e.detail.value);
        }}
      />
      <IonButton expand="block" onClick={() => saveToFirebase()}>
        Save to Firebase
      </IonButton>
      <CardComponent
        contactName={"Ashiq Mehmood"}
        placeofIncidence={"Trivandrum"}
        reportingTime={"Todat at 5.00pm"}
        status={"Active"}
      />
      <CardComponent
        contactName={"Harry Potter"}
        placeofIncidence={"Ireland"}
        reportingTime={"Yesterday at 2.00pm"}
        status={"Closed"}
      />

      {messages.map((item) => (
        <p> {item.message} </p>
      ))}
    </div>
  );
};

export default Activity;
