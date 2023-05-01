import { Label } from './Label';
import { SelectHTMLAttributes } from 'react';

type Select = {
    labelText?: string;
    labelClassName?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({
    className,
    children,
    labelText,
    labelClassName,
    ...rest
}: Select) => {
    return (
        <>
            <Label htmlFor={rest.id} className={labelClassName}>
                {labelText ? labelText : ''}
            </Label>

            <select
                {...rest}
                className={`lg:max-w-xs max-h-10 w-full border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none ${
                    className ? className : ''
                }`}
            >
                {children}
            </select>
        </>
    );
};
