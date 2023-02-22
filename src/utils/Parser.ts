import {getData} from "../services/backend";

type MetaView = {
  XML: string
}

export const getRegisterViews = async () => {

  return await getData().then(result => {
    const xmlMetaViewList = result.MetaViews
    const xmlParser = new DOMParser()
    const listOfMetaViews: Document[] = []

    xmlMetaViewList.map((metaView: MetaView) => listOfMetaViews.push(xmlParser.parseFromString(metaView.XML, "text/xml")))
    return listOfMetaViews.filter(doc => doc.children[0].attributes[4].nodeValue!.endsWith("RegisterView"))
  })
}
