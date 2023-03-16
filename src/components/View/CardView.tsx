import { DynamicObject } from '../../types/DynamicObject';
import { ErrorPage } from '../ErrorPage';
import { getViewModelData } from '../../services/backend';
import { LoadingSpinner } from '../LoadingSpinner';
import { parseCardMetaView } from '../../utils/Parser';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ViewHeader } from './ViewHeader';
import { getUserLanguage, resolveEntityBindings } from '../../utils/utils';
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

    const PrintElement = ({ element }: { element: DynamicObject }) => {
        const cardDetails = resolveEntityBindings(
            cardData!,
            [element.attributes.Value],
            view.getAttribute('EntityType'),
        )[0];

        const isCardDetailsNull =
            cardDetails === null || cardDetails === undefined;

        const isElementException = exceptionElements.has(
            getPath(element.attributes.Value)[0],
        );

        if (isElementException) {
            return (
                <div className={`basis-full my-8 col-span-2`}>
                    <h3 className={`text-xl`}>{element.attributes.Caption}</h3>
                    <p>
                        This element is an exception and should be displayed
                        exceptionally
                    </p>
                    <p>{cardDetails}</p>
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

                                        if (element!.name === 'Element')
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
