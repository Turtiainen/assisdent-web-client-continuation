import { DtoProperty } from '../../../types/DtoProperty';
import { DynamicObject } from '../../../types/DynamicObject';
import { resolveCardBindings, sanitizeBinding } from '../../../utils/utils';
import { BooleanInput } from './BooleanInput';
import { DateInput } from './DateInput';
import { Exception } from './Exception';
import { BasicInput } from './BasicInput';
import { CatalogInput } from './CatalogInput';

export const CardElement = ({
    element,
    cardData,
    entityPropertySchema,
}: {
    element: DynamicObject;
    cardData: DynamicObject | null;
    entityPropertySchema: { [index: string]: DtoProperty } | undefined;
}) => {
    const cardDetails = resolveCardBindings(cardData, element.attributes.Value);
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
    if (propertyType === 'Boolean' || typeof cardDetails === 'boolean') {
        return <BooleanInput element={element} content={cardDetails} />;
    }

    if (cardDetails && propertyType === 'Date') {
        return <DateInput element={element} content={cardDetails} />;
    }
    if (propertyType?.includes('Type') || typeof cardDetails === 'number') {
        return (
            <CatalogInput
                element={element}
                content={cardDetails}
                propertyType={propertyType}
            />
        );
    }
    if (woEntity === 'Language') {
        return (
            <CatalogInput
                element={element}
                content={cardDetails}
                propertyType={'PatientLanguage'}
            />
        );
    }

    const isCardDetailsNull = cardDetails === null || cardDetails === undefined;

    const isElementException = getPath(element.attributes.Value).find(
        (subPath) => exceptionElements.has(subPath),
    );

    if (isElementException) {
        return <Exception element={element} content={cardDetails} />;
    }

    return (
        <>
            {!isCardDetailsNull && !Array.isArray(cardDetails) && (
                <BasicInput element={element} content={cardDetails} />
            )}
        </>
    );
};
