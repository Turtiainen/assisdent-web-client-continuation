import { Key } from 'react';
import { DtoProperty } from '../../../types/DtoProperty';
import { DynamicObject } from '../../../types/DynamicObject';
import { CardElement } from './CardElement';
import { CardGroup } from './CardGroup';
import { CardList } from './CardList';

type ElementAttributesType = {
    __id: string;
    [index: string]: string;
};

type CardElementType = {
    name: 'Group' | 'List' | 'Element';
    attributes: ElementAttributesType;
    [index: string]: unknown;
};

export const CardViewBuilder = ({
    elements,
    cardData,
    entityPropertySchema,
}: {
    elements: Array<CardElementType>;
    cardData: DynamicObject | null;
    entityPropertySchema: { [index: string]: DtoProperty } | undefined;
}) => {
    return (
        <>
            {elements.map((element: CardElementType) => {
                if (element.name === 'Group')
                    return (
                        <CardGroup
                            key={element.attributes['__id'] as Key}
                            group={element}
                            cardData={cardData}
                            entityPropertySchema={entityPropertySchema}
                        />
                    );
                else if (element.name === 'List') {
                    return (
                        <CardList
                            key={element.attributes['__id'] as Key}
                            element={element}
                            cardData={cardData}
                        />
                    );
                } else if (element.name === 'Element')
                    return (
                        <CardElement
                            key={element.attributes['__id'] as Key}
                            element={element}
                            cardData={cardData}
                            entityPropertySchema={entityPropertySchema}
                        />
                    );
                else {
                    return (
                        <p key={element.attributes['__id'] as Key}>
                            {`Element type ${element.name} not
                                            yet implemented`}
                        </p>
                    );
                }
            })}
        </>
    );
};
