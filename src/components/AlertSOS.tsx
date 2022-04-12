import { useEffect, useRef, useState } from "react";
import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import Countdown from "react-countdown";
import "./alertComponent.css";
import { checkmarkDoneCircleSharp } from "ionicons/icons";
import useStore from "../store";

const AlertSOS: React.FC = () => {
  const countdown = 1 * 1000;
  const [timer, setTimer] = useState(countdown);
  const { showCountdown, setShowCountdown, speed, setSpeed } = useStore();

  //@ts-ignore
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div style={{ transform: "translate(1%, -15%)" }}>
          <div id="tick-container">
            <div id="tick-circle" style={{ animationDelay: "0s" }}></div>
            <div id="tick-circle" style={{ animationDelay: ".3s" }}></div>
            <div id="tick-circle" style={{ animationDelay: ".8s" }}></div>
            <div id="tick-circle" style={{ animationDelay: "1.2s" }}></div>
            <div id="tick-mark"></div>
          </div>
        </div>
      );
    } else {
      return (
        <span>
          {minutes}:{seconds.toString().length < 2 ? "0" : ""}
          {seconds}
        </span>
      );
    }
  };
  return (
    <div
      style={{
        display: "block",
        position: "relative",
      }}
    >
      <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="none"
          stroke="lightgrey"
          strokeWidth="9"
          strokeDasharray="3"
          d="M 100, 100
            m -75, 0
            a 75,75 0 1,0 150,0
            a 75,75 0 1,0 -150,0"
        />
        <circle r="5" fill="#eb445a">
          <animateMotion
            dur={speed}
            repeatCount="indefinite"
            path="M 100, 100
                m -75, 0
                a 75,75 0 1,0 150,0
                a 75,75 0 1,0 -150,0"
          />
        </circle>
      </svg>
      <div
        style={{
          position: "absolute",
          fontSize: "4.8em",
          color: "rgb(60, 60, 60)",
          transform: "translate(50%, -30%)",
          fontFamily: "serif",
          textAlign: "center",
          margin: "0",
          top: "50%",
          right: "50%",
        }}
      >
        {showCountdown ? (
          <Countdown
            date={Date.now() + timer}
            renderer={renderer}
            onComplete={() => {
              //send messages
              console.log(">>>sending message alerts.....!");
              setTimeout(() => {
                console.log(">>>DONE.....!");
                setShowCountdown(false);
                setSpeed("10");
              }, 4000);
            }}
          />
        ) : (
          <span>SOS</span>
        )}
      </div>
    </div>
  );
};

export default AlertSOS;
