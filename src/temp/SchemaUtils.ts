import { DtoSchema } from '../types/DtoSchema';
import { DtoEntity } from '../types/DtoEntity';
import { getSchema } from '../services/backend';
import useSchemaStore from '../store/store';

const getStoreSchema = () => {
    const schemaInStore = useSchemaStore.getState().schema;
    return schemaInStore as unknown as DtoSchema;
}

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
 * Helper function for using tanstack query with react router
 */
export const schemaQuery = () => ({
    queryKey: ['schema'],
    queryFn: () => getSchema(),
});

/**
 * Function for router - loads data on route load
 * @param queryClient
 */
export const loader = (queryClient: any) => async () => {
    if (!queryClient.getQueryData(schemaQuery().queryKey))
        await queryClient.fetchQuery(schemaQuery());
    return null;
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
