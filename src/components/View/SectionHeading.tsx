import { ReactNode } from 'react';

type SectionHeadingProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
};

export const SectionHeading = ({
    children,
    className,
    onClick,
}: SectionHeadingProps) => {
    return (
        <h2
            className={`
                col-span-2 [column-span:all] text-lg uppercase text-ad-grey-700 mt-8 cursor-pointer hover:underline hover:bg-ad-primary-hover/10
                ${className}
            `}
            onClick={onClick && (() => onClick())}
        >
            {children}
        </h2>
    );
};
