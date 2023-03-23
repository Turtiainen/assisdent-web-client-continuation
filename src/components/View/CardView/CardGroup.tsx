import { useState } from 'react';
import { DtoProperty } from '../../../types/DtoProperty';
import { DynamicObject } from '../../../types/DynamicObject';
import { SectionHeading } from '../SectionHeading';
import { CardViewBuilder } from './CardViewBuilder';

export const CardGroup = ({
    group,
    cardData,
    entityPropertySchema,
}: {
    group: DynamicObject;
    cardData: DynamicObject | null;
    entityPropertySchema: { [index: string]: DtoProperty } | undefined;
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
                        entityPropertySchema={entityPropertySchema}
                    />
                )}
            </>
        )
    );
};
