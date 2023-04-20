import { createPortal } from 'react-dom';

type footerProps = {
    children: React.ReactNode;
    className?: string;
};

const mainElement = document.querySelector('main');

export const Footer = (props: footerProps) => {
    return (
        mainElement &&
        createPortal(
            <div
                className={`toolbar bg-white border-t-2 border-ad-blue-600 absolute bottom-px px-4 ${
                    props.className && props.className
                }`}
            >
                {props.children}
            </div>,
            mainElement,
        )
    );
};
