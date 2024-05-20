"use client"
import {createContext, useState} from 'react';

interface DataContextProps {
    data: Record<string, unknown>[];
    initialFields: string[]; // Keeps track of initial shape of data
    setData: (data: Record<string, unknown>[]) => void;
    setInitialFields: (data: string[]) => void;
    addField: (name: string, value: string) => void;
    removeField: (field: string) => void;
    editField: (field: string, value: string) => void;
    arrangeFields: (newFieldOrder: string[]) => void;
}

export const DataContext = createContext<DataContextProps>({
    data: [],
    initialFields: [],
    setData: () => {
    },
    setInitialFields: () => {
    },
    addField: () => {
    },
    removeField: () => {
    },
    editField: () => {
    },
    arrangeFields: () => {
    }
});

export const DataContextProvider = (props: any) => {
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [initialFields, setInitialFields] = useState<string[]>([]);

    const addField = (name: string, value: string) => {
        const newData = data.map((row) => {
            return {
                ...row,
                [name]: value
            };
        });
        setData(newData);
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

    const arrangeFields = (newFieldOrder: string[]) => {
        // Map over each record in data
        const newData = data.map((record) => {
            // Create a new object to store the reordered keys
            const reorderedRecord: Record<string, unknown> = {};
            // Iterate over the new field order
            newFieldOrder.forEach((fieldName) => {
                // Check if the field exists in the original record
                if (fieldName in record) {
                    // Add the field to the reordered record
                    reorderedRecord[fieldName] = record[fieldName];
                }
            });
            return reorderedRecord;
        });
        // Update the data state with the reordered records
        setData(newData);
    };

    return (
        <DataContext.Provider
            value={{
                data,
                initialFields: initialFields,
                setData,
                setInitialFields: setInitialFields,
                addField,
                removeField,
                editField,
                arrangeFields
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
};