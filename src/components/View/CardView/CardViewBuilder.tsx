import { Key } from 'react';
import { DtoProperty } from '../../../types/DtoProperty';
import { DynamicObject } from '../../../types/DynamicObject';
import { resolveCardBindings, sanitizeBinding } from '../../../utils/utils';
import { CardButton } from './CardButton';
import { CardElement } from './CardElement';
import { CardGroup } from './CardGroup';
import { CardList } from './CardList';
import { CardSearch } from './CardSearch';
import { Editor } from './Editor';
import { CardCustom } from './CardCustom';
import {
    findLastTypeObjectFromValuePath,
    getEntityPropertiesSchema,
} from '../../../temp/SchemaUtils';

type ElementAttributesType = {
    __id: string;
    [index: string]: string;
};

type CardElementType = {
    name:
        | 'Group'
        | 'List'
        | 'Element'
        | 'Search'
        | 'Button'
        | 'Editor'
        | 'TextBlock'
        | 'Separator'
        | 'Custom';
    attributes: ElementAttributesType;
    [index: string]: unknown;
};

export const CardViewBuilder = ({
    elements,
    cardData,
    entityType,
}: {
    elements: Array<CardElementType>;
    cardData: DynamicObject | null;
    entityType: string | null;
}) => {
    const entityPropertySchema = getEntityPropertiesSchema(entityType);
    return (
        <>
            {elements.map((element: CardElementType) => {
                switch (element.name) {
                    case 'Group':
                        return (
                            <CardGroup
                                key={element.attributes['__id'] as Key}
                                group={element}
                                cardData={cardData}
                                entityType={entityType}
                            />
                        );
                    case 'List':
                        return (
                            <CardList
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                            />
                        );
                    case 'Element':
                        return (
                            <CardElement
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                                entityType={entityType}
                            />
                        );
                    case 'Search': {
                        const sanitizedBinding = sanitizeBinding(
                            element.attributes.Value,
                        );
                        const woEntity = sanitizedBinding.replace(
                            'Entity.',
                            '',
                        );
                        const elementTypeObject =
                            findLastTypeObjectFromValuePath(
                                {} as DtoProperty,
                                woEntity,
                                entityPropertySchema,
                            );
                        return (
                            <CardSearch
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                                entityType={elementTypeObject.Name}
                            />
                        );
                    }
                    case 'Button': {
                        return (
                            <CardButton
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                            />
                        );
                    }
                    case 'Editor': {
                        const content = resolveCardBindings(
                            cardData,
                            element.attributes.Value,
                        );
                        return (
                            <Editor
                                key={element.attributes['__id'] as Key}
                                element={element}
                                content={content?.toString()}
                                placeholder={element.attributes.Caption}
                            />
                        );
                    }
                    case 'TextBlock':
                        return (
                            <p
                                key={element.attributes['__id'] as Key}
                                className="text-ad-grey-400"
                            >
                                {element.attributes.GhostText
                                    ? `${element.attributes.GhostText}`
                                    : ''}
                            </p>
                        );
                    case 'Separator':
                        return <br key={element.attributes['__id'] as Key} />;
                    case 'Custom':
                        return (
                            <CardCustom
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                                entityType={entityType}
                            />
                        );
                    default:
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
