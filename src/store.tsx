import create from 'zustand'

interface types {
    count: number;
    setCount: (val: number) => void;
}

const useStore = create<types>((set:any) => ({
    count: 0,
    setCount: (value: number) => set((state: any) => ({ count: state.count + 1 })),
}))


export default useStore