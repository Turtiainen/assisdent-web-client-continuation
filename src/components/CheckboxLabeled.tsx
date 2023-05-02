import { Label } from './Label';
import { InputHTMLAttributes } from 'react';

type CheckboxLabeled = {
    labelText?: string;
    labelClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const CheckboxLabeled = ({
    labelText,
    labelClassName,
    className,
    ...rest
}: CheckboxLabeled) => {
    return (
        <>
            <Label
                htmlFor={rest.id}
                className={` ${labelClassName ? labelClassName : ''}`}
            >
                {labelText ? labelText : ''}
            </Label>
            <input {...rest} className={`w-4 ${className ? className : ''}`} />
        </>
    );
};
