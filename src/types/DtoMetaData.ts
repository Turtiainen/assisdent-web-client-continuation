import {DtoFeaturesCollection} from "./DtoFeaturesCollection";
import {DtoEntity} from "./DtoEntity";
import {DtoCatalog} from "./DtoCatalog";

export type DtoMetaData = {
  EnabledFeatures: DtoFeaturesCollection
  Entities: DtoEntity[]
  Catalogs: DtoCatalog[]
}
