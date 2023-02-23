import { getCardView } from '../../utils/Parser';
import { useQuery } from '@tanstack/react-query';

export type DataProps = {
    entity: string;
    id: string;
    view?: Element | undefined | null;
};

export const CardView = (props: DataProps) => {
    const { entity, id, view } = props;

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['getCardView'],
        queryFn: async () => {
            return await getCardView(entity);
        },
    });

    console.log('data :>> ', data);

    const loadingSpinner = <p>Loading...</p>;

    return (
        <>
            {error && <p>There was an error while loading register views</p>}
            {isLoading && loadingSpinner}
            {data && data.length > 0 && <p>data</p>}
        </>
    );
};
