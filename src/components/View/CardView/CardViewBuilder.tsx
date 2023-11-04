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
import { getAssociationType } from '../../../utils/associationUtils';
import { checkIfObjectHasNestedProperty } from '../../../utils/objectUtils';

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
    updateChangedValues,
    changedValues,
}: {
    elements: Array<CardElementType>;
    cardData: DynamicObject | null;
    entityType: string | null;
    updateChangedValues: (changedValues: Array<DynamicObject>) => void;
    changedValues: Array<DynamicObject>;
}) => {
    const entityPropertySchema = getEntityPropertiesSchema(entityType);

    /*
     * This function is called when a basic/catalog input value in the card is changed.
     * So, it should be passed downwards to such elements
     * Not sure if it should be on this level, but this is the way it at least works for now.
     */
    const updateChangedTextInputValue = (
        valueString: string,
        key: string,
        value: string | number | boolean | null,
    ) => {
        // const newChangedValues = changedValues ? [...changedValues] : [];
        const newChangedValues = [...changedValues];

        // From the binding string (valueString) we get the path to the property
        const keysArray = sanitizeBinding(valueString)
            .split('Entity.')[1]
            .split('.');
        const valueObj: DynamicObject = {};
        let currentObj = valueObj;

        // FIXME Special case: PatientInvoicingAddress can not be updated currently
        if (keysArray[0] === 'PatientInvoicingAddress') {
            return;
        }

        // Get the association type from the schema
        const propertySchemaObj = entityPropertySchema?.[keysArray[0]];
        const associationType = getAssociationType(propertySchemaObj);

        // We carry the association type in the object to be able to use correct patch commands later
        keysArray.forEach((key, index) => {
            if (index === 0) {
                currentObj.associationType = associationType;
            }
            if (index === keysArray.length - 1) {
                currentObj[key] = value;
            } else {
                currentObj[key] = {};
                currentObj = currentObj[key];
            }
        });

        // Existing objects will be just updated, new objects will be added
        const existingObject = newChangedValues.findIndex((obj) => {
            return checkIfObjectHasNestedProperty(obj, keysArray);
        });
        if (existingObject > -1) {
            newChangedValues[existingObject] = valueObj;
        } else {
            newChangedValues.push(valueObj);
            const isNewAssociation = newChangedValues.find((item) => {
                return Object.hasOwn(item, keysArray[0]);
            });
            if (associationType && isNewAssociation) {
                newChangedValues[newChangedValues.length - 1][keysArray[0]].Id =
                    cardData?.Entity[keysArray[0]]?.Id;
            }
        }

        updateChangedValues(newChangedValues);
    };

    return (
        <>
            {elements.map((element: CardElementType, index) => {
                switch (element.name) {
                    case 'Group':
                        return (
                            <CardGroup
                                key={element.attributes['__id'] as Key}
                                group={element}
                                cardData={cardData}
                                entityType={entityType}
                                updateChangedValues={updateChangedValues}
                                changedValues={changedValues}
                            />
                        );
                    case 'List': {
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
                            <CardList
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                                entityType={elementTypeObject}
                            />
                        );
                    }
                    case 'Element':
                        return (
                            <CardElement
                                key={element.attributes['__id'] as Key}
                                element={element}
                                cardData={cardData}
                                // entityPropertySchema={entityPropertySchema}
                                updateChangedTextInputValue={
                                    updateChangedTextInputValue
                                }
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
                                entityType={elementTypeObject.Type}
                                viewName={entityType + 'CardView'}
                                elementIdentifier={
                                    element.attributes.Identifier
                                }
                                updateChangedTextInputValue={
                                    updateChangedTextInputValue
                                }
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
                            entityType,
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
                                updateChangedTextInputValue={
                                    updateChangedTextInputValue
                                }
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
