import { createPortal } from 'react-dom';

const targetElement: HTMLElement = document.getElementsByTagName('main')[0];

export const LoadingSpinner = () => {
    return (
        <>
            {targetElement &&
                createPortal(
                    <div
                        className={`absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white/70 z-50`}
                    >
                        <div className="w-12 h-12 rounded-full animate-spin border-2 border-solid border-blue-500 border-t-transparent" />
                    </div>,
                    targetElement,
                )}
        </>
    );
};
