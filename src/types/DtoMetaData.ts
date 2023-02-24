import {DtoFeaturesCollection} from "./DtoFeaturesCollection";
import {DtoEntity} from "./DtoEntity";
import {DtoCatalog} from "./DtoCatalog";

export type DtoMetaData = {
  EnablesFeatures: DtoFeaturesCollection
  Entities: DtoEntity[]
  Catalogs: DtoCatalog[]
}
