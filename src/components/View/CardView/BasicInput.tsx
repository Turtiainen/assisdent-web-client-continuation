import { ChangeEvent, useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { getEntitySchema } from '../../../temp/SchemaUtils';
import { Input } from '../../Input';
import { InputRow } from '../../InputRow';

export const BasicInput = ({
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
    const constructValuePrintStyle = (
        content: string | DynamicObject | null | undefined,
        valuePrintStyle: string | null | undefined,
    ) => {
        if (!content || !valuePrintStyle) {
            return '';
        }
        const data =
            typeof content === 'string' ? JSON.parse(content) : content;

        if (valuePrintStyle === 'Discount') {
            return `${parseFloat(data.Value) * 100}%`;
        }

        const result = valuePrintStyle.replace(/{{(.*?)}}/g, (_, key) => {
            const value = key
                .split('.')
                .reduce((obj: string, k: number) => obj?.[k], data);
            return value === undefined ? '' : value;
        });
        return result;
    };
    let defaultValue = content.toString();

    if (
        content &&
        typeof content === 'object' &&
        inputProperties.Type !== 'List'
    ) {
        const elementEntitySchema = getEntitySchema(inputProperties.Type);
        const valuePrintStyle =
            elementEntitySchema?.Metadata.Metadata.$Entity.ToString;
        defaultValue = constructValuePrintStyle(content, valuePrintStyle);
    }
    const [value, setValue] = useState<string>(defaultValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setValue(e.target.value);
    };

    return (
        <InputRow>
            <Input
                labelText={element.attributes.Caption}
                id={element.attributes.Identifier}
                type={inputProperties.Type}
                value={value}
                onChange={handleChange}
                className={`max-w-xs max-h-10 w-full border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                onBlur={(e) => {
                    e.preventDefault();
                    if (value !== defaultValue) {
                        updateChangedTextInputValue(
                            element.attributes.Value,
                            element.attributes.Identifier,
                            value,
                        );
                    }
                }}
            />
        </InputRow>
    );
};
