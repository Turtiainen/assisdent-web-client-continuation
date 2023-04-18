import React, { useContext, useState } from 'react';

type ContextMenuData = {
    x: number;
    y: number;
    elements: { name: string; onClick: () => void }[];
};
type ContextMenuState = {
    updateContextMenu: (value: ContextMenuData) => void;
};

const ContextMenuContext = React.createContext<ContextMenuState>(
    {} as ContextMenuState,
);

export const useContextMenu = () => {
    return useContext(ContextMenuContext);
};

export default function ContextMenuProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, updateContextMenuState] = useState(
        {} as {
            x: number;
            y: number;
            elements: { name: string; onClick: () => void }[];
        },
    );

    // Calculate offset for context menu
    const calculateOffset = (x: number, y: number) => {
        const offset = 10;
        const width = 200;
        const height = 200;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (x + width > windowWidth) {
            x = windowWidth - width - offset;
        }

        if (y + height > windowHeight) {
            y = windowHeight - height - offset;
        }

        return { x, y };
    };

    return (
        <ContextMenuContext.Provider
            value={
                {
                    updateContextMenu: (value: ContextMenuData) => {
                        {
                            console.log(
                                'ContextMenuProvider.tsx: value: ',
                                value,
                            );
                            updateContextMenuState(value);
                        }
                    },
                } as ContextMenuState
            }
        >
            <div>
                {state.elements && (
                    <div
                        style={{
                            position: 'absolute',
                            top: state.y,
                            left: state.x,
                            backgroundColor: 'white',
                            border: '1px solid black',
                            borderRadius: '5px',
                            padding: '5px',
                        }}
                    >
                        {state.elements.map((element) => (
                            <div key={element.name} onClick={element.onClick}>
                                {element.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {children}
        </ContextMenuContext.Provider>
    );
}
