import {DtoObject} from "./DtoObject";
import {DtoTypeName} from "./DtoTypeName";

export type DtoCatalogEntry = {
  Key: object
  DisplayName: string
  FeatureKey: string
  IsDefault: boolean
}

export type DtoCatalog = {
  Entries: DtoCatalogEntry[]
  KeyType: DtoTypeName
  ValueType: DtoTypeName
} & DtoObject
