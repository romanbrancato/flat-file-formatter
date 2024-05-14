"use client"
import {createContext, useState} from 'react';

interface DataContextProps {
    data: Record<string, unknown>[];
    setData: (data: Record<string, unknown>[]) => void;
}

export const DataContext = createContext<DataContextProps>({
    data: [],
    setData: () => {
    },
});

export const DataContextProvider = (props: any) => {
    const [data, setData] = useState<Record<string, unknown>[]>([]);

    return (
        <DataContext.Provider
            value={{
                data,
                setData
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};