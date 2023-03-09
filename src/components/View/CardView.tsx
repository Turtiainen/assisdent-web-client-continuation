import { DynamicObject } from '../../types/DynamicObject';
import { ErrorPage } from '../ErrorPage';
import { getEntityData } from '../../services/backend';
import { LoadingSpinner } from '../LoadingSpinner';
import { parseCardMetaView } from '../../utils/Parser';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export type DataProps = {
    view: Element;
};

export const CardView = ({ view }: DataProps) => {
    const [cardData, setCardData] = useState<DynamicObject | null | undefined>(
        null,
    );
    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['parseCardMetaView'],
        queryFn: async () => {
            return await parseCardMetaView(view);
        },
    });

    const { viewId } = useParams();
    const { Id } = useParams();

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
            setCardData(apiData.Results[0]);
        },
    });

    useEffect(() => {
        mutation.mutate(searchOptions);
    }, []);

    const constructCardView = (
        data: DynamicObject,
        cardData: DynamicObject,
    ) => {
        return (
            <div className="flex-col w-5/6 px-5 py-5">
                <div className="font-semibold text-4xl text-ad-hero-title">
                    {cardData['Name'] && cardData['Name']}
                </div>
                {data.map((group: DynamicObject, idx: number) => (
                    <div key={idx} className="w-full">
                        <div className="py-5 text-2xl">{group.Caption}</div>
                        <>
                            {group.Elements.map(
                                (element: DynamicObject, idx: number) => {
                                    const dataPath = getPath(element.Value);
                                    const cardDetails = dataPath.reduce(
                                        (acc, curr) => {
                                            return acc[curr];
                                        },
                                        cardData,
                                    );
                                    return cardDetails &&
                                        !Array.isArray(cardDetails) ? (
                                        <div
                                            key={idx}
                                            className="flex w-1/3 justify-between"
                                        >
                                            <label className="text-sm font-semibold text-ad-grey-800">
                                                {element.Caption}
                                            </label>
                                            <input
                                                type={typeof cardDetails}
                                                defaultValue={cardDetails.toString()}
                                                className="border border-ad-grey-[300] rounded-sm px-2 py-1 hover:border-ad-primary focus:border-ad-primary active:border-ad-primary focus:outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div key={idx} className="w-full">
                                            <div className="text-lg">
                                                {element.Caption}
                                            </div>
                                            {cardDetails &&
                                                constructArrayView(cardDetails)}
                                        </div>
                                    );
                                },
                            )}
                            <div className="mb-2 ml-2 text-left text-ad-grey-300 overflow-hidden after:h-[1px] after:bg-ad-grey-300 after:inline-flex after:align-middle after:w-full after:ml-0 pt-2"></div>
                        </>
                    </div>
                ))}
            </div>
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
