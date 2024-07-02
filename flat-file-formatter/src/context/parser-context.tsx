import React, {createContext} from 'react';
import {useParser} from "@/hooks/useParser";

export const ParserContext = createContext<ReturnType<typeof useParser>>({
    isReady: false,
    setParams: () => {},
    data: [],
    removeField: () => {},
    addField: () => {},
    orderFields: () => {},
    editHeader: () => {},
    runFunction: () => {}
});


export const ParserProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <ParserContext.Provider value={useParser()}>
            {children}
        </ParserContext.Provider>
    );
};