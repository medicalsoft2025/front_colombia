import React from "react";
import { PersistentQueryProvider } from "./PersistentQueryProvider";

interface AppWrapperProps {
    children: React.ReactNode;
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
    return (<>
        <PersistentQueryProvider>
            {children}
        </PersistentQueryProvider>
    </>);
};