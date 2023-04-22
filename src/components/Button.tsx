import React from 'react';

export type ButtonProps = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    buttonType?: 'primary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    onClick,
    children,
    className,
    buttonType,
    ...props
}: ButtonProps) {
    const isPrimary = buttonType === 'primary';
    const baseStyles = `inline-flex items-center px-3 rounded text-sm ${
        isPrimary ? 'bg-ad-primary text-white' : 'border border-gray-700'
    }`;
    const transitionStyles =
        'transition-[background-color_color_border-color] duration-[300ms] ease-in-out';
    const pseudoClassStyles = `${
        isPrimary
            ? 'hover:bg-ad-primary-hover active:bg-ad-primary-pressed'
            : 'hover:border-ad-primary hover:text-ad-primary active:bg-ad-grey-200'
    }`;
    const focusStyles = `focus:outline-none focus-visible:ring ${
        isPrimary
            ? 'focus-visible:ring-ad-subtitle'
            : 'focus-visible:ring-ad-primary'
    }`;
    const disabledStyles =
        '[&:disabled]:bg-ad-grey-100 [&:disabled]:border-0 [&:disabled]:text-ad-grey-500';

    return (
        <button
            onClick={onClick}
            data-testid="button"
            className={`${baseStyles} ${pseudoClassStyles} ${focusStyles} ${disabledStyles} ${transitionStyles} ${
                className && className
            }`}
            {...props}
        >
            {children}
        </button>
    );
}
