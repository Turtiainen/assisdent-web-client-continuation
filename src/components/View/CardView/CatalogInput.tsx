import { ChangeEvent, useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { Select } from '../../Select';
import { Input } from '../../Input';
import { InputRow } from '../../InputRow';

export const CatalogInput = ({
    element,
    content,
    inputProperties,
}: {
    element: DynamicObject;
    content: string | DynamicObject | null | undefined;
    inputProperties: DynamicObject;
}) => {
    const [value, setValue] = useState<string>(content?.toString() || '');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setValue(e.target.value);
    };

    return (
        <InputRow>
            {inputProperties.Values ? (
                <Select
                    labelText={element.attributes.Caption}
                    id={element.attributes.Identifier}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
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
