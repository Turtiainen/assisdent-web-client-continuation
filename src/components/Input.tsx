import { InputHTMLAttributes } from 'react';
import { Label } from './Label';

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
                <svg
                    height="34"
                    viewBox="0 0 21 21"
                    width="34"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g
                        fill="blue"
                        fillRule="evenodd"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(2 2)"
                    >
                        <circle cx="8.5" cy="8.5" r="8" />
                        <path
                            d="m14.5 13.5c-.6615287-2.2735217-3.1995581-3.0251263-6-3.0251263-2.72749327 0-5.27073171.8688092-6 3.0251263"
                            fill="white"
                        />
                        <path
                            d="m8.5 2.5c1.6568542 0 3 1.34314575 3 3v2c0 1.65685425-1.3431458 3-3 3-1.65685425 0-3-1.34314575-3-3v-2c0-1.65685425 1.34314575-3 3-3z"
                            fill="white"
                        />
                    </g>
                </svg>
            ) : (
                <input
                    {...rest}
                    className={`lg:max-w-xs max-h-10 w-full border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                />
            )}
        </>
    );
};
