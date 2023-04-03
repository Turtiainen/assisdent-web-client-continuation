import { useState } from 'react';
import { DynamicObject } from '../../../types/DynamicObject';
import { SectionHeading } from '../SectionHeading';
import { CardViewBuilder } from './CardViewBuilder';

export const CardGroup = ({
    group,
    cardData,
    entityType,
}: {
    group: DynamicObject;
    cardData: DynamicObject | null;
    entityType: string | null;
}) => {
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
                    <CardViewBuilder
                        elements={group.children}
                        cardData={cardData}
                        entityType={entityType}
                    />
                )}
            </>
        )
    );
};
