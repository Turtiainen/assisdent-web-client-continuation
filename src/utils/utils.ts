import {DynamicObject} from "../types/DynamicObject";
import {getEntityPropertiesSchema, getEntitySchema, getEntityToString, getFormattedText} from "../temp/SchemaUtils";
import Handlebars from "handlebars"
import {DtoEntity} from "../types/DtoEntity";

enum BindingKind {
  BINDING,
  FORMATTED_TEXT
}

const getBindingType = (rawBinding: string) => {
  if (rawBinding.startsWith("{Binding")) return BindingKind.BINDING
  if (rawBinding.startsWith("{FormattedText")) return BindingKind.FORMATTED_TEXT
  return null
}

export const tryToGetProp = (entity: DynamicObject, path: string | string[]) => {
  if (typeof path === 'string')
    path = path.replace(/\[["'`](.*)["'`]\]/g, ".$1").split(".")

  return path.reduce((prev: DynamicObject, cur: string) => prev && prev[cur], entity)
}

export const tryToGetSchema = (entityType: string | null, path: string | string[]) => {
  if (entityType === null) return

  if (typeof path === 'string')
    path = path.replace(/\[["'`](.*)["'`]\]/g, ".$1").split(".")

  return path.reduce((prev: DtoEntity | undefined, cur) => {
    return prev && getEntitySchema(prev.Properties[cur].Type)
  }, getEntitySchema(entityType))
}

const resolveFormattedText = (
  entity: DynamicObject,
  rawString: string,
  entityType: string | null
) => {
  if (getBindingType(rawString) !== BindingKind.FORMATTED_TEXT) return

  let identifier = rawString.substring(14).trim().slice(0, -1)
  let path: string[] | undefined
  let finalEntity: DynamicObject | undefined
  let formattedText: string | undefined

  // Should use subEntity's property
  if (identifier.toLowerCase().includes("path=")) {
    const arr = identifier.split(";;")
    identifier = arr.shift()!
    path = arr.map((p) => p.trim().substring(5))
  }

  if (path)
    finalEntity = tryToGetProp(entity, path)

  // Failed to find entityProperty with the given path
  if (path && !finalEntity) return

  if (identifier.includes("$EntityToString")) {

    if (path) {
      const finalTypeSchema = tryToGetSchema(entityType, path)
      return parseHandlebars(finalTypeSchema?.Metadata.Metadata.$Entity.ToString, finalEntity)
    }

    const entityToString = getEntityToString(entityType)
    return parseHandlebars(entityToString, entity)
  }

  formattedText = getFormattedText(identifier)
  if (!formattedText) return

  if (finalEntity)
    return parseHandlebars(formattedText, finalEntity)

  return parseHandlebars(formattedText, entity)
}

const resolveUnhandledArray = (entity: DynamicObject, sanitizedBinding: string, entityType: string | null) => {
  const arr = entity[sanitizedBinding]
  if (arr.length < 1) return null

  const propertySchema = getEntityPropertiesSchema(entityType)
  const toStringMethod = getEntityToString(propertySchema?.[sanitizedBinding]?.SubType?.Type)

  return arr.map((item: DynamicObject) => parseHandlebars(toStringMethod, item)).join(", ")
}

// TODO debugger function, can be removed when no longer needed
const recursivelyLogEntityKeysAndValues = (entity: DynamicObject) => {
  for (const [key, value] of Object.entries(entity)) {
    console.log(`key: ${key}, value: ${value}`);
    if (typeof value === 'object' && value !== null) {
      recursivelyLogEntityKeysAndValues(value);
    }
  }
}

// TODO is there some other types of intended use?
const mapObjectValueByIntendedUse = (value: any, intendedUse: string) => {
  if (intendedUse === 'Percentage') {
    return `${(parseFloat(value) * 100)}%`
  }
  return value;
}

const resolveObjectBindings = (entity: DynamicObject, sanitizedBinding: string, entityType: string | null, value: any) => {
  // console.log(`entity[sanitizedBinding]: ${entity[sanitizedBinding]}`);
  // recursivelyLogEntityKeysAndValues(entity[sanitizedBinding]);
  // console.log(`sanitizedBinding: ${sanitizedBinding}`);
  // console.log(`entityType: ${entityType}`);

  // We get the property schema of the entity, then find the logical association to another entity given in the schema
  const propertySchema = getEntityPropertiesSchema(entityType);
  const associationEntityName = propertySchema?.[sanitizedBinding]?.AssociationInfo?.LogicalAssociationEndEntityName;
  // Getting the associated entity schema
  const associatedEntitySchema = getEntitySchema(associationEntityName);
  // Getting the metadata of the associated entity
  const associatedEntityMetadata = associatedEntitySchema?.Metadata.Metadata;

  // Reduce the keys of associated entity metadata, that are also keys of the value object. This way we get the intended use of the value object
  const valuePropertiesWithIntendedUse = Object.keys(associatedEntityMetadata as DynamicObject).reduce((acc, key) => {
    console.log('key', key);
    if (Object.keys(value).includes(key)) {
      if (associatedEntityMetadata) {
        acc[key] = associatedEntityMetadata[key].IntendedUse;
      }
    }
    return acc;
  }, {} as DynamicObject);

  // Create a copy of the value object, we don't want to mutate the original value
  const valueObjectToParse = {...value};
  // Iterate through the keys of the value and replace the value with the intended use
  for (const [key, val] of Object.entries(valueObjectToParse)) {
    if (Object.keys(valuePropertiesWithIntendedUse).includes(key)) {
      console.log('val', val);
      valueObjectToParse[key] = mapObjectValueByIntendedUse(val, valuePropertiesWithIntendedUse[key]);
    }
  }

  // To String method of the associated entity defines how the object is displayed
  return parseHandlebars(associatedEntityMetadata?.$Entity.ToString, valueObjectToParse);
}

// TODO refactor into smaller functions
export const resolveEntityBindings = (
  entity: DynamicObject,
  bindings: string[],
  entityType: string | null
) => {
  return bindings.map((rawBinding: string) => {
    let value: any = rawBinding

    const bindingType = getBindingType(rawBinding)

    if (bindingType === null) {
      console.log(`Unknown Binding Type:`, rawBinding)
      return
    }

    const sanitizedBinding = bindingType === BindingKind.BINDING
      ? rawBinding.substring(8).trim().slice(0, -1)
      : rawBinding.substring(14).trim().slice(0, -1)

    if (bindingType === BindingKind.BINDING) {
      value = tryToGetProp(entity, sanitizedBinding)
    } else if (bindingType === BindingKind.FORMATTED_TEXT) {
      value = resolveFormattedText(entity, value, entityType)
    }

    if (Array.isArray(value))
      return resolveUnhandledArray(entity, sanitizedBinding, entityType)

    if (typeof value === 'object' && value !== null) {
      value = resolveObjectBindings(entity, sanitizedBinding, entityType, value) ?? "-";
    }

    return value ?? "-"
  })
}

export const parseHandlebars = (hbrTemplate: string | undefined, data: any) => {
  if (!hbrTemplate) return
  const template = Handlebars.compile(hbrTemplate)
  return template(data)
}
