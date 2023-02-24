import {DtoTypeName} from "./DtoTypeName";
import {DtoObject} from "./DtoObject";
import {DtoAssociationInfo} from "./DtoAssociationInfo";
import {DateTypePrecision} from "./DateTypePrecision";
import {PropertyValueMutabilityType} from "./PropertyValueMutabilityType";

export type DtoProperty = {
  Type: string
  IsIdentity: boolean
  IsNullable: boolean
  SubType: DtoTypeName
  IsFixed: boolean
  IsMerged: boolean
  Mutability: PropertyValueMutabilityType
  IsRealAssociation: boolean
  AssociationInfo: DtoAssociationInfo
  CanModifyData: boolean
  CanModifyRelationship: boolean
  DefaultValueTemplate: object
  IsCalculated: boolean
  CalculatedPropertyDependsOn: string[]
  IsEntityMetadataProperty: boolean
  DateTypePrecision?: DateTypePrecision
  IsSharedEntity: boolean
  IsDefaultValuePrimitive: boolean
} & DtoObject & DtoTypeName
