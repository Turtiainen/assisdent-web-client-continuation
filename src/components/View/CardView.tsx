import { DynamicObject } from '../../types/DynamicObject';
import { ErrorPage } from '../ErrorPage';
import { getViewModelData } from '../../services/backend';
import { LoadingSpinner } from '../LoadingSpinner';
import { parseCardMetaView } from '../../utils/Parser';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ViewHeader } from './ViewHeader';
import {
    getUserLanguage,
    resolveCardBindings,
    resolveEntityBindings,
} from '../../utils/utils';
import { getEntityPropertiesSchema } from '../../temp/SchemaUtils';

export type DataProps = {
    view: Element;
};

export const CardView = ({ view }: DataProps) => {
    const [cardData, setCardData] = useState<DynamicObject | null>(null);

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
    const Context = view.getAttribute('Context');

    // Data structure for possible exceptions like Translations table
    const exceptionElements = new Set<string>();
    const ExceptionEntityTypes = new Set([
        'Translation',
        'TranslationCollection',
    ]);

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
            setCardData(apiData.ViewModelData);
        },
    });

    useEffect(() => {
        mutation.mutate(viewModelSearchOptions);
    }, []);

    const PrintList = ({ element }: { element: DynamicObject }) => {
        const cardDetails = resolveCardBindings(
            cardData!,
            element.attributes.Value!,
        );

        if (
            !cardDetails ||
            !Array.isArray(cardDetails) ||
            cardDetails.length === 0
        ) {
            return null;
        }

        return (
            <div className={`basis-full my-8 col-span-2`}>
                <h2 className={`text-2xl`}>{element.attributes.Caption}</h2>
                <div>
                    {cardDetails.map((listItem: DynamicObject) => {
                        return (
                            <div
                                key={listItem.Id}
                                className={`mb-4 p-2 bg-ad-grey-200 rounded`}
                            >
                                <>
                                    {element.children.length &&
                                        element.children
                                            .find(
                                                (child: DynamicObject) =>
                                                    child.name === 'Columns',
                                            )
                                            .children.map(
                                                (node: DynamicObject) => {
                                                    const caption: string =
                                                        node.attributes.Caption;
                                                    const binding: string =
                                                        node.attributes.Value;

                                                    if (!binding) return null;

                                                    const value =
                                                        resolveCardBindings(
                                                            listItem,
                                                            binding,
                                                        );

                                                    return (
                                                        <p>
                                                            {caption}:{' '}
                                                            {value as string}
                                                        </p>
                                                    );
                                                },
                                            )}
                                </>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const PrintElement = ({ element }: { element: DynamicObject }) => {
        const cardDetails = resolveCardBindings(
            cardData!,
            element.attributes.Value,
        );

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
                    <h3 className={`text-xl`}>{element.attributes.Caption}</h3>
                    <ul>
                        {cardDetails.map(
                            (listItem: DynamicObject, idx: React.Key) => {
                                return (
                                    <div key={idx}>
                                        {Object.entries(listItem).map(
                                            (entry) => (
                                                <li key={entry[0]}>
                                                    {entry[0]}: {entry[1]}
                                                </li>
                                            ),
                                        )}
                                    </div>
                                );
                            },
                        )}
                    </ul>
                </div>
            );
        }

        return (
            <>
                {!isCardDetailsNull && !Array.isArray(cardDetails) && (
                    <div className={`flex flex-col lg:flex-row lg:gap-4`}>
                        <label
                            htmlFor={element.attributes.Identifier}
                            className={`text-sm font-semibold text-ad-grey-800 flex items-center lg:w-1/4`}
                        >
                            {element.attributes.Caption}
                        </label>
                        <input
                            id={element.attributes.Identifier}
                            type={typeof cardDetails}
                            defaultValue={cardDetails.toString()}
                            className={`flex-1 max-h-12 border border-ad-grey-300 rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none`}
                        />
                    </div>
                )}
            </>
        );
    };

    const PrintGroup = ({ group }: { group: DynamicObject }) => {
        const [isContentHidden, setIsContentHidden] = useState(false);

        return (
            group.children?.length && (
                <>
                    <>
                        {group.attributes.Caption && (
                            <h2
                                className="col-span-2 text-2xl mb-4 mt-8 cursor-pointer hover:underline hover:bg-ad-primary-hover/10"
                                onClick={() =>
                                    setIsContentHidden(!isContentHidden)
                                }
                            >
                                {group.attributes.Caption}
                            </h2>
                        )}
                        {!isContentHidden && (
                            <>
                                {group.children.map(
                                    (element: DynamicObject) => {
                                        if (element!.name === 'Group')
                                            return (
                                                <PrintGroup
                                                    group={element}
                                                    key={
                                                        element!.attributes
                                                            .Identifier
                                                    }
                                                />
                                            );
                                        else if (element!.name === 'List') {
                                            return (
                                                <PrintList
                                                    key={
                                                        element!.attributes
                                                            .Identifier
                                                    }
                                                    element={element}
                                                />
                                            );
                                        } else if (element!.name === 'Element')
                                            return (
                                                <PrintElement
                                                    key={
                                                        element!.attributes
                                                            .Identifier
                                                    }
                                                    element={element}
                                                />
                                            );
                                        else {
                                            return null;
                                        }
                                    },
                                )}
                            </>
                        )}
                    </>
                </>
            )
        );
    };

    const constructCardView = (
        parsedCardMetaView: DynamicObject,
        cardData: DynamicObject,
    ) => {
        return (
            <>
                <ViewHeader heading={Context ? cardData.Entity.Name : '-'} />
                {parsedCardMetaView && (
                    <div className="px-8 grid grid-cols-2 gap-y-2 gap-x-16 pb-16">
                        {parsedCardMetaView.children.map(
                            (XmlNode: DynamicObject) => {
                                if (XmlNode.name === 'Group') {
                                    return (
                                        <PrintGroup
                                            group={XmlNode}
                                            key={XmlNode.attributes.Identifier}
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
                constructCardView(parsedCardMetaView, cardData)}
        </>
    );
};
