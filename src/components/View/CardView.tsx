import { DynamicObject } from '../../types/DynamicObject';
import { ErrorPage } from '../ErrorPage';
import { LoadingSpinner } from '../LoadingSpinner';
import { parseCardMetaView } from '../../utils/Parser';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export type DataProps = {
    view: Element;
};

export const CardView = ({ view }: DataProps) => {
    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['parseCardMetaView'],
        queryFn: async () => {
            return await parseCardMetaView(view);
        },
    });

    const { viewId } = useParams();
    const { Id } = useParams();

    console.log('viewId @CardView.tsx :>> ', viewId);
    console.log('cardId @CardView.tsx :>> ', Id);

    const constructCardView = (data: DynamicObject) => {
        console.log('data :>> ', data);
        return (
            <div className="m-10 flex-col">
                <div className="m-5 text-lg">{viewId}</div>
                {data.map((item: DynamicObject, idx: number) => (
                    <div key={idx} className="flex flex-col col-span-2">
                        <div className="text-lg">{item.Identifier}</div>
                        <div className="m-5">
                            {item.Elements.map(
                                (element: DynamicObject, idx: number) => {
                                    return (
                                        <div className="m-5" key={idx}>
                                            <p>
                                                {element.Caption} -{' '}
                                                {element.Value}
                                            </p>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {error && <ErrorPage />}
            {isLoading && <LoadingSpinner />}
            {data && constructCardView(data)}
        </>
    );
};
