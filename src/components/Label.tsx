import { LabelHTMLAttributes } from 'react';

type Label = {
    // className?: string
} & LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className, children, ...rest }: Label) => {
    return (
        <label
            {...rest}
            className={`text-sm font-semibold text-ad-grey-800 flex items-center max-w-xs lg:w-2/5 ${
                className ? className : ''
            }`}
        >
            {children ? children : ''}
        </label>
    );
};
