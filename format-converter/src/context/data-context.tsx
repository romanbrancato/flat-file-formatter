"use client"
import {createContext, ReactNode, useReducer} from 'react';

interface DataContextProps {
    data: Record<string, unknown>[];
    setData: (data: Record<string, unknown>[]) => void;
    addField: (name: string, value: string) => void;
    removeField: (field: string) => void;
    editField: (field: string, value: string) => void;
    arrangeFields: (order: string[]) => void;
    children?: ReactNode;
}

const dataReducer = (state: Record<string, unknown>[], action: any) => {
    switch (action.type) {
        case 'SET_DATA':
            return action.data;
        case 'ADD_FIELD':
            return state.map((row) => ({ ...row, [action.name]: action.value }));
        case 'REMOVE_FIELD':
            return state.map((row) => {
                delete row[action.field];
                return row;
            });
        case 'EDIT_FIELD':
            return state.map((row) => {
                row[action.field] = action.value;
                return row;
            });
        case 'ARRANGE_FIELDS':
            return state.map((record) => {
                const reorderedRecord: Record<string, unknown> = {};
                action.order.forEach((field: string) => {
                    if (field in record) {
                        reorderedRecord[field] = record[field];
                    }
                });
                return reorderedRecord;
            });
        default:
            return state;
    }
};

export const DataContext = createContext<DataContextProps>({
    data: [],
    setData: () => {},
    addField: () => {},
    removeField: () => {},
    editField: () => {},
    arrangeFields: () => {},
});

export const DataContextProvider = (props: DataContextProps) => {
    const [data, dispatch] = useReducer(dataReducer, []);
    const setData = (data: Record<string, unknown>[]) => {
        dispatch({ type: 'SET_DATA', data: data });
    };

    const addField = (name: string, value: string) => {
        dispatch({ type: 'ADD_FIELD', name, value });
    };

    const removeField = (field: string) => {
        dispatch({ type: 'REMOVE_FIELD', field });
    };

    const editField = (field: string, value: string) => {
        dispatch({ type: 'EDIT_FIELD', field, value });
    };

    const arrangeFields = (order: string[]) => {
        dispatch({ type: 'ARRANGE_FIELDS', order });
    };

    return (
        <DataContext.Provider
            value={{
                data,
                setData,
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