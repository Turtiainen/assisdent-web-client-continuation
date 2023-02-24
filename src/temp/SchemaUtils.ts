import json from './schema.json'
import {DtoSchema} from "../types/DtoSchema";

export const getFormattedText = (identifier: string) => {
  if (identifier.startsWith("{")) return identifier
  if (identifier.includes(";;")) return identifier

  const schema = json as DtoSchema
  return schema.FormattedTexts.find((ft) => ft.Identifier === identifier)?.Text
}
