import {getSchema} from "../services/backend";
import {DtoView} from "../types/DtoView";
import {DtoSchema} from "../types/DtoSchema";

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

export const getRegisterViewsFromSchema = (schema: DtoSchema) => {
  const xmlParser = new DOMParser()
  const listOfMetaViews: Document[] = []

  schema.MetaViews?.map((metaView: DtoView) => {
    listOfMetaViews.push(xmlParser.parseFromString(metaView.XML, "text/xml"))
  })

  return listOfMetaViews.filter(doc => {
    return doc
      ?.getElementsByTagName("ViewDefinitionCoreBase")[0]
      ?.getAttribute("Name")
      ?.endsWith("RegisterView")
  })
}

export const getViewFromSchemaByName = (schema: DtoSchema, name: string) => {
  const xmlParser = new DOMParser()
  const listOfMetaViews: Document[] = []

  schema.MetaViews?.map((metaView: DtoView) => {
    listOfMetaViews.push(xmlParser.parseFromString(metaView.XML, "text/xml"))
  })

  return listOfMetaViews.find(view => {
    return view?.documentElement.getAttribute("Name") === name
  })
}

const getColumnHeader = (element: Element): string => {
  return element.getAttribute("ColumnHeader")! || element.getAttribute("Caption")!
}

const pushBindingsAndColumns = (element: Element, bindings: Array<Array<string>>, columns: string[], captionOverride: string | null, getAttributeBy: string) => {
  if (columns.length === 0 || (captionOverride ?? getColumnHeader(element)) !== columns[columns.length - 1]) {
    bindings.push([element.getAttribute(getAttributeBy)!])
    columns.push(captionOverride ?? getColumnHeader(element))
  } else {
    bindings[bindings.length - 1].push(element.getAttribute(getAttributeBy)!)
  }
}

export const parseRegisterMetaView = (view: Element) => {
  const columns: string[] = []
  const bindings: string[][] = []

  const captionOverrides: string[] = []

  const getColumnsRecursively = (element: Element) => {
    if (!element) return

    let captionAdded = false
    if (element.tagName === "Group") {
      captionOverrides.push(getColumnHeader(element))
      captionAdded = true
    }

    const captionOverride = captionOverrides.length > 0 ? captionOverrides[captionOverrides.length - 1] : null

    if (element.tagName === "Button") {
      pushBindingsAndColumns(element, bindings, columns, captionOverride, "Text");
    } else if (element.tagName === "Element") {
      pushBindingsAndColumns(element, bindings, columns, captionOverride, "Value");
    }

    for (const child of element.children) {
      getColumnsRecursively(child)
    }

    if (captionAdded)
      captionOverrides.pop()
  }

  if (view.getElementsByTagName("RegisterItem")) {
    getColumnsRecursively(
      view
        ?.getElementsByTagName("RegisterItem")[0]
        ?.getElementsByTagName("Content")[0]
    )
  }

  return {columns, bindings}
}

export const parseOrderOptions = (view: Element) => {
  const orderOptions = view.getElementsByTagName("OrderOptions")[0]?.children

  if (orderOptions && orderOptions.length > 0)
    return orderOptions!.item(0)!.getAttribute("OrderingName")

  return null
}
