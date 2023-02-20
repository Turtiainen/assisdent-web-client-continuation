export type DataProps = {
  view: Element | undefined | null
}

// Parse child elements of a MetaView

const parseViewXml = (view: Element | undefined | null) => {
  if (!view) return null

  const header = view.getAttribute("Header")
  const entityType = view.getAttribute("EntityType")
  let orderBy = null
  const columns = []

  const orderOptions = view.attributes["OrderOptions"]?.children

  if (orderOptions && orderOptions.childNodes.length > 0) {
    orderBy = orderOptions!.firstChild!.getAttribute("OrderingName")
  }

  const getColumnHeader = (element: Element): string => {
    return element.getAttribute("ColumnHeader")! || element.getAttribute("Caption")!
  }

  const captionOverrides: string[] = []

  const getColumnsRecursively = (element: Element) => {
    if (!element) return

    console.log(element.tagName)

    let captionAdded = false
    if (element.tagName === "Group") {
      captionOverrides.push(getColumnHeader(element))
      captionAdded = true
    }

    const captionOverride = captionOverrides.length > 0 ? captionOverrides[captionOverrides.length - 1] : null

    if (element.tagName === "Button") {
      // columns.push()
      console.log("element.name === Button")
    } else if (element.tagName === "Element") {
      console.log("element.name === Element")
    }

    for (const child of element.children) {
      getColumnsRecursively(child)
    }
  }

  if (view.getElementsByTagName("RegisterItem")) {
    getColumnsRecursively(view?.getElementsByTagName("RegisterItem")[0]?.getElementsByTagName("Content")[0])
  }
  // getColumnsRecursively(currentDocument["RegisterItem"]["Content"])

  // return <p>{view?.getAttribute("Name")}</p>
  console.log(view)
  return "Finished"
}

export const ShowViewContent = ({view}: DataProps) => {

  // console.log(parseViewXml(view))

  return (
    <div className="view-content">
      {view ? <h2>{view.getAttribute("Header")}</h2> : ""}
    </div>
  )
}
