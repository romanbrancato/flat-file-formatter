"use client"
import {createContext, useState} from 'react';

interface DataContextProps {
    data: Record<string, unknown>[];
    initial: Record<string, unknown>[]; // Keeps track of initial shape of data
    setData: (data: Record<string, unknown>[]) => void;
    setInitial: (data: Record<string, unknown>[]) => void;
}

export const DataContext = createContext<DataContextProps>({
    data: [],
    initial: [],
    setData: () => {
    },
    setInitial: () => {
    }
});

export const DataContextProvider = (props: any) => {
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [initial, setInitial] = useState<Record<string, unknown>[]>([]);

    return (
        <DataContext.Provider
            value={{
                data,
                initial,
                setData,
                setInitial
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};