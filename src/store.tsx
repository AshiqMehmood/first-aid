import create from 'zustand'

interface types {
  recipientCount: number;
  setRecipientCount: (val: number) => void;
  username: string;
  setUsername: (val: string) => void;
  isLoggedIn: boolean;
  setLogin: (val: boolean) => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (val: boolean) => void;
  registrationTokenId: string;
  setRegToken: (val: string) => void;
  showCountdown: boolean;
  setShowCountdown: (val: boolean) => void;
  speed: string;
  setSpeed: (val: string) => void;
  activities: Array<any>;
  setActivities: (val: any) => void;
  deviceId: string;
  setDeviceId: (val: any) => void;
  isDeviceConnected: boolean;
  setDeviceConnection: (val: any) => void;
  currentUserDetails: {
    firstname: string;
    tokenId: string;
    people: Array<any>;
    place: string;
    deviceStatus: string;
  };
  setCurrentUserDetails: (val: object) => void;
  selectedActivity: {
    latitude: string;
    longitude: string;
  };
  setSelectedActivity: (val: object) => void;
  userLocation: {
    latitude: string;
    longitude: string;
  };
  setUserLocation: (val: object) => void;
}

const useStore = create<types>((set: any) => ({
  recipientCount: 0,
  setRecipientCount: (value: number) =>
    set((state: any) => ({ recipientCount: value })),

  username: localStorage.getItem("app-username") || "",
  setUsername: (value: string) =>
    set((state: any) => ({ username: value.toLowerCase() })),

  isLoggedIn: localStorage.getItem("app-username") ? true : false,
  setLogin: (value: boolean) => set((state: any) => ({ isLoggedIn: value })),

  isLoginModalOpen: false,
  setLoginModalOpen: (value: boolean) =>
    set((state: any) => ({ isLoginModalOpen: value })),

  registrationTokenId:
    localStorage.getItem("app-token") || "token--###--1234-sample",
  setRegToken: (value: string) =>
    set((state: any) => ({ registrationTokenId: value })),

  showCountdown: false,
  setShowCountdown: (value: boolean) =>
    set((state: any) => ({ showCountdown: value })),

  speed: "100",
  setSpeed: (val: string) => set((state: any) => ({ speed: val })),

  activities: [],
  setActivities: (val: any) => set((state: any) => ({ activities: [...val] })),

  deviceId: "SOS999",
  setDeviceId: (val: any) => set((state: any) => ({ deviceId: val })),

  isDeviceConnected: false,
  setDeviceConnection: (val: any) =>
    set((state: any) => ({ isDeviceConnected: val })),

  currentUserDetails: {
    firstname: "",
    tokenId: "",
    people: [],
    place: "",
    deviceStatus: "",
  },
  setCurrentUserDetails: (val: object) =>
    set((state: object) => ({ currentUserDetails: val })),
  selectedActivity: {
    latitude: "0",
    longitude: "0",
  },
  setSelectedActivity: (val: object) => set(() => ({ selectedActivity: val })),

  userLocation: {
    latitude: "0",
    longitude: "0",
  },
  setUserLocation: (val: object) => set(() => ({ userLocation: val })),
}));


export default useStore