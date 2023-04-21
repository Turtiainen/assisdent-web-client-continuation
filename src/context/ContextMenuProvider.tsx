import React, { useContext, useEffect, useRef, useState } from 'react';

type ContextMenu = {
    x: number;
    y: number;
};

type ContextMenuState = {
    handleOpenMenu: (
        evt: React.MouseEvent,
        elements: { name: string; onClick: () => void }[],
    ) => void;
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
    const [state, updateContextMenuState] = useState<ContextMenu>();
    const [menuItems, setMenuItems] = useState<
        { name: string; onClick: () => void }[]
    >([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentTarget, setCurrentTarget] = useState<HTMLElement | null>(
        null,
    );

    const menuEl = useRef<HTMLDivElement>(null);

    // Calculate offset for context menu
    const calculateOffset = (x: number, y: number) => {
        const offset = 10;
        const width = menuEl.current?.clientWidth || 200;
        const height = menuEl.current?.clientHeight || 200;

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

    const rePosition = () => {
        if (currentTarget === null) return;

        updateContextMenuState(
            calculateOffset(
                currentTarget.getBoundingClientRect().x,
                currentTarget.getBoundingClientRect().y +
                    currentTarget.getBoundingClientRect().height,
            ),
        );
    };

    const handleCloseMenu = (evt: MouseEvent) => {
        if (!menuEl.current?.contains(evt.target as HTMLElement)) {
            setIsOpen(false);
            setCurrentTarget(null);
            setMenuItems([]);
            evt.stopPropagation();
            document.removeEventListener('click', handleCloseMenu, true);
        }
    };

    const handleOpenMenu = (
        evt: React.MouseEvent,
        elements: { name: string; onClick: () => void }[],
    ) => {
        if (isOpen) return;
        setMenuItems(elements);
        setCurrentTarget(evt.target as HTMLElement);
        const eventTarget = evt.target as HTMLElement;
        const targetOffsetX = eventTarget.getBoundingClientRect().x;
        const targetOffsetY =
            eventTarget.getBoundingClientRect().y +
            eventTarget.getBoundingClientRect().height;

        updateContextMenuState(calculateOffset(targetOffsetX, targetOffsetY));

        setIsOpen(true);
        document.addEventListener('click', handleCloseMenu, true);
    };

    const menuCtx: ContextMenuState = {
        handleOpenMenu: handleOpenMenu,
    };

    useEffect(() => {
        window.addEventListener('resize', rePosition);

        return () => {
            window.removeEventListener('resize', rePosition);
        };
    });

    return (
        <>
            {menuItems && (
                <ContextMenuContext.Provider value={menuCtx}>
                    <div
                        ref={menuEl}
                        className={`absolute bg-white border border-black items-start shadow min-w-[8rem] ${
                            isOpen ? 'z-50 opacity-100' : '-z-1 opacity-0'
                        } transition-[opacity] duration-300 ease-out`}
                        style={
                            state && {
                                top: state.y,
                                left: state.x,
                            }
                        }
                    >
                        {menuItems.map((element) => (
                            <button
                                key={element.name}
                                className={`block px-2 w-full text-left hover:bg-ad-primary-hover hover:text-white`}
                                onClick={element.onClick}
                            >
                                {element.name}
                            </button>
                        ))}
                    </div>

                    {children}
                </ContextMenuContext.Provider>
            )}
        </>
    );
}
