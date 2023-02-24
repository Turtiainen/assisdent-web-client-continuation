import {DtoAssociationEntityInfo} from "./DtoAssociationEntityInfo";
import {AssociationType} from "./AssociationType";

export type DtoAssociationInfo = {
  AssociationType: AssociationType
  IsParent: boolean
  AssociationEntityInfo: DtoAssociationEntityInfo
  LogicalAssociationEndFilterName: string
  LogicalAssociationEndEntityName: string
  LogicalAssociationEndFilterArguments: string // TODO: use object[] instead of string
}
