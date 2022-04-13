import { IonRouterOutlet, IonButton, IonIcon,  IonApp, IonTabBar, IonTabButton, IonLabel, IonBadge, IonTabs } from '@ionic/react';
import { useParams, useLocation } from 'react-router';
import { IonReactRouter } from '@ionic/react-router';
import {  Route, Redirect } from 'react-router-dom';
import { arrowBackCircleSharp, calendar, homeSharp ,map, settingsSharp} from "ionicons/icons"
import Menu from '../components/Menu';
import ExploreContainer from "../components/ExploreContainer";
import { useState } from 'react';
import './Page.css';
import useStore from '../store';

const Page: React.FC = () => {
  const  { pathname }= useLocation();
  const name = pathname.replace(/\/page\//g, '')

  return (
        <IonTabs>
           <IonRouterOutlet>
              <IonReactRouter>  
                        {['Home', 'Activity', 'Map', 'Settings'].map(path => 
                          <Route key={path} path={`/page/${path}`} exact={true}>
                            <ExploreContainer name={name}/>
                        </Route> 
                        )}  
                       
                </IonReactRouter> 
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
  )
};

export default Page;
