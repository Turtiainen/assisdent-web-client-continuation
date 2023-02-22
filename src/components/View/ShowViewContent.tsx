import React from "react";

export type DataProps = {
  view: Element | undefined | null
}

type ViewAttributes = {
  attributes: string[]
}


// Parse child elements of a MetaView

const parseViewXml = (view: Element | undefined | null) => {
  if (!view) return null

  const header = view.getAttribute("Header")
  const entityType = view.getAttribute("EntityType")
  let orderBy = null
  const columns = []

  const content: React.ReactNode[] = [];

  const orderOptions = view.getElementsByTagName("OrderOptions")[0]?.children

  if (orderOptions && orderOptions.length > 0) {
    orderBy = orderOptions!.item(0)!.getAttribute("OrderingName")
  }

  const getColumnHeader = (element: Element): string => {
    return element.getAttribute("ColumnHeader")! || element.getAttribute("Caption")!
  }

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
      const buttonText = element.getAttribute("Text")
      content.push(<button className={"bg-blue-700"} onClick={() => console.log(`Clicked button ${buttonText}`)}>{buttonText}</button>)
    } else if (element.tagName === "Element") {
      content.push(<p>{element.getAttribute("Value")}</p>)
    }

    for (const child of element.children) {
      getColumnsRecursively(child)
    }
  }

  if (view.getElementsByTagName("RegisterItem")) {
    getColumnsRecursively(view?.getElementsByTagName("RegisterItem")[0]?.getElementsByTagName("Content")[0])
  }

  return content
}

export const ShowViewContent = ({view}: DataProps) => {

  const viewContent = parseViewXml(view)
  console.log(view)

  return (
    <div className="view-content">
      {view ? <h2 className={"text-2xl mb-8"}>{view.getAttribute("Header")}</h2> : ""}
      {viewContent?.map((component, idx) => (
        <React.Fragment key={idx}>
          { component }
        </React.Fragment>
      ))}
    </div>
  )
}
