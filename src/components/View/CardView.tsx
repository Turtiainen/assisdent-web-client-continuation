import { DynamicObject } from '../../types/DynamicObject';
import { ErrorPage } from '../ErrorPage';
import { getViewModelData, putEntityData } from '../../services/backend';
import { LoadingSpinner } from '../LoadingSpinner';
import { parseCardMetaView } from '../../utils/Parser';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import React, { Key, useEffect, useState } from 'react';
import { ViewHeader } from './ViewHeader';
import {
    getUserLanguage,
    resolveCardBindings,
    sanitizeBinding,
} from '../../utils/utils';
import { getEntityPropertiesSchema } from '../../temp/SchemaUtils';
import { List } from './List';
import { TranslationList } from './TranslationList';
import { SectionHeading } from './SectionHeading';
import Button from '../Button';
import { log } from 'handlebars';
import { recursivelyLogEntityKeysAndValues } from '../../temp/debuggers';

export type DataProps = {
    view: Element;
};

type ElementAttributesType = {
    __id: string;
    [index: string]: string;
};

type CardElementType = {
    name: 'Group' | 'List' | 'Element';
    attributes: ElementAttributesType;
    [index: string]: unknown;
};

export const CardView = ({ view }: DataProps) => {
    const [cardData, setCardData] = useState<DynamicObject | null>(null);
    const [changedValues, setChangedValues] = useState<Array<DynamicObject>>(
        [],
    );

    // const { viewId } = useParams();
    const { Id } = useParams();

    const parsedCardMetaView = parseCardMetaView(view);
    const argumentType = view.getAttribute('ArgumentType');
    const userLanguage = getUserLanguage();
    const argument = {
        Id: Id,
    };
    const viewName = view.getAttribute('Name');
    const EntityType = view.getAttribute('EntityType');
    const EntityPropertySchema = getEntityPropertiesSchema(EntityType);
    const Header = view.getAttribute('Header');
    let resolvedHeader: string | null;

    if (Header?.includes('{')) {
        resolvedHeader =
            cardData &&
            Header &&
            (resolveCardBindings(cardData, Header) as string);
    } else {
        resolvedHeader = Header;
    }

    const SubHeader = view.getAttribute('SubHeader');
    let resolvedSubHeader: string | null;

    if (SubHeader?.includes('{')) {
        resolvedSubHeader =
            cardData &&
            SubHeader &&
            (resolveCardBindings(cardData, SubHeader) as string);
    } else {
        resolvedSubHeader = SubHeader;
    }

    // Data structure for possible exceptions like Translations table
    const exceptionElements = new Set<string>();
    const ExceptionEntityTypes = new Set([
        'Translation',
        'TranslationCollection',
    ]);

    const entityPropertiesAndTypes = new Map<string, string>();

    // Find possible known exceptions from Schema
    if (EntityPropertySchema) {
        Object.entries(EntityPropertySchema as DynamicObject).forEach(
            (property) => {
                const key = property[0];
                const val = property[1];

                if (
                    val.Type === 'List' &&
                    val.SubType &&
                    ExceptionEntityTypes.has(val.SubType.Type)
                ) {
                    exceptionElements.add(key);
                }

                entityPropertiesAndTypes.set(key, val.Type);
            },
        );
    }

    const getPath = (bindingExpression: string) => {
        const path = bindingExpression
            .replace('{Binding ', '')
            .replace('}', '');
        return path.split('.');
    };

    const viewModelSearchOptions = {
        ViewName: viewName,
        ArgumentType: argumentType,
        Argument: argument,
        SearchLanguage: userLanguage,
        AdditionalPropertiesToSelect: [],
    };

    const mutation = useMutation({
        mutationFn: getViewModelData,
        onError: (error) => {
            console.log('error :>> ', error);
        },
        onSuccess: (apiData) => {
            console.log('apiData :>> ', JSON.stringify(apiData?.ViewModelData));
            if (apiData) setCardData(apiData.ViewModelData);
        },
    });

    const putData = useMutation({
        mutationFn: putEntityData,
        onError: (error) => {
            console.log('error :>> ', error);
        },
        onSuccess: (apiData) => {
            console.log('apiData :>> ', apiData);
        },
    });

    useEffect(() => {
        mutation.mutate(viewModelSearchOptions);
    }, []);

    // console.log(cardData);

    const getObjectPaths = (obj: DynamicObject, parentKey = '') => {
        let paths: string[] = [];

        for (const key in obj) {
            const path = parentKey ? `${parentKey}.${key}` : key;

            if (typeof obj[key] === 'object' && obj[key] !== null) {
                paths = paths.concat(getObjectPaths(obj[key], path));
            } else {
                paths.push(path);
            }
        }

        return paths;
    };

    const saveChanges = () => {
        const reducedChangedValues = changedValues.reduce((acc, obj) => {
            for (const [key, value] of Object.entries(obj)) {
                // eslint-disable-next-line no-prototype-builtins
                if (acc.hasOwnProperty(key)) {
                    Object.assign(acc[key], value);
                } else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {});
        const propertiesToSelect = getObjectPaths(reducedChangedValues);
        const putDataOptions = {
            EntityType: EntityType,
            Patch: {
                ...reducedChangedValues,
                Id: Id,
            },
            // TODO these are now hardcoded
            PropertiesToSelect: propertiesToSelect,
        };
        console.log(putDataOptions);
        putData.mutate(putDataOptions);
        mutation.mutate(viewModelSearchOptions);
        setChangedValues([]);
    };

    const cancelChanges = () => {
        setChangedValues([]);
    };

    const getNestedKeyValue = (
        obj: DynamicObject,
        target: string,
    ): string | null => {
        for (const key in obj) {
            if (key === target) {
                console.log(obj[key]);
                console.log(key);
                return obj[key];
            } else if (typeof obj[key] === 'object') {
                return getNestedKeyValue(obj[key], target);
            }
        }
        return null;
    };

    const getMatchingNestedKeyValueFromchangedValuesArray = (
        target: string,
    ) => {
        for (const obj of changedValues) {
            const valueOfMatchingKey = getNestedKeyValue(obj, target);
            if (valueOfMatchingKey) {
                return valueOfMatchingKey;
            }
        }
        return null;
    };

    const PrintList = ({ element }: { element: DynamicObject }) => {
        if (cardData === null) return null;
        return <List xmlElementTree={element} listData={cardData} />;
    };

    const PrintElement = ({ element }: { element: DynamicObject }) => {
        // console.log(element);
        const cardDetails = resolveCardBindings(
            cardData,
            element.attributes.Value,
        );

        const changedValue = getMatchingNestedKeyValueFromchangedValuesArray(
            element.attributes.Identifier,
        );

        const [elementValue, setElementValue] = useState(
            changedValue || cardDetails?.toString(),
        );

        const updateChangedTextInputValue = (
            valueString: string,
            key: string,
            value: string,
        ) => {
            const newChangedValues = [...changedValues];

            console.log(`value: ${valueString}`);
            console.log(`updateChangedValues: ${key} = ${value}`);
            // TODO there are some ready made functions for this
            const keys = valueString
                .replace('{Binding ', '')
                .replace('}', '')
                .split('.')
                .slice(1);
            const valueObj: DynamicObject = {};
            let currentObj = valueObj;
            console.log(`keys: ${JSON.stringify(keys)}`);

            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    currentObj[key] = value;
                } else {
                    currentObj[key] = {};
                    currentObj = currentObj[key];
                }
            });

            // valueObj[keys[keys.length - 1]] = value;
            console.log(`valueObj: ${JSON.stringify(valueObj)}`);

            const existingObject = newChangedValues.findIndex((obj) => {
                console.log(`obj: ${JSON.stringify(obj)}`);
                let keyFound = true;
                let currentObjKey = obj;
                for (let i = 0; i < keys.length; i++) {
                    console.log(`keys[i]: ${keys[i]}`);
                    if (currentObjKey[keys[i]] === undefined) {
                        keyFound = false;
                        break;
                    }
                    currentObjKey = currentObjKey[keys[i]];
                    console.log(keyFound);
                }
                console.log(`keyFound: ${keyFound}`);
                return keyFound;
            });
            console.log(`existingObject: ${JSON.stringify(existingObject)}`);

            if (existingObject > -1) {
                newChangedValues[existingObject] = valueObj;
            } else {
                newChangedValues.push(valueObj);
            }
            console.log(
                `newChangedValues: ${JSON.stringify(newChangedValues)}`,
            );

            // const newChangedValues = [...changedValues];
            // const index = newChangedValues.findIndex((item) => item.key === key);
            // if (index === -1) {
            //     newChangedValues.push({ key, value });
            // } else {
            //     newChangedValues[index].value = value;
            // }
            setChangedValues(newChangedValues);
        };

        const updateInputValue = (value: string) => {
            setElementValue(value);
        };

        const sanitizedBinding = sanitizeBinding(element.attributes.Value);
        const woEntity = sanitizedBinding.replace('Entity.', '');
        if (entityPropertiesAndTypes.get(woEntity) === 'Boolean') {
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
                        type={`checkbox`}
                        checked={cardDetails?.toString() === 'true'}
                        onChange={() => {
                            console.log(
                                `checkbox clicked: ${element.attributes.Caption}`,
                            );
                        }}
                    />
                </div>
            );
        }

        if (cardDetails && entityPropertiesAndTypes.get(woEntity) === 'Date') {
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
                        type={`text`}
                        defaultValue={new Date(
                            cardDetails.toString(),
                        ).toLocaleString('fi-FI', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                        })}
                        className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                    />
                </div>
            );
        }

        const isCardDetailsNull =
            cardDetails === null || cardDetails === undefined;

        const isElementException = getPath(element.attributes.Value).find(
            (subPath) => exceptionElements.has(subPath),
        );

        if (isElementException) {
            if (!Array.isArray(cardDetails) || cardDetails.length === 0)
                return null;

            return (
                <div className={`basis-full my-8 col-span-2`}>
                    <h2 className={`text-lg mb-2 uppercase text-ad-grey-700`}>
                        {element.attributes.Caption}
                    </h2>
                    <TranslationList translations={cardDetails} />
                </div>
            );
        }

        return (
            <>
                {!isCardDetailsNull && !Array.isArray(cardDetails) && (
                    <div className={`flex flex-col lg:flex-row lg:gap-32`}>
                        <label
                            htmlFor={element.attributes.Identifier}
                            className={`text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4`}
                        >
                            {element.attributes.Caption}
                        </label>
                        <input
                            id={element.attributes.Identifier}
                            type={typeof cardDetails}
                            value={elementValue}
                            className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                            onBlur={(e) => {
                                e.preventDefault();
                                if (elementValue) {
                                    updateChangedTextInputValue(
                                        element.attributes.Value,
                                        element.attributes.Identifier,
                                        elementValue,
                                    );
                                }
                            }}
                            onChange={(e) => {
                                e.preventDefault();
                                updateInputValue(e.target.value);
                            }}
                        />
                    </div>
                )}
            </>
        );
    };

    const MapElements = ({
        elements,
    }: {
        elements: Array<CardElementType>;
    }) => {
        return (
            <>
                {elements.map((element: CardElementType) => {
                    if (element.name === 'Group')
                        return (
                            <PrintGroup
                                group={element}
                                key={element.attributes['__id'] as Key}
                            />
                        );
                    else if (element.name === 'List') {
                        return (
                            <PrintList
                                key={element.attributes['__id'] as Key}
                                element={element}
                            />
                        );
                    } else if (element.name === 'Element')
                        return (
                            <PrintElement
                                key={element.attributes['__id'] as Key}
                                element={element}
                            />
                        );
                    else {
                        return (
                            <p key={element.attributes['__id'] as Key}>
                                {`Element type ${element.name} not
                                                yet implemented`}
                            </p>
                        );
                    }
                })}
            </>
        );
    };

    const PrintGroup = ({ group }: { group: DynamicObject }) => {
        const [isContentHidden, setIsContentHidden] = useState(false);

        return (
            group.children?.length && (
                <>
                    {group.attributes.Caption && (
                        <SectionHeading
                            onClick={() => setIsContentHidden(!isContentHidden)}
                        >
                            {group.attributes.Caption}
                        </SectionHeading>
                    )}

                    {!isContentHidden && (
                        <MapElements elements={group.children} />
                    )}
                </>
            )
        );
    };

    const constructCardView = (parsedCardMetaView: DynamicObject) => {
        return (
            <>
                {resolvedHeader && (
                    <ViewHeader
                        header={resolvedHeader.toString()}
                        subHeader={resolvedSubHeader?.toString()}
                    />
                )}
                {parsedCardMetaView && (
                    <div className="px-8 grid lg:grid-cols-2 gap-y-2 gap-x-64 pb-16 lg:max-w-[90%]">
                        {parsedCardMetaView.children.map(
                            (XmlNode: DynamicObject) => {
                                if (XmlNode.name === 'Group') {
                                    return (
                                        <PrintGroup
                                            group={XmlNode}
                                            key={XmlNode.attributes.__id}
                                        />
                                    );
                                }
                            },
                        )}
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            {mutation.isError && <ErrorPage />}
            {mutation.isLoading && <LoadingSpinner />}
            {mutation.isSuccess &&
                cardData &&
                constructCardView(parsedCardMetaView)}
            {/*TODO just temporary buttons here*/}
            <Button
                onClick={() => cancelChanges()}
                disabled={changedValues.length === 0}
            >
                Peruuta muutokset
            </Button>
            <Button
                onClick={() => saveChanges()}
                disabled={changedValues.length === 0}
            >
                Tallenna muutokset
            </Button>
        </>
    );
};
