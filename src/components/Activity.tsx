import { useEffect, useState } from "react";
import { IonAlert } from "@ionic/react";
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
  limit,
} from "firebase/firestore";
import useStore from "../store";
import CardComponent from "./CardComponent";

const { db } = firebaseModules;

const Activity: React.FC = () => {
  const [itemToDelete, setDeleteItem] = useState<Array<any>>([]);
  const [showPopover, setShowPopover] = useState(false);
  const { username, activities, setActivities } = useStore();

  useEffect(() => {
    const q = query(
      collection(db, "users", username, "activity"),
      orderBy("created_at", "desc"),
      limit(5)
    );
    readActivity(q);
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const listOfMessages: Array<any> = [];
    //   querySnapshot.forEach((doc) => {
    //     listOfMessages.push(doc.data());
    //   });

    //   setActivities(listOfMessages);
    // });

    // return () => {
    //   unsubscribe();
    // };
  }, [username, activities]);

  const readActivity = async (q: any) => {
    const querySnapshot = await getDocs(q);
    const listOfMessages: Array<any> = [];
    querySnapshot.forEach((doc) => {
      listOfMessages.push(doc.data());
    });
    setActivities(listOfMessages);
    localStorage.setItem(
      "app-activities",
      JSON.stringify(listOfMessages.map((item) => item.contact))
    );
  };

  const deleteActivity = async (val: any) => {
    const q = await query(
      collection(db, "users", username, "activity"),
      where("contact", "==", val.contact)
    );
    const querySnapshot = await getDocs(q);
    let docId = { idToRemove: "" };
    querySnapshot.forEach((doc) => {
      docId.idToRemove = doc.id;
      return docId;
    });
    await deleteDoc(doc(db, "users", username, "activity", docId.idToRemove));
  };

  return (
    <div>
      <IonAlert
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
        cssClass="alert-on-delete"
        message={"Are you sure ?"}
        buttons={[
          {
            text: "No",
            role: "cancel",
            id: "cancel-button",
            handler: () => {
              console.log("dismissed !");
            },
          },
          {
            text: "Delete",
            id: "confirm-button",
            handler: () => {
              console.log("deleted !");
              deleteActivity(itemToDelete);
            },
          },
        ]}
      />
      {activities &&
        activities.map((item) => (
          <CardComponent
            key={item.created_at.toString() || ""}
            contactName={item.contact || ""}
            placeofIncidence={item.place || ""}
            reportingTime={item.created_at || ""}
            status={item.status || ""}
            onDelete={() => {
              setShowPopover(true);
              setDeleteItem(item);
            }}
          />
        ))}
    </div>
  );
};

export default Activity;
