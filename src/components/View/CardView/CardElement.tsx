import { DtoProperty } from '../../../types/DtoProperty';
import { DynamicObject } from '../../../types/DynamicObject';
import { resolveCardBindings, sanitizeBinding } from '../../../utils/utils';
import { BooleanInput } from './BooleanInput';
import { DateInput } from './DateInput';
import { Exception } from './Exception';
import { BasicInput } from './BasicInput';
import { CardSearch } from './CardSearch';
import { CatalogInput } from './CatalogInput';
import {
    findLastTypeObjectFromValuePath,
    getCardElementInputProperties,
    getCatalogType,
    getEntitySchema,
} from '../../../temp/SchemaUtils';

export const CardElement = ({
    element,
    cardData,
    updateChangedTextInputValue,
    entityType,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
    updateChangedTextInputValue: (
        valueString: string,
        key: string,
        value: string | number,
    ) => void;
    entityType: string | null;
}) => {
    const entitySchema = getEntitySchema(entityType);
    const entityPropertySchema = entitySchema?.Properties;

    const cardDetails = resolveCardBindings(
        cardData,
        element.attributes.Value,
        entityType,
    );
    const entityPropertiesAndTypes = new Map<string, string>();
    const exceptionElements = new Set<string>();
    const ExceptionEntityTypes = new Set([
        'Translation',
        'TranslationCollection',
    ]);

    const getPath = (bindingExpression: string) => {
        const path = bindingExpression
            .replace('{Binding ', '')
            .replace('}', '');
        return path.split('.');
    };

    // Find possible known exceptions from Schema
    if (entityPropertySchema) {
        Object.entries(entityPropertySchema as DynamicObject).forEach(
            (property) => {
                const key = property[0];
                const val = property[1];

                if (
                    val.Type === 'List' &&
                    val.SubType &&
                    ExceptionEntityTypes.has(val.SubType.Type)
                ) {
                    exceptionElements.add(key);
                }

                entityPropertiesAndTypes.set(key, val.Type);
            },
        );
    }

    const sanitizedBinding = sanitizeBinding(element.attributes.Value);
    const woEntity = sanitizedBinding.replace('Entity.', '');
    const propertyType = entityPropertiesAndTypes.get(woEntity);

    const inputProperties = getCardElementInputProperties(
        woEntity,
        propertyType || typeof cardDetails,
        entityPropertySchema,
    );

    const elementTypeObject = findLastTypeObjectFromValuePath(
        {} as DtoProperty,
        woEntity,
        entityPropertySchema,
    );
    if (element.attributes.Caption === 'Muu maksaja')
        console.log('elementTypeObject :>> ', elementTypeObject);
    if (elementTypeObject) {
        if (typeof elementTypeObject.Type !== 'string') {
            console.log(
                element.attributes.Caption,
                ' hakuparametrin tyyppi ei ole string ',
                elementTypeObject.Type,
            );
        }
        const foundCatalogSchema = getCatalogType(elementTypeObject.Type);
        if (foundCatalogSchema) {
            return (
                <CatalogInput
                    element={element}
                    content={cardDetails}
                    inputProperties={{ Values: foundCatalogSchema.Entries }}
                    updateChangedTextInputValue={updateChangedTextInputValue}
                />
            );
        }

        const foundEntitySchema = getEntitySchema(elementTypeObject.Type);
        if (foundEntitySchema) {
            return (
                <CardSearch
                    element={element}
                    cardData={cardData}
                    entityType={foundEntitySchema.Name}
                    viewName={""}
                    elementIdentifier={""}
                />
            );
        }
    }

    if (
        inputProperties.Type === 'Boolean' ||
        inputProperties.Type === 'boolean'
    ) {
        return <BooleanInput element={element} content={cardDetails} />;
    }

    if (cardDetails && inputProperties.Type === 'Date') {
        return (
            <DateInput
                element={element}
                content={cardDetails}
                inputProperties={inputProperties}
            />
        );
    }

    const isElementException = getPath(element.attributes.Value).find(
        (subPath) => exceptionElements.has(subPath),
    );

    if (isElementException) {
        return <Exception element={element} content={cardDetails} />;
    }

    return (
        <BasicInput
            element={element}
            content={cardDetails || ''}
            inputProperties={inputProperties}
            updateChangedTextInputValue={updateChangedTextInputValue}
        />
    );
};
