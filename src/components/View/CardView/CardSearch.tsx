import { useEffect, useState } from 'react';
import { getEntitySchema } from '../../../temp/SchemaUtils';
import { DynamicObject } from '../../../types/DynamicObject';
import {
    getUserLanguage,
    resolveCardBindings,
    sanitizeBinding,
} from '../../../utils/utils';
import { useMutation } from '@tanstack/react-query';
import { getEntityData } from '../../../services/backend';

export const CardSearch = ({
    element,
    cardData,
    entityType,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
    entityType: string | null;
}) => {
    const getPrintStyleFromEntitySchema = (
        entityName: string,
    ): string | null => {
        const foundObject = getEntitySchema(entityName);
        if (foundObject) {
            return foundObject.Metadata.Metadata.$Entity.ToString;
        }
        return null;
    };

    const constructValuePrintStyle = (
        content: string | DynamicObject | null | undefined,
        valuePrintStyle: string | null | undefined,
    ) => {
        if (!content || !valuePrintStyle) {
            return '';
        }
        const data =
            typeof content === 'string' ? JSON.parse(content) : content;
        const result = valuePrintStyle.replace(/{{(.*?)}}/g, (_, key) => {
            const value = key
                .split('.')
                .reduce((obj: string, k: number) => obj?.[k], data);
            return value === undefined ? '' : value;
        });
        return result;
    };

    // TODO is this ok and does not break anything?
    const content = cardData
        ? resolveCardBindings(cardData, element.attributes.Value)
        : '';
    const valuePrintStyle =
        entityType && getPrintStyleFromEntitySchema(entityType);
    const contentValue = constructValuePrintStyle(content, valuePrintStyle);
    const [value, setValue] = useState<string>(contentValue);
    const [options, setOptions] = useState<DynamicObject>([]);

    const searchParameters = {
        EntityType: entityType,
        Take: 10,
        PropertiesToSelect: ['**'],
        SearchLanguage: getUserLanguage(),
    };

    const mutation = useMutation({
        mutationFn: getEntityData,
        onError: (error) => {
            console.log(
                'error @CardSearch mutation :>> ',
                error,
                element.attributes.Caption,
                ' Used searchParameters :>> ',
                searchParameters,
            );
        },
        onSuccess: (searchOptions) => {
            if (searchOptions && searchOptions.Results)
                setOptions(searchOptions.Results ?? []);
        },
    });

    useEffect(() => {
        if (entityType !== 'List') {
            //console.log(
            //    element.attributes.Caption,
            //    ' searchParameters :>> ',
            //    searchParameters,
            //);
            mutation.mutate(searchParameters);
        } else {
            console.log(element.attributes.Caption, ' is a list');
        }
    }, []);
    return (
        <div className={`flex flex-col lg:flex-row lg:gap-32`}>
            <label
                htmlFor={element.attributes.Identifier}
                className={`text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4`}
            >
                {element.attributes.Caption}
            </label>
            <select
                id={element.attributes.Identifier}
                value={value}
                className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                placeholder={element.attributes.Caption}
                //disabled={isDisabled}
            >
                {options.map((option: DynamicObject) => (
                    <option
                        key={option.Id}
                        value={constructValuePrintStyle(
                            option,
                            valuePrintStyle,
                        )}
                    >
                        {constructValuePrintStyle(option, valuePrintStyle)}
                    </option>
                ))}
                <option
                    key="currentValue"
                    value={value}
                    className="font-lg semi-bold bg-ad-primary"
                >
                    {value}
                </option>
            </select>
        </div>
    );
};
