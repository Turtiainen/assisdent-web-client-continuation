import { useState } from 'react';
import { getCatalogType } from '../../../temp/SchemaUtils';
import { DynamicObject } from '../../../types/DynamicObject';

export const CatalogInput = ({
    element,
    content,
    propertyType,
}: {
    element: DynamicObject;
    content: string | DynamicObject | null | undefined;
    propertyType: string | undefined;
}) => {
    const [value, setValue] = useState<string>(content?.toString() || '');
    const catalog = propertyType && getCatalogType(propertyType);

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
                onChange={(e) => setValue(e.target.value)}
            >
                {catalog &&
                    catalog.Entries.map((option: DynamicObject) => (
                        <option key={option.Key} value={option.Key}>
                            {option.DisplayName}
                        </option>
                    ))}
            </select>
        </div>
    );
};
