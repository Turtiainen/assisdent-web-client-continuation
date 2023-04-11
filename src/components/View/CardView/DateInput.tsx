import { useState } from 'react';
import { DateTypePrecision } from '../../../types/DateTypePrecision';
import { DynamicObject } from '../../../types/DynamicObject';

export const DateInput = ({
    element,
    content,
    inputProperties,
}: {
    element: DynamicObject;
    content: string | DynamicObject;
    inputProperties: DynamicObject;
}) => {
    // Check if date should be in format YYYY-MM or YYYY-MM-DD
    const inputType =
        DateTypePrecision[inputProperties.ElementProps.DateTypePrecision] ===
        'YearMonth'
            ? 'month'
            : 'date';

    // if inputType is date, then value should be content.toString().split('T')[0], otherwise only YYYY-MM
    const defaultDateValue = content.toString().split('T')[0];
    const [value, setValue] = useState(
        inputType === 'date'
            ? defaultDateValue
            : defaultDateValue.split('-')[0] +
                  '-' +
                  defaultDateValue.split('-')[1],
    );
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
                type={inputType}
                value={value}
                onChange={handleChange}
                className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
            />
        </div>
    );
};
