export type DataProps = {
  view: HTMLElement | undefined | null
}
export const ShowViewContent = ({view}: DataProps) => {

  // const parseViewXml = () => {
  //   if (!view) return null
  //
  //   const header = view.attributes["Header"].value
  //   const entityType = view.attributes["EntityType"].value
  //   let orderBy = null
  //   const columns = []
  //
  //   const orderOptions = view.attributes["OrderOptions"]
  //
  //   if (orderOptions && orderOptions.childNodes.length > 0) {
  //     orderBy = orderOptions!.firstChild!.attributes["OrderingName"].value
  //   }
  //
  //   const getColumnHeader = (element: HTMLElement): string => {
  //     return element.attributes["ColumnHeader"]?.value || element.attributes["Caption"]?.value
  //   }
  //
  //   const captionOverrides: string[] = []
  //
  //   const getColumnsRecursively = (element: HTMLElement) => {
  //     if (!element) return
  //
  //     console.log(element)
  //
  //     let captionAdded = false
  //     if (element.name === "Group") {
  //       captionOverrides.push(getColumnHeader(element))
  //       captionAdded = true
  //     }
  //
  //     const captionOverride = captionOverrides.length > 0 ? captionOverrides[captionOverrides.length-1] : null
  //
  //     if (element.name === "Button") {
  //       // columns.push()
  //       console.log("element.name === Button", element.name)
  //     } else if (element.name === "Element") {
  //       console.log("element.name === Element", element.name)
  //     }
  //   }
  //
  //   if (view["RegisterItem"]) {
  //     getColumnsRecursively(view["RegisterItem"]["Content"])
  //   }
  //   // getColumnsRecursively(currentDocument["RegisterItem"]["Content"])
  //
  //   return <p>{view?.attributes["Name"].nodeValue}</p>
  // }

  return (
    <div className="view-content">
      {view ? <h2>{view.attributes["Header"].value}</h2> : ""}
    </div>
  )
}
