import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

type applicationBarProps = {
    children: React.ReactNode;
    className?: string;
};

export const ApplicationBar = (props: applicationBarProps) => {
    const [mainElement, setMainElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const mainEl = document.querySelector('main');
        setMainElement(mainEl);
    }, []);

    if (!mainElement) {
        return null;
    }

    return createPortal(
        <div
            className={`toolbar bg-white border-t-2 border-ad-blue-600 fixed bottom-px px-4 w-full ${
                props.className && props.className
            }`}
        >
            {props.children}
        </div>,
        mainElement,
    );
};
