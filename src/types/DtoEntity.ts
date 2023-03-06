import {DtoProperty} from "./DtoProperty";
import {DtoObject} from "./DtoObject";
import {DtoEntityMetadata} from "./DtoEntityMetadata";
import {DtoPropertyDependency} from "./DtoPropertyDependency";
import {DtoValidatorDependency} from "./DtoValidatorDependency";
import {DtoEntityFilter} from "./DtoEntityFilter";
import {DtoOrderOption} from "./DtoOrderOption";
import {DtoEntityValidatorGroup} from "./DtoEntityValidatorGroup";
import {DtoExports} from "./DtoExports";
import {DeleteBehaviorType} from "./DeleteBehaviorType";

export type DtoEntity = {
  BasedOnEntity: string
  Properties: { [index: string]: DtoProperty }
  PropertyDependencies: DtoPropertyDependency[]
  ValidatorDependencies: DtoValidatorDependency[]
  Filters: { [index: string]: DtoEntityFilter }
  OrderOptions: { [index: string]: DtoOrderOption }
  ValidatorGroups: { [index: string]: DtoEntityValidatorGroup }
  DeleteBehavior?: DeleteBehaviorType
  ValidityFilterDefaultValue?: number
  Exports: DtoExports
  LogType?: number
  RelatedObjectType?: number
  Metadata: DtoEntityMetadata
} & DtoObject
