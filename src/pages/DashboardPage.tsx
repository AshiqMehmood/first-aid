import {
  IonRouterOutlet,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonBadge,
  IonTabs,
  IonAlert,
} from "@ionic/react";
import { useParams, useLocation } from "react-router";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import {
  arrowBackCircleSharp,
  calendar,
  homeSharp,
  map,
  settingsSharp,
} from "ionicons/icons";
import { Suspense, lazy, useEffect, useState, useCallback } from "react";
import FallBackUI from "../components/FallBack";
import firebaseModules from "../firebaseService";
import useStore from "../store";
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
const ExploreContainer = lazy(() => import("../components/ExploreContainer"));

const { db } = firebaseModules;

interface PageProps {
  tab: string;
}
const Page: React.FC<PageProps> = ({ tab }) => {
  const { pathname } = useLocation();
  const name = pathname.replace(/\/page\//g, "");
  const [newActivityCount, setActivityCount] = useState(0);
  const { username } = useStore();

  const memoizedActivityTracker = useCallback(() => {
    const q = query(collection(db, "users", username, "activity"));
    const activityTrackerUnsubscribe = onSnapshot(q, (querySnapshot) => {
      const listOfMessages: Array<any> = [];
      querySnapshot.forEach((doc) => {
        listOfMessages.push(doc.data());
      });

      const cachedActivities = //@ts-ignore
        JSON.parse(localStorage.getItem("app-activities")) || [];
      const newData = listOfMessages.filter(
        (item) =>
          !cachedActivities.find(
            (docs: any) =>
              docs.contact === item.contact &&
              new Date(docs.created_at.seconds * 1000).toString() ===
                new Date(item.created_at.seconds * 1000).toString()
          )
      );
      setActivityCount(newData.length);
    });
    return activityTrackerUnsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = memoizedActivityTracker();
    return () => {
      unsubscribe();
    };
  }, [memoizedActivityTracker]);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Suspense fallback={<FallBackUI />}>
          <IonReactRouter>
            {["Home", "Activity", "Map", "Settings"].map((path) => (
              <Route key={path} path={`/page/${path}`} exact={true}>
                <ExploreContainer name={tab} />
              </Route>
            ))}
          </IonReactRouter>
        </Suspense>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="Home" href="/page/Home">
          <IonIcon icon={homeSharp} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="Activity" href="/page/Activity">
          <IonIcon icon={calendar} />
          <IonLabel>Activity</IonLabel>
          {newActivityCount !== 0 && (
            <IonBadge color="danger">{newActivityCount}</IonBadge>
          )}
        </IonTabButton>

        <IonTabButton tab="Map" href="/page/Map">
          <IonIcon icon={map} />
          <IonLabel>Map</IonLabel>
        </IonTabButton>

        <IonTabButton tab="Settings" href="/page/Settings">
          <IonIcon icon={settingsSharp} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Page;
