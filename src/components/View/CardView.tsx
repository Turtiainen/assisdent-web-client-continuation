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
    sanitizeBinding,
} from '../../utils/utils';
import { getEntityPropertiesSchema } from '../../temp/SchemaUtils';
import { List } from './List';
import { TranslationList } from './TranslationList';
import { SectionHeading } from './SectionHeading';

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
            if (apiData) setCardData(apiData.ViewModelData);
        },
    });

    useEffect(() => {
        mutation.mutate(viewModelSearchOptions);
    }, []);

    // console.log(cardData);

    const PrintList = ({ element }: { element: DynamicObject }) => {
        if (cardData === null) return null;
        return <List xmlElementTree={element} listData={cardData} />;
    };

    const PrintElement = ({ element }: { element: DynamicObject }) => {
        const cardDetails = resolveCardBindings(
            cardData!,
            element.attributes.Value,
        );

        // console.log(sanitizeBinding(element.attributes.Value));
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
                        onChange={() => {}}
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
                    {group.attributes.Caption && (
                        <SectionHeading
                            onClick={() => setIsContentHidden(!isContentHidden)}
                        >
                            {group.attributes.Caption}
                        </SectionHeading>
                    )}

                    {!isContentHidden && (
                        <>
                            {group.children.map((element: DynamicObject) => {
                                if (element!.name === 'Group')
                                    return (
                                        <PrintGroup
                                            group={element}
                                            key={element!.attributes.__id}
                                        />
                                    );
                                else if (element!.name === 'List') {
                                    return (
                                        <PrintList
                                            key={element!.attributes.__id}
                                            element={element}
                                        />
                                    );
                                } else if (element!.name === 'Element')
                                    return (
                                        <PrintElement
                                            key={element!.attributes.__id}
                                            element={element}
                                        />
                                    );
                                else {
                                    return (
                                        <p key={element.attributes.__id}>
                                            Element type '{element.name}' not
                                            yet implemented
                                        </p>
                                    );
                                }
                            })}
                        </>
                    )}
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
                constructCardView(parsedCardMetaView, cardData)}
        </>
    );
};
