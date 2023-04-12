import { useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { getEntitySchema } from '../../../temp/SchemaUtils';

export const BasicInput = ({
    element,
    content,
    inputProperties,
}: {
    element: DynamicObject;
    content: string | DynamicObject;
    inputProperties: DynamicObject;
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
                type={inputProperties.Type}
                value={value}
                onChange={handleChange}
                className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
            />
        </div>
    );
};
