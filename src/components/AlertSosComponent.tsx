import { memo } from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import Countdown from "react-countdown";
import "./AlertSosComponent.css";
import useStore from "../store";

interface AlertProps {
  alert: () => void;
}

const AlertSosComponent: React.FC<AlertProps> = ({ alert }) => {
  const countdown = 10 * 1000;
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
          strokeWidth="11"
          strokeDasharray="2"
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
      {showCountdown && (
        <div
          style={{
            position: "absolute",
            fontSize: "1em",
            color: "rgb(120,120,120)",
            transform: "translate(50%, -50%)",
            fontFamily: "serif",
            textAlign: "center",
            margin: "0",
            top: "30%",
            right: "50%",
          }}
        >
          Sending SOS<br></br> in...
        </div>
      )}
      <div
        style={{
          position: "absolute",
          fontSize: "4.8em",
          color: "rgb(90, 90, 90)",
          transform: "translate(50%, -30%)",
          fontFamily: "serif",
          textAlign: "center",
          margin: "0",
          top: "50%",
          right: "50%",
        }}
      >
        {showCountdown ? (
          <div>
            <Countdown
              date={Date.now() + timer}
              renderer={renderer}
              onComplete={() => {
                //send messages
                console.log(">>>sending message alerts.....!");
                alert();
                setTimeout(() => {
                  console.log(">>>DONE.....!");
                  setShowCountdown(false);
                  setSpeed("100");
                }, 4000);
              }}
            />
          </div>
        ) : (
          <span>SOS</span>
        )}
      </div>
    </div>
  );
};

export default memo(AlertSosComponent);
