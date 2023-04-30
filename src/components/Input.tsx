import { InputHTMLAttributes } from 'react';
import { Label } from './Label';
import InputTypeImage from './InputTypeImage.svg';

type Input = {
    labelText?: string;
    labelClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ labelText, labelClassName, ...rest }: Input) => {
    return (
        <>
            <Label htmlFor={rest.id} className={labelClassName}>
                {labelText ? labelText : ''}
            </Label>

            {rest.type === 'Image' ? (
                <InputTypeImage />
            ) : (
                <input
                    {...rest}
                    className={`lg:max-w-xs max-h-10 w-full border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                />
            )}
        </>
    );
};
