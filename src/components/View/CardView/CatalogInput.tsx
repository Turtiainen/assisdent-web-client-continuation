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
    let catalog = propertyType && getCatalogType(propertyType);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setValue(e.target.value);
    };

    if (element.attributes.Identifier === 'Gender') {
        catalog = getCatalogType('GenderType');
    }

    return (
        <div className={`flex flex-col lg:flex-row lg:gap-32`}>
            <label
                htmlFor={element.attributes.Identifier}
                className={`text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4`}
            >
                {element.attributes.Caption}
            </label>
            {catalog && catalog.Entries && catalog.Entries.length > 0 ? (
                <select
                    id={element.attributes.Identifier}
                    value={value}
                    className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                >
                    {catalog.Entries.map((option: DynamicObject) => (
                        <option key={option.Key} value={option.Key}>
                            {option.DisplayName}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={element.attributes.Identifier}
                    type={typeof content}
                    value={value}
                    onChange={handleChange}
                    className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                />
            )}
        </div>
    );
};
