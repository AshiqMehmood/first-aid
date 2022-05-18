import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonPage,
  IonContent,
  IonInput,
  IonLabel,
  IonItem,
  useIonRouter,
  IonButtons,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonSpinner,
} from "@ionic/react";
import useStore from "../store";
import { App } from "@capacitor/app";
import { closeOutline, happyOutline } from "ionicons/icons";
import {
  setDoc,
  collection,
  doc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "@firebase/firestore";
import firebaseModules from "../firebaseService";
import ToastComponent from "../components/ToastComponent";
import image from "../first-aid-logo.png";

const { db } = firebaseModules;

interface LoginProps {
  isLandingPage: boolean;
  exitModal: () => void;
}

const LoginComponent: React.FC<LoginProps> = ({ isLandingPage, exitModal }) => {
  const history = useHistory();
  const [textValue, setTextValue] = useState("");
  const [placeValue, setPlaceValue] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const {
    username,
    setUsername,
    isLoggedIn,
    setLogin,
    setLoginModalOpen,
    isLoginModalOpen,
  } = useStore();
  const ionRouter = useIonRouter();
  document.addEventListener("ionBackButton", (ev) => {
    //@ts-ignore
    ev.detail.register(-1, () => {
      if (!ionRouter.canGoBack()) {
        App.exitApp();
      }
    });
  });

  const redirectToHomePage = async () => {
    setUsername(textValue);
    setLoading(true);
    const isOldUser = await checkIfUserAlreadyExist();
    if (!isOldUser) {
      setLoginMessage("Sign In successfull !");
      //add new user to firebase
      uploadToFirebase();
    } else {
      //if oldUser then update Place only
      updateUserPlace();
      setLoginMessage(`Welcome back ${textValue} !`);
    }
    localStorage.setItem("app-username", textValue); //store username to localstorage
    if (localStorage.getItem("app-username")) {
      setLogin(true);
    }
    setTimeout(() => {
      setLoading(true);
      if (isLandingPage) {
        let path = "/page/Home";
        history.push(path);
      } else {
        exitModal();
      }
    }, 1000);
  };
  const uploadToFirebase = async () => {
    const docRf = await doc(db, "users", textValue);
    await setDoc(docRf, {
      firstname: textValue,
      place: placeValue,
      timestamp: serverTimestamp(),
      tokenId: "token-#001-999",
      people: [],
    });
  };

  const updateUserPlace = async () => {
    const userDetails = doc(db, "users", textValue);
    updateDoc(userDetails, {
      place: placeValue,
    });
    console.log("updated user place...");
  };

  const checkIfUserAlreadyExist = async () => {
    const docRef = doc(db, "users", textValue);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={isLandingPage ? "primary" : ""}>
          <IonButtons slot="start">
            <IonButton
              slot="start"
              onClick={async () => {
                try {
                  await App.exitApp();
                } catch (err) {
                  console.log("Cannot close in web mode", err);
                }
              }}
            >
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            {isLandingPage ? "First AID" : "Login To Explore"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            transform: "translate(0, -30px)",
          }}
        >
          <div>
            <IonImg
              style={{
                border: "1px solid rgb(167, 167, 167)",
                borderRadius: "50%",
                padding: "2em",
              }}
              src={image}
              alt="firstAid Logo"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              border: "1px solid rgb(167, 167, 167)",
              borderRadius: "10px",
              marginTop: "2em",
            }}
          >
            <IonItem style={{ width: "90%" }}>
              <IonLabel position="floating">Username</IonLabel>
              <IonInput
                onIonChange={(e) => {
                  //@ts-ignore
                  setTextValue(e.detail.value?.toLowerCase());
                }}
              ></IonInput>
            </IonItem>
            <IonItem style={{ width: "90%" }}>
              <IonLabel position="floating">Place</IonLabel>
              <IonInput
                onIonChange={(e) => {
                  //@ts-ignore
                  setPlaceValue(e.detail.value?.toLowerCase());
                }}
              ></IonInput>
            </IonItem>
          </div>
          <IonButton
            style={{ marginTop: "2em" }}
            disabled={textValue.length === 0 || placeValue.length === 0}
            onClick={redirectToHomePage}
          >
            Sign In
          </IonButton>
          {isLoading && <IonSpinner name="dots" />}
        </div>
        <ToastComponent
          onDismiss={() => console.log(">> dismissed")}
          showToast={isLoggedIn}
          message={loginMessage}
          infoIcon={happyOutline}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginComponent;
