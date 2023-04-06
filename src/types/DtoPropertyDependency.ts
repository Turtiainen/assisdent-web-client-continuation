import {DtoDependencyBase} from "./DtoDependencyBase";
import {ActionContextState} from "./ActionContextState";

export type DtoPropertyDependency = {
  TargetPropertyName: string
  TargetEntityTypeName: string
  TargetPropertyFilterName: string
  TargetFilterPath: string
  ActionContextState?: ActionContextState
} & DtoDependencyBase
