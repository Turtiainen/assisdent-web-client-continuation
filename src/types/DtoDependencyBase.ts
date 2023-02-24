import {DtoObject} from "./DtoObject";

export type DtoDependencyBase = {
  SourcePropertyName: string
  IgnoreDependentOnValue: Set<object>
  NegateIgnoreDependentOnValue: boolean
} & DtoObject
