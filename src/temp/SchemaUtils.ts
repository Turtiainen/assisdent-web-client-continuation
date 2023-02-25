import json from './schema.json'
import {DtoSchema} from "../types/DtoSchema";
import {DtoEntity} from "../types/DtoEntity";

const schema = json as DtoSchema

export const getFormattedText = (identifier: string) => {
  if (identifier.startsWith("{")) return identifier
  if (identifier.includes(";;")) return identifier
  return schema.FormattedTexts.find((ft) => ft.Identifier === identifier)?.Text
}

/**
 * Finds an entity schema from schema.json, based on entity name
 * @param names 0..* strings
 */
export const findEntitySchema = (...names: string[]) => {
  const allEntities = schema.MetaData.Entities

  if (names.length > 0) {
    return allEntities.filter((entity: DtoEntity) => names.includes(entity.Name))
  } else {
    console.log("entiteettejä on yht: ", allEntities.length)
    console.log()

    allEntities.map((entity: DtoEntity) => {
      console.log(entity.Name)
    })
  }
}

export const getEntitySchema = (name: string | null) => {
  if (!name || name === '') return
  return schema.MetaData.Entities.find((e) => e.Name === name)
}

export const getEntityPropertiesSchema = (name: string | null) => {
  const entity = getEntitySchema(name)
  return entity?.Properties
}

export const getEntityToString = (name: string | null): string | undefined => {
  const entity = getEntitySchema(name)
  return entity?.Metadata?.Metadata?.["$Entity"]?.ToString
}
