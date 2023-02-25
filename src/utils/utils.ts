import {DynamicObject} from "../types/DynamicObject";
import {getFormattedText} from "../temp/SchemaUtils";
import Handlebars from "handlebars"

export const getProp = (obj: DynamicObject, path: string) => {
  path = path.replace(/\[["'`](.*)["'`]\]/g,".$1")
  return path.split('.').reduce((prev: any, cur) => {
    return prev && prev[cur]
  }, obj)
}

// TODO refactor into smaller functions
export const resolveEntityBindings = (entity: DynamicObject, bindings: string[], extraInfo?: { property: string, subType: string, "toString": string }) => {
  return bindings.map((rawBinding: string) => {
    let value: any = rawBinding

    if (value?.startsWith("{Binding")) {
      value = getProp(entity, rawBinding.substring(8).trim().slice(0, length - 1))
    }
    else if (value?.startsWith("{FormattedText")) {
      value = getFormattedText(rawBinding.substring(14).trim().slice(0, length - 1))
      if (value.startsWith("{{")) {
        value = parseHandlebars(value, entity)
      }
    }

    if (Array.isArray(value) && value.length > 0) {
      if (extraInfo) {
        const arr = entity[extraInfo.property]
        let result = []
        result = arr.map((item: DynamicObject) => {
          return parseHandlebars(extraInfo["toString"], item)
        })
        value = result.join(", ")
        return value
      }
    } else if (Array.isArray(value) && value.length < 1) {
      value = null
    }

    if (typeof value === 'object' && value !== null) {
      console.log(value)
      value = "OBJECT"
    }

    if (!value) {
      value = "-"
    }

    return value
  })
}

export const parseHandlebars = (hbrTemplate: string | undefined, data: any) => {
  if (!hbrTemplate) return
  const template = Handlebars.compile(hbrTemplate)
  return template(data)
}
