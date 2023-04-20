import React from 'react';

type badgeProps = {
    isActive?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
};

export const Badge = (props: badgeProps) => {
    const baseStyles = `select-none p-1 rounded-full w-6 h-6 text-sm flex justify-center items-center font-semibold`;
    const transitionStyles = `transition-[background-color] duration-[300ms] ease-out`;

    return (
        <button
            className={`${baseStyles} ${transitionStyles} ${
                props.isActive
                    ? 'text-white bg-ad-primary hover:bg-ad-primary-hover active:bg-ad-primary-pressed'
                    : 'hover:bg-ad-grey-200 active:bg-ad-grey-300 cursor-pointer'
            } ${props.className}`}
            onClick={props.onClick || undefined}
        >
            {props.children}
        </button>
    );
};
