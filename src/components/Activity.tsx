import { useEffect, useState } from "react";
import { IonAlert, IonButton, IonLoading } from "@ionic/react";
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
  GeoPoint,
} from "firebase/firestore";
import useStore from "../store";
import CardComponent from "./CardComponent";

const { db } = firebaseModules;

const Activity: React.FC = () => {
  const [itemToDelete, setDeleteItem] = useState<Array<any>>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
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
  }, []);

  const readActivity = async (q: any) => {
    const querySnapshot = await getDocs(q);
    const listOfMessages: Array<any> = [];
    querySnapshot.forEach((doc: any) => {
      listOfMessages.push(doc.data());
    });
    setActivities(listOfMessages);
    localStorage.setItem("app-activities", JSON.stringify(listOfMessages));
  };

  const deleteActivity = async (val: any) => {
    const q = await query(
      collection(db, "users", username, "activity"),
      where("contact", "==", val.contact),
      where("created_at", "==", val.created_at)
    );
    const querySnapshot = await getDocs(q);
    let docId = { idToRemove: "" };
    querySnapshot.forEach((doc) => {
      docId.idToRemove = doc.id;
      return docId;
    });
    try {
      await deleteDoc(doc(db, "users", username, "activity", docId.idToRemove));
    } catch (err) {
      console.error(err);
    }
    let updatedActivityList = activities.filter(
      (item) =>
        item.contact !== val.contact &&
        new Date(item.created_at.seconds * 1000).toString() !==
          new Date(val.created_at.seconds * 1000).toString()
    );
    setActivities(updatedActivityList);
    setShowLoader(false);
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
              setShowLoader(true);
              deleteActivity(itemToDelete);
            },
          },
        ]}
      />
      {activities &&
        activities.map((item) => (
          <CardComponent
            key={(item.created_at.seconds * 1000).toString()}
            contactName={item.contact || ""}
            placeofIncidence={
              JSON.parse(JSON.stringify(item.location)) || "unknown"
            }
            reportingTime={item.created_at || ""}
            status={item.status || "closed"}
            onDelete={() => {
              setShowPopover(true);
              setDeleteItem(item);
            }}
          />
        ))}
      <IonLoading
        cssClass="my-custom-class"
        isOpen={showLoader}
        onDidDismiss={() => console.log("finished deleting...")}
        message={"Please wait.."}
      />
    </div>
  );
};

export default Activity;
