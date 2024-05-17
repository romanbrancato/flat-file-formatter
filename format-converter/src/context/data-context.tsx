"use client"
import {createContext, useState} from 'react';

interface DataContextProps {
    data: Record<string, unknown>[];
    initial: Record<string, unknown>[]; // Keeps track of initial shape of data
    setData: (data: Record<string, unknown>[]) => void;
    setInitial: (data: Record<string, unknown>[]) => void;
    addField: (name: string, value: string) => void;
    removeField: (field: string) => void;
    editField: (field: string, value: string) => void;
}

export const DataContext = createContext<DataContextProps>({
    data: [],
    initial: [],
    setData: () => {
    },
    setInitial: () => {
    },
    addField: () => {
    },
    removeField: () => {
    },
    editField: () => {
    }
});

export const DataContextProvider = (props: any) => {
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [initial, setInitial] = useState<Record<string, unknown>[]>([]);

    const addField = (name: string, value: string) => {
        const newField = data.map((row) => {
            return {
                ...row,
                [name]: value
            };
        });
        setData(newField);
    }

    const removeField = (field: string) => {
        const newData = data.map((row) => {
            delete row[field];
            return row;
        });
        setData(newData);

    }

    const editField = (field: string, value: string) => {
        const newData = data.map((row) => {
            row[field] = value;
            return row;
        });
        setData(newData);

    }

    return (
        <DataContext.Provider
            value={{
                data,
                initial,
                setData,
                setInitial,
                addField,
                removeField,
                editField
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};