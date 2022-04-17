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
  const { username } = useStore();

  useEffect(() => {
    const q = query(collection(db, "users", username, "activity"));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(">>>", doc.data());
    // });
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const listOfMessages: Array<any> = [];
      querySnapshot.forEach((doc) => {
        listOfMessages.push(doc.data());
      });
      console.log(
        ">>>",
        listOfMessages.map((item) => item)
      );
      setMessages([...messages, ...listOfMessages]);
    });

    return () => {
      unsubscribe();
    };
  }, [username]);

  const readMessages = async () => {
    //const q = query(collection(db, "messages"));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(">>>", doc.data());
    // });
  };

  return (
    <div>
      {messages &&
        messages.map((item) => (
          <CardComponent
            key={item.created_at.toString() || ""}
            contactName={item.contact || ""}
            placeofIncidence={item.place || ""}
            reportingTime={item.created_at || ""}
            status={item.status || ""}
          />
        ))}
    </div>
  );
};

export default Activity;
