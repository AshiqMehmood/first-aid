import create from 'zustand'

interface types {
  count: number;
  setCount: (val: number) => void;
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
}

const useStore = create<types>((set: any) => ({
  count: 0,
  setCount: (value: number) =>
    set((state: any) => ({ count: state.count + 1 })),

  username: localStorage.getItem("app-username") || "",
  setUsername: (value: string) =>
    set((state: any) => ({ username: value.toLowerCase() })),

  isLoggedIn: localStorage.getItem("app-username") ? true : false,
  setLogin: (value: boolean) => set((state: any) => ({ isLoggedIn: value })),

  isLoginModalOpen: false,
  setLoginModalOpen: (value: boolean) =>
    set((state: any) => ({ isLoginModalOpen: value })),

  registrationTokenId: "token--###--1242-ab38j9",
  setRegToken: (value: string) =>
    set((state: any) => ({ registrationTokenId: value })),

  showCountdown: false,
  setShowCountdown: (value: boolean) =>
    set((state: any) => ({ showCountdown: value })),

  speed: "100",
  setSpeed: (val: string) => set((state: any) => ({ speed: val })),

  activities: [],
  setActivities: (val: any) => set((state: any) => ({ activities: [...val] })),

  deviceId: "#SOS-000",
  setDeviceId: (val: any) => set((state: any) => ({ deviceId: val })),

  isDeviceConnected: false,
  setDeviceConnection: (val: any) =>
    set((state: any) => ({ isDeviceConnected: val })),
}));


export default useStore