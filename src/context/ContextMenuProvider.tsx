import React, { useContext, useState } from 'react';

type ContextMenuState = {
    open: boolean;
    positionX: number;
    positionY: number;

    updateContextMenu: (
        open: boolean,
        positionX: number,
        positionY: number,

        elements: {
            name: string;
            onClick: () => void;
        }[],
    ) => void;

    elements: {
        name: string;
        onClick: () => void;
    }[];
};

const ContextMenuContext = React.createContext<ContextMenuState>({
    open: false,
    positionX: 0,
    positionY: 0,
    elements: [],

    updateContextMenu: () => {},
});

export const useContextMenu = () => {
    return useContext(ContextMenuContext);
};

export default function ContextMenuProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, updateContextMenu] = useState({
        open: false,
        positionX: 0,
        positionY: 0,
        elements: [],
    });

    return (
        <ContextMenuContext.Provider
            value={{
                open: state.open,
                positionX: state.positionX,
                positionY: state.positionY,

                elements: [],

                updateContextMenu: (open: boolean) => {
                    updateContextMenu({
                        ...state,
                        open,
                    });
                },
            }}
        >
            {children}
        </ContextMenuContext.Provider>
    );
}
