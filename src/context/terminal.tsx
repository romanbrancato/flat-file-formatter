"use client"
import { ReactNode, RefObject, createContext, useContext, useRef, useState } from 'react';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';

interface TerminalContextType {
  value: string;
  setValue: (value: string) => void;
  focusTerminal: () => void;
  terminalRef: RefObject<ReactCodeMirrorRef>;
}

const TerminalContext = createContext<TerminalContextType>({
  value: '',
  setValue: () => {},
  focusTerminal: () => {},
  terminalRef: { current: null }
});

export const TerminalProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<string>('');
  const terminalRef = useRef<ReactCodeMirrorRef>(null);

  const focusTerminal = () => {
    const editorView = terminalRef.current?.view;
    if (editorView) {
      editorView.focus();
    }
  };
  
  return (
    <TerminalContext.Provider 
      value={{ 
        value, 
        setValue, 
        focusTerminal,
        terminalRef
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => useContext(TerminalContext);