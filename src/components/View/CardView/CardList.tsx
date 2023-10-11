import { DynamicObject } from '../../../types/DynamicObject';
import { List } from '../List';

export const CardList = ({
    element,
    cardData,
    entityType,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
    entityType: string | null;
}) => {
    if (cardData === null) return null;
    return <List xmlElementTree={element} listData={cardData} entityType={entityType}/>;
};
