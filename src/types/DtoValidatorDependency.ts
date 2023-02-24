import {DtoDependencyBase} from "./DtoDependencyBase";

export type DtoValidatorDependency = {
  TargetValidatorName: string
  PathToTargetValidatorRoot: string
} & DtoDependencyBase
