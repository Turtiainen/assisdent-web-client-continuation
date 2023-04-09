import { DtoSchema } from '../types/DtoSchema';
import { DtoEntity } from '../types/DtoEntity';
import { DynamicObject } from '../types/DynamicObject';
import useSchemaStore from '../store/store';

const getStoreSchema = () => {
    const schemaInStore = useSchemaStore.getState().schema;
    return schemaInStore as DtoSchema;
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

const tryToGetSchema = (entityType: string | null, path: string | string[]) => {
    if (entityType === null) return;

    if (typeof path === 'string')
        path = path.replace(/\[["'`](.*)["'`]\]/g, '.$1').split('.');

    return path.reduce((prev: DtoEntity | undefined, cur) => {
        return prev && getEntitySchema(prev.Properties[cur]?.Type);
    }, getEntitySchema(entityType));
};

// TODO: this function is not used anywhere
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const getEntityPropertyType = () => {};

export const getEntityToString = (
    name: string | undefined | null,
): string | undefined => {
    const entity = getEntitySchema(name);
    return entity?.Metadata?.Metadata?.['$Entity']?.ToString;
};

/**
 * This function is only for development purposes
 * Finds an entity schema from schema.json, based on entity name
 * @param names 0..* strings
 */
export const findEntitySchema = (...names: string[]) => {
    const schema = getStoreSchema();
    const allEntities = schema.MetaData.Entities;

    if (names.length > 0) {
        return allEntities.filter((entity: DtoEntity) =>
            names.includes(entity.Name),
        );
    } else {
        console.log('entiteettejä on yht: ', allEntities.length);
        console.log();

        allEntities.map((entity: DtoEntity) => {
            console.log(entity.Name);
        });
    }
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
): DynamicObject => {
    let result: DynamicObject = {
        isEntity: false,
        Type: propertyType,
        Values: {},
    };
    const splittedEntityNames = woEntity.split('.');
    //splittedEntityNames.unshift(entityType as string);
    result = getEntityTypeRecursively(result, splittedEntityNames);

    const isCatalog = getCatalogType(result.Type);
    if (isCatalog) {
        result = {
            ...result,
            Type: 'Catalog',
            Values: isCatalog.Entries,
        };
    }
    if (propertyType === 'Int32' || propertyType === 'Int64') {
        result = { ...result, Type: 'number' };
    }
    return result;
};
