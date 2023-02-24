import {DtoObject} from "./DtoObject";
import {DtoEntityValidator} from "./DtoEntityValidator";
import {ActionContextState} from "./ActionContextState";

export type DtoEntityValidatorGroup = {
  IsRecursive: boolean
  IsEntityModificationGroup: boolean
  Validators: DtoEntityValidator[]
  MinimumActionContextState: ActionContextState
} & DtoObject
