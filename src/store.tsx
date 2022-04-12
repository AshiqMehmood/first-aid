import create from 'zustand'

interface types {
  count: number;
  setCount: (val: number) => void;
  username: string;
  setUsername: (val: string) => void;
  isLoggedIn: boolean;
  setLogin: (val: boolean) => void;
  isModalOpen: boolean;
  setModalOpen: (val: boolean) => void;
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
  username: "",
  setUsername: (value: string) => set((state: any) => ({ username: value })),
  isLoggedIn: false,
  setLogin: (value: boolean) => set((state: any) => ({ isLoggedIn: value })),
  isModalOpen: false,
  setModalOpen: (value: boolean) =>
    set((state: any) => ({ isModalOpen: value })),
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