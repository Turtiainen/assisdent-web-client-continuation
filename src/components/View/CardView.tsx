import { DynamicObject } from '../../types/DynamicObject';
import { ErrorPage } from '../ErrorPage';
import { getEntityData } from '../../services/backend';
import { LoadingSpinner } from '../LoadingSpinner';
import { parseCardMetaView } from '../../utils/Parser';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { MouseEventHandler, useEffect, useState } from 'react';
import { ViewHeader } from './ViewHeader';
import { resolveEntityBindings } from '../../utils/utils';
import { getEntityPropertiesSchema } from '../../temp/SchemaUtils';

export type DataProps = {
    view: Element;
};

export const CardView = ({ view }: DataProps) => {
    const [cardData, setCardData] = useState<DynamicObject | null | undefined>(
        null,
    );
    const data = parseCardMetaView(view);
    // console.log('Data from parser: ', data);

    const { viewId } = useParams();
    const { Id } = useParams();

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
            .replace('{Binding Entity.', '')
            .replace('}', '');
        return path.split('.');
    };

    const constructArrayView = (dataArray: Array<DynamicObject>) => {
        return (
            <div className="border-2 border-ad-primary">
                Array View: {dataArray.length} objektia
            </div>
        );
    };

    const searchOptions = {
        entityType: viewId?.replace('CardView', ''),
        filters: {
            Id: {
                Values: [Id],
            },
        },
        propertiesToSelect: ['**'],
    };

    const mutation = useMutation({
        mutationFn: getEntityData,
        onError: (error) => {
            console.log('error :>> ', error);
        },
        onSuccess: (apiData) => {
            setCardData(() => {
                if (Context) {
                    const tempObject = {} as DynamicObject;
                    tempObject[Context] = apiData.Results[0];
                    return tempObject;
                } else {
                    console.log(
                        'Something went possibly wrong while getting card data',
                    );
                    return apiData.Results[0];
                }
            });
        },
    });

    useEffect(() => {
        mutation.mutate(searchOptions);
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
                                        if (element.name === 'Group')
                                            return (
                                                <PrintGroup
                                                    group={element}
                                                    key={
                                                        element.attributes
                                                            .Identifier
                                                    }
                                                />
                                            );

                                        if (element.name === 'Element')
                                            return (
                                                <PrintElement
                                                    key={
                                                        element.attributes
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
        data: DynamicObject,
        cardData: DynamicObject,
    ) => {
        return (
            <>
                <ViewHeader heading={Context ? cardData[Context].Name : '-'} />
                {data && (
                    <div className="px-8 grid grid-cols-2 gap-y-2 gap-x-16 pb-16">
                        {data.children.map((XmlNode: DynamicObject) => {
                            if (XmlNode.name === 'Group') {
                                return (
                                    <PrintGroup
                                        group={XmlNode}
                                        key={XmlNode.attributes.Identifier}
                                    />
                                );
                            }
                        })}
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
                constructCardView(data, cardData)}
        </>
    );
};
