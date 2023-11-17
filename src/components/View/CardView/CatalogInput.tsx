import { ChangeEvent, useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { Select } from '../../Select';
import { Input } from '../../Input';
import { InputRow } from '../../InputRow';
import { Label } from '../../Label';

export const CatalogInput = ({
    element,
    content,
    inputProperties,
    updateChangedTextInputValue,
}: {
    element: DynamicObject;
    content: string | DynamicObject | null | undefined;
    inputProperties: DynamicObject;
    updateChangedTextInputValue: (
        valueString: string,
        key: string,
        value: string | number | boolean | null,
    ) => void;
}) => {
    const [value, setValue] = useState<string>(content?.toString() || '');

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        e.persist();
        setValue(e.target.value);
        // Use catalog key value as value instead of "DisplayString".
        // Sometimes key is a number -> try converting to int.
        const keyInt = parseInt(e.target.value);
        updateChangedTextInputValue(
            element.attributes?.Value,
            element.attributes?.Identifier,
            isNaN(keyInt) ? e.target.value : keyInt,
        );
    };
    return (
        <InputRow>
            <Label htmlFor={element.attributes.Identifier} className={value}>
                {element.attributes.Caption ? element.attributes.Caption : ''}
            </Label>
            {inputProperties.Values ? (
                <Select
                    labelText={element.attributes.Caption}
                    id={element.attributes.Identifier}
                    value={value}
                    onChange={handleChange}
                >
                    {inputProperties.Values.map((option: DynamicObject) => (
                        <option key={option.Key} value={option.Key}>
                            {option.DisplayName}
                        </option>
                    ))}
                </Select>
            ) : (
                <Input
                    labelText={element.attributes.Caption}
                    id={element.attributes.Identifier}
                    type={inputProperties.Type}
                    value={value}
                    onChange={handleChange}
                />
            )}
        </InputRow>
    );
};
