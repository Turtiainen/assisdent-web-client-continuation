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
  Properties: Map<string, DtoProperty>
  PropertyDependencies: DtoPropertyDependency[]
  ValidatorDependencies: DtoValidatorDependency[]
  Filters: Map<string, DtoEntityFilter>
  OrderOptions: Map<string, DtoOrderOption>
  ValidatorGroups: Map<string, DtoEntityValidatorGroup>
  DeleteBehavior?: DeleteBehaviorType
  ValidityFilterDefaultValue?: number
  Exports: DtoExports
  LogType?: number
  RelatedObjectType?: number
  Metadata: DtoEntityMetadata
} & DtoObject
