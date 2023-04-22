import { SHOW_ON_PAGE_OPTIONS, ShowOnPageOption } from '../../utils/constants';
import { ButtonHTMLAttributes } from 'react';

export type ShowOnPageProps = {
    buttonAttributes?: ButtonHTMLAttributes<HTMLButtonElement>;
    isSelected: (num: ShowOnPageOption) => boolean;
    handleSelect: (num: ShowOnPageOption) => void;
};

export const ShowOnPage = ({
    buttonAttributes,
    isSelected,
    handleSelect,
}: ShowOnPageProps) => {
    const selectedStyles = 'bg-ad-sidebar text-white';
    const notSelectedStyles = `
            hover:bg-neutral-300 
            [&:disabled]:bg-transparent 
            [&:disabled]:text-neutral-400 
            [&:disabled]:cursor-not-allowed`;

    return (
        <div className={`flex gap-4 items-center`}>
            <p>Näytä sivulla:</p>
            <ul className={`flex justify-center`}>
                {SHOW_ON_PAGE_OPTIONS.map((opt, idx) => {
                    return (
                        <li
                            key={idx}
                            className={`
                                mr-1 pr-1
                                border-r border-ad-grey-400
                                [&:last-child]:m-0
                                [&:last-child]:p-0
                                [&:last-child]:border-0`}
                        >
                            <button
                                className={`
                                    rounded-full
                                    font-semibold text-xs 
                                    w-6 h-6
                                    ${
                                        isSelected(opt)
                                            ? selectedStyles
                                            : notSelectedStyles
                                    }  
                                    ${
                                        buttonAttributes &&
                                        buttonAttributes.className
                                    } 
                                `}
                                disabled={
                                    buttonAttributes &&
                                    buttonAttributes.disabled
                                }
                                onClick={() => handleSelect(opt)}
                            >
                                {opt.toString()}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
