import { DtoSchema } from '../types/DtoSchema';
import { DynamicObject } from '../types/DynamicObject';
import useSchemaStore from '../store/store';
import { DtoProperty } from '../types/DtoProperty';

const getStoreSchema = () => {
    const schemaInStore = useSchemaStore.getState().schema;
    return schemaInStore as DtoSchema;
};

export const getMetaViews = () => {
    const schema = getStoreSchema();
    return schema.MetaViews;
};

export const getFormattedText = (identifier: string) => {
    const schema = getStoreSchema();

    if (identifier.includes('{{')) return identifier;
    return schema.FormattedTexts.find((ft) => ft.Identifier === identifier)
        ?.Text;
};

export const getEntitySchema = (name: string | undefined | null) => {
    const schema = getStoreSchema();

    if (!name || name === '') return;
    return schema.MetaData.Entities.find((e) => e.Name === name);
};

export const getEntityPropertiesSchema = (name: string | undefined | null) => {
    const entity = getEntitySchema(name);
    return entity?.Properties;
};

export const getEntityToString = (
    name: string | undefined | null,
): string | undefined => {
    const entity = getEntitySchema(name);
    return entity?.Metadata?.Metadata?.['$Entity']?.ToString;
};

export const getCatalogType = (name: string | null) => {
    const schema = getStoreSchema();
    return schema.MetaData.Catalogs.find((obj) => obj.Name === name);
};

const getEntityTypeRecursively = (
    result: DynamicObject,
    splittedPath: string[],
): DynamicObject => {
    const entitySchema = getEntitySchema(splittedPath[0]);
    if (entitySchema) {
        const foundEntityProperty = entitySchema.Properties[splittedPath[1]];
        if (foundEntityProperty) {
            result = {
                isEntity: true,
                Type: foundEntityProperty.Type,
                Values: foundEntityProperty,
            };
            return getEntityTypeRecursively(result, splittedPath.slice(1));
        }
    }
    return result;
};

export const getCardElementInputProperties = (
    woEntity: string,
    propertyType: string,
    cardPropertySchema: { [index: string]: DtoProperty } | undefined,
): DynamicObject => {
    let result: DynamicObject = {
        isEntity: false,
        Type: propertyType,
        Values: {},
        ElementProps: {},
    };

    const splittedEntityNames = woEntity.split('.');
    result = getEntityTypeRecursively(result, splittedEntityNames);
    const isCatalog = getCatalogType(result.Type);

    if (isCatalog) {
        result = {
            ...result,
            Type: 'Catalog',
            Values: isCatalog.Entries,
        };
    }

    if (result.Type === 'Int32' || result.Type === 'Int64') {
        result = { ...result, Type: 'number' };
    }

    result = { ...result, ElementProps: cardPropertySchema?.[woEntity] };
    return result;
};
