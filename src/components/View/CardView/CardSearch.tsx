import { useEffect, useState, useMemo, ChangeEvent } from 'react';
import { getEntitySchema } from '../../../temp/SchemaUtils';
import { DynamicObject } from '../../../types/DynamicObject';
import { getUserLanguage, resolveCardBindings } from '../../../utils/utils';
import { useMutation } from '@tanstack/react-query';
import { getEntityData } from '../../../services/backend';
import { Select } from '../../Select';
import { InputRow } from '../../InputRow';
import { Label } from '../../Label';
import { searchMenuImage } from '../../../assets/ExportImages';

interface IProps {
    element: DynamicObject;
    cardData: DynamicObject | null;
    entityType: string | null;
    viewName: string | null;
    elementIdentifier: string | null;
    updateChangedTextInputValue: (
        valueString: string,
        key: string,
        value: string | number | boolean | null,
    ) => void;
}

export const CardSearch = ({
    element,
    cardData,
    entityType,
    viewName,
    elementIdentifier,
    updateChangedTextInputValue,
}: IProps) => {
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

    const content = cardData
        ? resolveCardBindings(cardData, element.attributes.Value, entityType)
        : '';
    const valuePrintStyle =
        entityType && getPrintStyleFromEntitySchema(entityType);
    const contentValue = constructValuePrintStyle(content, valuePrintStyle);

    const [value, setValue] = useState<string>(contentValue);
    const [options, setOptions] = useState<DynamicObject>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const searchParameters = {
        EntityType: entityType,
        Purpose: 'QuickSearch',
        PurposeArgs: {},
        SearchLanguage: getUserLanguage(),
    };

    if (viewName != '' && elementIdentifier != '') {
        searchParameters.PurposeArgs = {
            ViewName: viewName,
            ElementIdentifier: elementIdentifier,
        };
    }

    const mutation = useMutation({
        mutationFn: getEntityData,
        onError: (error) => {
            console.error(
                'error @CardSearch mutation :>> ',
                error,
                element.attributes.Caption,
                ' Used searchParameters :>> ',
                searchParameters,
            );
        },
        onSuccess: (searchOptions) => {
            if (searchOptions && searchOptions.Results) {
                if (valuePrintStyle) {
                    //Include addiitonal attribute 'contentValue' that has the resolved printStyle
                    searchOptions.Results.forEach((option: DynamicObject) => {
                        option.contentValue = constructValuePrintStyle(
                            option,
                            valuePrintStyle,
                        );
                    });
                }
                setOptions(searchOptions.Results);
            }
        },
    });

    // Show/hide search input
    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    useEffect(() => {
        if (entityType !== 'List') {
            mutation.mutate(searchParameters);
        } else {
            console.log(element.attributes.Caption, ' is a list');
        }
    }, []);

    // Handle filtering of the options depending on user input text
    const filteredOptions = useMemo(() => {
        if (isSearchVisible) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            return options.filter((option: string) =>
                constructValuePrintStyle(option, valuePrintStyle)
                    .toLowerCase()
                    .includes(lowercasedSearchTerm),
            );
        } else {
            return options;
        }
    }, [options, searchTerm, isSearchVisible]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);

        //Find selected option based on the contentValue (formatted string)
        const selected = options?.find(
            (option: DynamicObject) => option?.contentValue === e.target.value,
        );
        if (selected) {
            //delete contentValue attribute so that the object is in its original format for saving
            const tmpValue = { ...selected };
            delete tmpValue.contentValue;

            updateChangedTextInputValue(
                element.attributes?.Value,
                element.attributes?.Identifier,
                tmpValue,
            );
        }
    };

    return (
        <InputRow>
            <Label htmlFor={element.attributes.Identifier} className={value}>
                {element.attributes.Caption ? element.attributes.Caption : ''}
            </Label>

            <div className="lg:max-w-xs w-full relative">
                <Select
                    labelText={element.attributes.Caption}
                    id={element.attributes.Identifier}
                    value={value}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    placeholder={element.attributes.Caption}
                >
                    {filteredOptions.map((option: DynamicObject) => (
                        <option key={option.Id} value={option?.contentValue}>
                            {option?.contentValue}
                        </option>
                    ))}
                    <option
                        key="currentValue"
                        value={value}
                        className="font-sm semi-bold bg-ad-primary"
                    >
                        {value}
                    </option>
                </Select>
                <div className="absolute right-0 top-0 bottom-0">
                    <button
                        onClick={toggleSearch}
                        className="bg-ad-sidebar h-8"
                    >
                        <div className="px-2 py-2 max-h-10 w-7">
                            <img src={searchMenuImage} />
                        </div>
                    </button>
                </div>
                {isSearchVisible && (
                    <input
                        className=" max-h-10 w-full border border-ad-grey-300 px-2 py-1 absolute -bottom-8 right-0"
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}
            </div>
        </InputRow>
    );
};
