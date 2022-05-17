import { useEffect, useState } from "react";
import {
  IonAlert,
  IonLoading,
  IonModal,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import firebaseModules from "../firebaseService";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { Geolocation } from "@capacitor/geolocation";
import useStore from "../store";
import CardComponent from "./CardComponent";
import Map from "./Map";
import { informationCircleOutline } from "ionicons/icons";

const { db } = firebaseModules;

const Activity: React.FC = () => {
  const [itemToDelete, setDeleteItem] = useState<Array<any>>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showGMap, setShowGMap] = useState(false);
  const [haveGPSPermission, setGPSPermission] = useState(false);
  const {
    username,
    activities,
    setActivities,
    setSelectedActivity,
    setUserLocation,
    userLocation,
  } = useStore();

  useEffect(() => {
    geoLocationOfUser();
  }, []);

  const geoLocationOfUser = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.info(">>>>", await Geolocation.checkPermissions());
      const location = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      };
      setUserLocation(location);
      setGPSPermission(true);
    } catch (err) {
      console.error("Unable to fetch coordinates", err);
      setGPSPermission(false);
    }
  };

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
      let q = {};
      q = {
        ...doc.data(),
        id: doc.id,
      };
      listOfMessages.push(q);
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
    let updatedActivityList = activities.filter((item) => item.id !== val.id);
    setActivities(updatedActivityList);
    setShowLoader(false);
  };

  const closeMapModal = () => {
    setShowGMap(false);
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
            key={item.id}
            contactName={item.contact || ""}
            placeofIncidence={JSON.parse(JSON.stringify(item.location))}
            reportingTime={item.created_at || ""}
            status={item.status || "closed"}
            onDelete={() => {
              setShowPopover(true);
              setDeleteItem(item);
            }}
            locatePersonOnMap={() => {
              setSelectedActivity(JSON.parse(JSON.stringify(item.location)));
              setShowGMap(true);
            }}
          />
        ))}
      {activities.length === 0 && (
        <IonItem>
          <IonIcon
            color="danger"
            slot="start"
            icon={informationCircleOutline}
          ></IonIcon>
          <IonLabel color="danger">
            <h3>No Activites yet</h3>
          </IonLabel>
        </IonItem>
      )}
      <IonLoading
        cssClass="my-custom-class"
        isOpen={showLoader}
        onDidDismiss={() => console.log("finished deleting...")}
        message={"Please wait.."}
      />
      <IonModal
        isOpen={showGMap}
        //onDidDismiss={() => setContactsModals(false)}
        //swipeToClose={true}
        //presentingElement={router || undefined}
      >
        <Map
          exitModal={closeMapModal}
          originCoords={userLocation}
          havePermission={haveGPSPermission}
        />
      </IonModal>
    </div>
  );
};

export default Activity;
