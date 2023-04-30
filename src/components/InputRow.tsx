import { HTMLAttributes } from 'react';

type InputRow = HTMLAttributes<HTMLDivElement>;

export const InputRow = ({ className, children, ...rest }: InputRow) => {
    return (
        <div
            {...rest}
            className={`flex flex-col xl:flex-row mb-4 ${
                className ? className : ''
            }`}
        >
            {children}
        </div>
    );
};
