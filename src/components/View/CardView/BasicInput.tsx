import { useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';

export const BasicInput = ({
    element,
    content,
}: {
    element: DynamicObject;
    content: string | DynamicObject;
}) => {
    // create a state (with types) for the input value, and a function to update it
    const [value, setValue] = useState<string>(content.toString());

    // create a function to handle the input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setValue(e.target.value);
    };

    return (
        <div className={`flex flex-col lg:flex-row lg:gap-32`}>
            <label
                htmlFor={element.attributes.Identifier}
                className={`text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4`}
            >
                {element.attributes.Caption}
            </label>
            <input
                id={element.attributes.Identifier}
                type={typeof content}
                value={value}
                onChange={handleChange}
                className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
            />
        </div>
    );
};
