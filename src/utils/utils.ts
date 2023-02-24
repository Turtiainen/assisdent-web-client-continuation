import {DynamicObject} from "../types/DynamicObject";
import {getFormattedText} from "../temp/SchemaUtils";

export const getProp = (obj: DynamicObject, path: string) => {
  path = path.replace(/\[["'`](.*)["'`]\]/g,".$1")
  return path.split('.').reduce((prev: any, cur) => {
    return prev && prev[cur]
  }, obj)
}

export const resolveEntityBindings = (entity: any, bindings: string[]) => {
  return bindings.map((rawBinding: string) => {
    let value: any = rawBinding

    if (value?.startsWith("{Binding")) {
      value = getProp(entity, rawBinding.substring(8).trim().slice(0, length - 1))
    }
    else if (value?.startsWith("{FormattedText")) {
      value = getFormattedText(rawBinding.substring(14).trim().slice(0, length - 1))
    }

    if (Array.isArray(value)) {
      value = "ARRAY"
    }

    if (typeof value === 'object' && value !== null) {
      value = "OBJECT"
    }

    if (!value) {
      value = "-"
    }

    return value
  })
}
