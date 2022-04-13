import { IonApp, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar,
  IonTabButton,  IonLabel, IonBadge, IonIcon } from '@ionic/react';
import { calendar, personCircle, map, informationCircle } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Page from './pages/Page';
import LandingPage from "./pages/LandingPage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonRouterOutlet id="main">
        <IonReactRouter>
          <Route path="/login" exact={true}>
            <LandingPage />
          </Route>
          <Route path="/" exact={true}>
            <Redirect to="/login" />
          </Route>
          <Route path="/page/Home" exact={true}>
            <Page />
          </Route>
          <Route path="/page/Activity" exact={true}>
            <Page />
          </Route>
          <Route path="/page/Map" exact={true}>
            <Page />
          </Route>
          <Route path="/page/Settings" exact={true}>
            <Page />
          </Route>
        </IonReactRouter>
      </IonRouterOutlet>
    </IonApp>
  );
};

export default App;
