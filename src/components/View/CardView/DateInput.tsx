import { ChangeEvent, useState } from 'react';
import { DateTypePrecision } from '../../../types/DateTypePrecision';
import { DynamicObject } from '../../../types/DynamicObject';
import { Input } from '../../Input';
import { InputRow } from '../../InputRow';

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
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setValue(e.target.value);
    };

    return (
        <InputRow>
            <Input
                labelText={element.attributes.Caption}
                id={element.attributes.Identifier}
                type={inputType}
                value={value}
                onChange={handleChange}
            />
        </InputRow>
    );
};
