import { getCardView } from '../../utils/Parser';
import { useQuery } from '@tanstack/react-query';

export type CardViewDataProps = {
    entity: string;
    id?: string;
    view?: Element | undefined | null;
};

export const CardView = (props: CardViewDataProps) => {
    const { entity, id, view } = props;


    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['getCardView'],
        queryFn: async () => {
            return await getCardView(entity);
        },
    });

    const loadingSpinner = <p>Loading...</p>;
    console.log('data :>> ', data);

    const constructGroupView = (group: any) => {
        return (
            <>
                <div className="flex flex-col border border-blue-500">
                    <div className="border border-blue-500 rounded text-lg">
                        {group.Identifier}
                    </div>
                    {group.Elements.map((element: any) => {
                        return (
                            <div
                                key={element.Identifier}
                                className="inline-flex"
                            >
                                <p>{element.Caption}</p>
                                <p>{element.Value}</p>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <>
            {console.log('render card view')}
            
            {error && <p>There was an error while loading card view</p>}
            {isLoading && loadingSpinner}
            {data && data.length > 0 && (
                <div>
                    {data.map((element: any) => {
                        return element.map((e: any) => {
                            return constructGroupView(e);
                        });
                    })}
                </div>
            )}
        </>
    );
};
