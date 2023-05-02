import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

type ContextMenu = {
    x: number;
    y: number;
};

type ContextMenuState = {
    openMenu: (
        evt: React.MouseEvent,
        elements: { name: string; onClick: () => void; selected?: boolean }[],
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

        const rect = currentTarget.getBoundingClientRect();
        updateContextMenuState(calculateOffset(rect.x, rect.y + rect.height));
    };

    const handleCloseMenu = (evt: MouseEvent) => {
        if (!menuEl.current?.contains(evt.target as HTMLElement)) {
            evt.stopPropagation();
            setIsOpen(false);
            setCurrentTarget(null);
            setMenuItems([]);
            document.removeEventListener('click', handleCloseMenu, true);
        }
    };

    const calculateMenuPosition = (targetElement: HTMLElement) => {
        const rect = targetElement.getBoundingClientRect();
        const targetOffsetX = rect.x;
        const targetOffsetY = rect.y + rect.height;

        updateContextMenuState(calculateOffset(targetOffsetX, targetOffsetY));
    };

    const handleOpenMenu = (
        evt: React.MouseEvent,
        elements: { name: string; onClick: () => void }[],
    ) => {
        if (isOpen) return;
        setMenuItems(elements);
        setCurrentTarget(evt.target as HTMLElement);
        calculateMenuPosition(evt.target as HTMLElement);
        setIsOpen(true);
        document.addEventListener('click', handleCloseMenu, true);
    };

    // These will be shared globally via useContextState
    const menuCtx: ContextMenuState = {
        openMenu: handleOpenMenu,
    };

    useEffect(() => {
        window.addEventListener('resize', rePosition);
        return () => {
            window.removeEventListener('resize', rePosition);
        };
    });

    return (
        <ContextMenuContext.Provider value={menuCtx}>
            {isOpen && menuItems.length > 0 && (
                <div
                    ref={menuEl}
                    className={`absolute bg-white border border-black rounded items-start shadow-md min-w-[12rem] z-40`}
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
                            className={`block px-2 py-1 w-full text-left hover:bg-ad-grey-100 [&:first-child]:rounded-t [&:last-child]:rounded-b`}
                            onClick={element.onClick}
                        >
                            {element.name}
                        </button>
                    ))}
                </div>
            )}
            {children}
        </ContextMenuContext.Provider>
    );
}
