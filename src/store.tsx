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
}

const useStore = create<types>((set: any) => ({
  count: 0,
  setCount: (value: number) =>
    set((state: any) => ({ count: state.count + 1 })),

  username: localStorage.getItem("app-username") || "",
  setUsername: (value: string) => set((state: any) => ({ username: value })),

  isLoggedIn: localStorage.getItem("app-username") ? true : false,
  setLogin: (value: boolean) => set((state: any) => ({ isLoggedIn: value })),

  isLoginModalOpen: false,
  setLoginModalOpen: (value: boolean) =>
    set((state: any) => ({ isLoginModalOpen: value })),

  registrationTokenId: "token--###--1242-alourn9",
  setRegToken: (value: string) =>
    set((state: any) => ({ registrationTokenId: value })),

  showCountdown: false,
  setShowCountdown: (value: boolean) =>
    set((state: any) => ({ showCountdown: value })),

  speed: "10",
  setSpeed: (val: string) => set((state: any) => ({ speed: val })),
}));


export default useStore