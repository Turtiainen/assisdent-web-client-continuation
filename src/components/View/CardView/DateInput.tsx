import { ChangeEvent, useState } from 'react';
import { DateTypePrecision } from '../../../types/DateTypePrecision';
import { DynamicObject } from '../../../types/DynamicObject';
import { Input } from '../../Input';
import { InputRow } from '../../InputRow';

export const DateInput = ({
    element,
    content,
    inputProperties,
    updateChangedTextInputValue,
}: {
    element: DynamicObject;
    content: string | DynamicObject;
    inputProperties: DynamicObject;
    updateChangedTextInputValue: (
        valueString: string,
        key: string,
        value: string | number | boolean | null,
    ) => void;
}) => {
    // Check if date should be in format YYYY-MM or YYYY-MM-DD
    const inputType =
        DateTypePrecision[inputProperties.ElementProps.DateTypePrecision] ===
        'YearMonth'
            ? 'month'
            : 'date';

    // if inputType is date, then value should be content.toString().split('T')[0], otherwise only YYYY-MM
    const defaultDateValue = content.toString().split('T')[0];
    const [value, setValue] = useState<string>(
        inputType === 'date'
            ? defaultDateValue
            : defaultDateValue.split('-')[0] +
                  '-' +
                  defaultDateValue.split('-')[1],
    );
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setValue(e.target.value);
        updateChangedTextInputValue(
            element.attributes?.Value,
            element.attributes?.Identifier,
            //pass in null if date field is emptied (value = "") so that the api can handle it properly
            e.target.value || null,
        );
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
