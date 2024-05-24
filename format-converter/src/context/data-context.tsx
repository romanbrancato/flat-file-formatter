"use client"
import {createContext, ReactNode, useReducer, useState} from 'react';
import {Preset} from "@/types/preset";

interface DataContextProps {
    data: Record<string, unknown>[];
    preset: Preset;
    setData: (data: Record<string, unknown>[]) => void;
    addField: (name: string, value: string) => void;
    removeField: (field: string) => void;
    editField: (field: string, value: string) => void;
    arrangeFields: (order: string[]) => void;
    loadPreset: (preset: Preset) => void;
    savePreset: (name: string) => void;
    exportPreset: () => void;
}

export const DataContext = createContext<DataContextProps>({
    data: [],
    preset: {} as Preset,
    setData: () => {},
    addField: () => {},
    removeField: () => {},
    editField: () => {},
    arrangeFields: () => {},
    loadPreset: () => {},
    savePreset: () => {},
    exportPreset: () => {}
});

interface DataProviderProps {
    children: ReactNode;
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


export const DataContextProvider = ({children}: DataProviderProps) => {
    const [data, dispatch] = useReducer(dataReducer, []);
    const [preset, setPreset] = useState<Preset>(
        {
            name: null,
            removed: null,
            added: null,
            edited: null,
            order: [],
            export: "csv",
            widths: null,
            symbol: null
        }
    );

    const setData = (data: Record<string, unknown>[]) => {
        dispatch({ type: 'SET_DATA', data: data });
        setPreset(prev => ({...prev, order: Object.keys(data[0] || {})}));
    };

    const addField = (name: string, value: string) => {
        dispatch({ type: 'ADD_FIELD', name, value });
        setPreset(prev => ({...prev, added: [...prev.added || [], {field: name, value}]}));
    };

    const removeField = (field: string) => {
        dispatch({ type: 'REMOVE_FIELD', field });
        setPreset(prev => ({...prev, removed: [...prev.removed || [], field]}));
    };

    const editField = (field: string, value: string) => {
        dispatch({ type: 'EDIT_FIELD', field, value });
        setPreset(prev => ({...prev, edited: [...prev.edited || [], {field, value}]}));
    };

    const arrangeFields = (order: string[]) => {
        dispatch({ type: 'ARRANGE_FIELDS', order });
        setPreset(prev => ({...prev, order}));
    };

    const loadPreset = (preset: Preset) => {
        console.log(preset)
        setPreset(prev => ({...prev, export: preset.export}));
        setPreset(prev => ({...prev, symbol: preset.symbol}));
        preset.removed?.forEach(field => removeField(field));
        preset.added?.forEach(({field, value}) => addField(field, value));
        preset.edited?.forEach(({field, value}) => editField(field, value));
        preset.order && arrangeFields(preset.order);
    }

    const savePreset = (name: string) => {
        setPreset(prev => ({...prev, name}));
        // Save preset to local storage
    }

    const exportPreset = () => {
        console.log(JSON.stringify(preset, null, 2))
    }

    return (
        <DataContext.Provider
            value={{
                data,
                preset,
                setData,
                addField,
                removeField,
                editField,
                arrangeFields,
                loadPreset,
                savePreset,
                exportPreset
            }}
        >
            {children}
        </DataContext.Provider>
    );
};