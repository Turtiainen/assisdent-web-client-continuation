import {getSchema} from "../services/backend";
import {DtoView} from "../types/DtoView";

export const getRegisterViews = async () => {

  return await getSchema().then(result => {
    const xmlMetaViewList = result?.MetaViews
    const xmlParser = new DOMParser()
    const listOfMetaViews: Document[] = []

    xmlMetaViewList?.map((metaView: DtoView) => {
      listOfMetaViews.push(xmlParser.parseFromString(metaView.XML, "text/xml"))
    })

    return listOfMetaViews.filter(doc => {
      return doc
              ?.getElementsByTagName("ViewDefinitionCoreBase")[0]
              ?.getAttribute("Name")
              ?.endsWith("RegisterView")
    })
  })
}
