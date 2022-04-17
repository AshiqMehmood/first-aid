import {
  IonRouterOutlet,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonBadge,
  IonTabs,
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
import { Suspense, lazy, useEffect } from "react";
import FallBackUI from "../components/FallBack";

const ExploreContainer = lazy(() => import("../components/ExploreContainer"));

interface PageProps {
  tab: string;
}
const Page: React.FC<PageProps> = ({ tab }) => {
  const { pathname } = useLocation();
  const name = pathname.replace(/\/page\//g, "");
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
          <IonBadge>6</IonBadge>
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
