import json from './schema.json'
import {DtoSchema} from "../types/DtoSchema";
import {ChangeEventHandler, useState} from "react";

export const PrintSchemaInfo = () => {
  const [filter, setFilter] = useState<string | null>(null)

  const filterDocuments: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    if (e.target.value === "")
      setFilter(null)
    else
      setFilter(e.target.value)
  }

  const data = json as DtoSchema
  const xmlParser = new DOMParser()
  const MetaViews = data.MetaViews
  const viewList: { ViewName: string, ViewChildren: HTMLCollection }[] = []
  let MetaViewXmlList = MetaViews.map((MetaView) => xmlParser.parseFromString(MetaView.XML, "text/xml"))

  if (filter !== null) {
    MetaViewXmlList = MetaViewXmlList.filter((doc) => {
      return doc
        .firstElementChild!
        .getAttribute("Name")!
        .toLowerCase()
        .includes(filter.toLowerCase())
    })
  }

  MetaViewXmlList.sort((a, b) => {
    const aName = a.firstElementChild!.getAttribute("Name")!
    const bName = b.firstElementChild!.getAttribute("Name")!
    if (aName === bName) return 0
    return aName < bName ? -1 : 1
  })

  MetaViewXmlList.forEach((doc) => {
    const ViewDefinitionCoreBase = doc.firstElementChild!
    const ViewName = ViewDefinitionCoreBase.getAttribute("Name")!
    const ViewChildren = ViewDefinitionCoreBase.children
    viewList.push({ViewName, ViewChildren})
  })

  const listStyles = ["circle", "square", "disc"]

  const printRecursive = (elements: HTMLCollection, elementList = [], level = 0) => {
    if (elements.length === 0) return null

    return Array.from(elements).map((element, idx) => {
      const Identifier = element.getAttribute("Identifier") ? ( ' Identifier="' + element.getAttribute("Identifier") + '"') : ""
      const Caption = element.getAttribute("Caption") ? ( ' Caption="' + element.getAttribute("Caption") + '"') : ""
      const Value = element.getAttribute("Value") ? (' Value="' + element.getAttribute("Value") + '"') : ""
      return (
        <li key={`${element.nodeName}-${idx}`}>
          <pre>{`<${element.nodeName}${(Caption || Identifier)}${Value}>`}</pre>
          {element.hasChildNodes()
            ? <ul className={`pl-4`}>{printRecursive(element.children, elementList, ++level % listStyles.length)}</ul>
            : null}
        </li>
      )
    })
  }

  const Print = viewList.map((obj) => {
    return (
      <div className={`flex py-4 border-b`}>
        <div className={`w-96`}>
          <h2 className={`text-xs font-bold`}>{obj.ViewName}</h2>
        </div>
        <div className={`flex-1`}>
          <ul className={`text-xs`}>
            {printRecursive(obj.ViewChildren)}
          </ul>
        </div>
      </div>
    )
  })

  return (
    <section className={`pl-4`}>
      <h1>Schema Info</h1>

      <div>
        <label htmlFor={`filter`}>Filter</label>
        <input
          type="text"
          id={`filter`}
          onChange={filterDocuments}
          className={`border rounded ml-2`}
        />
      </div>

      <>
        {Print}
      </>
    </section>
  )
}
