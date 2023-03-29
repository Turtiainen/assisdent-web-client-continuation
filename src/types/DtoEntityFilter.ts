import {DtoObject} from "./DtoObject";
import {DtoTypeName} from "./DtoTypeName";
import {DateTypePrecision} from "./DateTypePrecision";

export type DtoEntityFilter = {
  FilterType: string
  IsNullable: boolean
  FilterValueType: DtoTypeName
  DefaultValue: object
  IsIdentityPropertyFilter: boolean
  DateTypePrecision?: DateTypePrecision
} & DtoObject
