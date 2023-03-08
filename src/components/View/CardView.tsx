import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export type DataProps = {
    view: Element;
};

export const CardView = ({ view }: DataProps) => {
    const { viewId } = useParams();
    const { Id } = useParams();

    console.log('view @CardView.tsx :>> ', view);
    console.log('viewId @CardView.tsx :>> ', viewId);
    console.log('cardId @CardView.tsx :>> ', Id);

    return (
        <div>
            Tähän tulee korttinäkymä {viewId} {Id}
        </div>
    );
};
