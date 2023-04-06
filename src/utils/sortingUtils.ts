export const sortByDocumentName = (a: Document, b: Document): number => {
  const aName = a.documentElement.getAttribute("Name")!
  const bName = b.documentElement.getAttribute("Name")!
  return (aName === bName) ? 0 : (aName < bName) ? -1 : 1
}

export const sortByDocumentHeader = (a: Document, b: Document): number => {
  const aName = a.documentElement.getAttribute("Header")!
  const bName = b.documentElement.getAttribute("Header")!
  return (aName === bName) ? 0 : (aName < bName) ? -1 : 1
}
