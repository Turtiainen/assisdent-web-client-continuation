import { DynamicObject } from '../../../types/DynamicObject';
import { List } from '../List';

export const CardList = ({
    element,
    cardData,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
}) => {
    if (cardData === null) return null;
    return <List xmlElementTree={element} listData={cardData} />;
};
