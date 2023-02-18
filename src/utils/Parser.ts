import {getData} from "../services/backend";

export const getRegisterViews = async () => {

  return await getData().then(result => {
    const xmlMetaViewList = result.MetaViews
    const xmlParser = new DOMParser()
    const listOfViews: Document[] = []

    xmlMetaViewList.map((view: Document) => listOfViews.push(xmlParser.parseFromString(view.XML, "text/xml")))
    return listOfViews.filter(doc => doc.children[0].attributes[4].nodeValue!.endsWith("RegisterView"))
  })
}
