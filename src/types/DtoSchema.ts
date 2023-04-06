import {DtoMetaData} from "./DtoMetaData";
import {DtoView} from "./DtoView";
import {DtoFormattedText} from "./DtoFormattedText";

export type DtoSchema = {
  MetaData: DtoMetaData
  MetaViews: DtoView[]
  FormattedTexts: DtoFormattedText[]
}
