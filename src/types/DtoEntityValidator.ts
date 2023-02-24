import {DtoObject} from "./DtoObject";
import {ActionContextState} from "./ActionContextState";
import {ValidationType} from "./ValidationType";

export type DtoEntityValidator = {
  Significance?: ValidationType
  Properties: string[]
  CustomImplementationName: string
  FixedArguments: object[]
  ArgumentPaths: string[]
  FailMessageOverride: string
  Negate: boolean
  ActionContextState?: ActionContextState
} & DtoObject
