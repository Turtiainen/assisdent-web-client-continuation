import { useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { getEntitySchema } from '../../../temp/SchemaUtils';
import { sanitizeBinding } from '../../../utils/utils';
import { getAssociationType } from '../../../utils/associationUtils';
import { checkIfObjectHasNestedProperty } from '../../../utils/objectUtils';

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
        value: string,
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
            {inputProperties.Type === 'Image' ? (
                <svg
                    height="34"
                    viewBox="0 0 21 21"
                    width="34"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g
                        fill="blue"
                        fillRule="evenodd"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(2 2)"
                    >
                        <circle cx="8.5" cy="8.5" r="8"></circle>
                        <path
                            d="m14.5 13.5c-.6615287-2.2735217-3.1995581-3.0251263-6-3.0251263-2.72749327 0-5.27073171.8688092-6 3.0251263"
                            fill="white"
                        ></path>
                        <path
                            d="m8.5 2.5c1.6568542 0 3 1.34314575 3 3v2c0 1.65685425-1.3431458 3-3 3-1.65685425 0-3-1.34314575-3-3v-2c0-1.65685425 1.34314575-3 3-3z"
                            fill="white"
                        ></path>
                    </g>
                </svg>
            ) : (
                <input
                    id={element.attributes.Identifier}
                    type={inputProperties.Type}
                    value={value}
                    onChange={handleChange}
                    className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                    onBlur={(e) => {
                        e.preventDefault();
                        if (value && value !== defaultValue) {
                            updateChangedTextInputValue(
                                element.attributes.Value,
                                element.attributes.Identifier,
                                value,
                            );
                        }
                    }}
                />
            )}
        </div>
    );
};
