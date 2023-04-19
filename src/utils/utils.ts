import { DynamicObject } from '../types/DynamicObject';
import {
    getEntityPropertiesSchema,
    getEntitySchema,
    getEntityToString,
    getFormattedText,
} from '../temp/SchemaUtils';
import Handlebars from 'handlebars';
import { DtoEntity } from '../types/DtoEntity';
import { mapObjectValueByIntendedUse } from './mapUtils';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './constants';

enum BindingKind {
    BINDING,
    FORMATTED_TEXT,
}

const getBindingType = (rawBinding: string) => {
    if (rawBinding.startsWith('{Binding')) return BindingKind.BINDING;
    if (rawBinding.startsWith('{FormattedText'))
        return BindingKind.FORMATTED_TEXT;
    return null;
};

export const tryToGetProp = (
    entity: DynamicObject,
    path: string | string[],
) => {
    if (typeof path === 'string')
        path = path.replace(/\[["'`](.*)["'`]\]/g, '.$1').split('.');

    return path.reduce(
        (prev: DynamicObject, cur: string) => prev && prev[cur],
        entity,
    );
};

export const tryToGetSchema = (
    entityType: string | null,
    path: string | string[],
) => {
    if (entityType === null) return;

    if (typeof path === 'string')
        path = path.replace(/\[["'`](.*)["'`]\]/g, '.$1').split('.');

    return path.reduce((prev: DtoEntity | undefined, cur) => {
        return prev && getEntitySchema(prev.Properties[cur]?.Type);
    }, getEntitySchema(entityType));
};

const resolveFormattedText = (
    entity: DynamicObject,
    identifier: string,
    entityType: string | null,
) => {
    let path: string[] | undefined;
    let finalEntity: DynamicObject | undefined;
    // let formattedText: string | undefined;

    // Should use subEntity's property
    if (identifier.toLowerCase().includes('path=')) {
        const arr = identifier.split(';;');
        identifier = arr.shift()!;
        path = arr.map((p) => p.trim().substring(5));
    }

    if (path) finalEntity = tryToGetProp(entity, path);

    // Failed to find entityProperty with the given path
    if (path && !finalEntity) return;

    if (identifier.includes('$EntityToString')) {
        if (path) {
            const finalTypeSchema = tryToGetSchema(entityType, path);
            return parseHandlebars(
                finalTypeSchema?.Metadata.Metadata.$Entity.ToString,
                finalEntity,
            );
        }

        const entityToString = getEntityToString(entityType);
        return parseHandlebars(entityToString, entity);
    }

    const formattedText = getFormattedText(identifier);
    if (!formattedText) return;

    if (finalEntity) return parseHandlebars(formattedText, finalEntity);

    return parseHandlebars(formattedText, entity);
};

const resolveUnhandledArray = (
    entity: DynamicObject,
    sanitizedBinding: string,
    entityType: string | null,
) => {
    const arr = tryToGetProp(entity, sanitizedBinding);
    if (!arr || arr.length < 1) return null;

    const propertySchema = getEntityPropertiesSchema(entityType);

    // TODO Hacky fix for card views, should be improved
    if (sanitizedBinding.includes('Entity.'))
        sanitizedBinding = sanitizedBinding.replace('Entity.', '');

    const toStringMethod = getEntityToString(
        propertySchema?.[sanitizedBinding]?.SubType?.Type,
    );

    return arr
        .map((item: DynamicObject) => parseHandlebars(toStringMethod, item))
        .join(', ');
};

const resolveObjectBindings = (
    entity: DynamicObject,
    sanitizedBinding: string,
    entityType: string | null,
    value: any,
): undefined | string => {
    // We get the property schema of the entity, then find the logical association to another entity given in the schema
    const propertySchema = getEntityPropertiesSchema(entityType);
    const associationEntityName =
        propertySchema?.[sanitizedBinding]?.AssociationInfo
            ?.LogicalAssociationEndEntityName;
    // Getting the associated entity schema
    const associatedEntitySchema = getEntitySchema(associationEntityName);
    // Getting the metadata of the associated entity
    const associatedEntityMetadata = associatedEntitySchema?.Metadata.Metadata;

    // Reducing the value properties with intended use
    // This is done by finding the keys of associated entity metadata, that are also keys of the value object.
    const valuePropertiesWithIntendedUse = Object.keys(
        associatedEntityMetadata as DynamicObject,
    ).reduce((acc, key) => {
        if (associatedEntityMetadata && Object.keys(value).includes(key)) {
            acc[key] = associatedEntityMetadata[key].IntendedUse;
        }
        return acc;
    }, {} as DynamicObject);

    // Create a copy of the value object, we don't want to mutate the original value
    const valueObjectToParse = { ...value };
    // Iterate through the keys of the value and replace the value with the intended use
    for (const [key, val] of Object.entries(valueObjectToParse)) {
        if (Object.keys(valuePropertiesWithIntendedUse).includes(key)) {
            valueObjectToParse[key] = mapObjectValueByIntendedUse(
                val,
                valuePropertiesWithIntendedUse[key],
            );
        }
    }

    // To String method of the associated entity defines how the object is displayed
    return parseHandlebars(
        associatedEntityMetadata?.$Entity.ToString,
        valueObjectToParse,
    );
};

// TODO refactor into smaller functions
export const resolveEntityBindings = (
    entity: DynamicObject,
    bindings: string[][],
    entityType: string | null,
): string[][] => {
    return bindings.map((rawBindings: Array<string>) => {
        return rawBindings.map((rawBinding: string) => {
            let value: any = rawBinding;

            const bindingType = getBindingType(rawBinding);

            if (bindingType === null) {
                console.log(`Unknown Binding Type:`, rawBinding);
                return;
            }

            const sanitizedBinding =
                bindingType === BindingKind.BINDING
                    ? rawBinding.substring(8).trim().slice(0, -1)
                    : rawBinding.substring(14).trim().slice(0, -1);

            if (bindingType === BindingKind.BINDING) {
                value = tryToGetProp(entity, sanitizedBinding);
            } else if (bindingType === BindingKind.FORMATTED_TEXT) {
                value = resolveFormattedText(
                    entity,
                    sanitizedBinding,
                    entityType,
                );
            }
            if (bindingType === BindingKind.BINDING) {
                value = tryToGetProp(entity, sanitizedBinding);
            } else if (bindingType === BindingKind.FORMATTED_TEXT) {
                value = resolveFormattedText(
                    entity,
                    sanitizedBinding,
                    entityType,
                );
            }

            // TODO This breaks things when an array is returned above
            if (Array.isArray(value)) {
                return resolveUnhandledArray(
                    entity,
                    sanitizedBinding,
                    entityType,
                );
            }

            if (typeof value === 'object' && value !== null) {
                value = resolveObjectBindings(
                    entity,
                    sanitizedBinding,
                    entityType,
                    value,
                );
            }

            return value ?? '-';
        });
    });
};

export const sanitizeBinding = (binding: string) => {
    const bindingType = getBindingType(binding);

    if (bindingType === null) {
        console.log(`Unknown Binding Type:`, binding);
        return binding;
    }

    return bindingType === BindingKind.BINDING
        ? binding.substring(8).trim().slice(0, -1) // BindingKind.BINDING
        : binding.substring(14).trim().slice(0, -1); // BindingKind.FORMATTED_TEXT
};

const resolveCardFormattedText = (
    entity: DynamicObject,
    identifier: string,
) => {
    let path: string[] | undefined;
    let finalEntity: DynamicObject | undefined;
    // let formattedText: string | undefined;

    // Should use subEntity's property
    if (identifier.toLowerCase().includes('path=')) {
        const arr = identifier.split(';;');
        identifier = arr.shift()!;
        path = arr.map((p) => p.trim().substring(5));
    }

    if (path) finalEntity = tryToGetProp(entity, path);

    // Failed to find entityProperty with the given path
    if (path && !finalEntity) return;

    const formattedText = getFormattedText(identifier);
    if (!formattedText) return;

    if (finalEntity) return parseHandlebars(formattedText, finalEntity);

    return parseHandlebars(formattedText, entity);
};

export const resolveCardBindings = (
    entity: DynamicObject | null,
    binding: string,
) => {
    if (!entity) return binding;

    const bindingType = getBindingType(binding);
    const sanitizedBinding = sanitizeBinding(binding);

    if (!sanitizedBinding) return null;

    if (bindingType === BindingKind.BINDING)
        return tryToGetProp(entity, sanitizedBinding);

    if (bindingType === BindingKind.FORMATTED_TEXT)
        return resolveCardFormattedText(entity, sanitizedBinding);

    return binding;
};

export const parseHandlebars = (hbrTemplate: string | undefined, data: any) => {
    if (!hbrTemplate) return;
    const template = Handlebars.compile(hbrTemplate);
    return template(data);
};

export const getUserLanguage = () => {
    let lang: string;
    if (navigator.languages !== undefined)
        lang = navigator.languages[0].split('-')[0];
    else lang = navigator.language.split('-')[0];

    return lang in SUPPORTED_LANGUAGES ? lang : DEFAULT_LANGUAGE;
};
