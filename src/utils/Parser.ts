import json from '../data/scratch_1.json'

export const getRegisterViews = (): Document[] => {
  const xmlMetaViewList = json.MetaViews
  const xmlParser = new DOMParser()
  const listOfXMLs: Document[] = []

  xmlMetaViewList.map((item: Document) => listOfXMLs.push(xmlParser.parseFromString(item.XML, "text/xml")))
  return listOfXMLs.filter(doc => doc.children[0].attributes[4].nodeValue!.endsWith("RegisterView"))
}
