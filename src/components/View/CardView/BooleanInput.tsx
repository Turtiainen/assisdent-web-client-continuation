import { useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';

export const BooleanInput = ({
    element,
    content,
}: {
    element: DynamicObject;
    content: string | DynamicObject | null | undefined;
}) => {
    const [checked, setChecked] = useState<boolean>(
        content?.toString() === 'true',
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setChecked(!checked);
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
                type={`checkbox`}
                checked={checked}
                onChange={handleChange}
            />
        </div>
    );
};
