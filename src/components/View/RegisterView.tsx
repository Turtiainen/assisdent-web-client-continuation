/**
 * TODO
 * Cleanup; figure out why mutation.mutate() causes infinite loop
 */


import React, {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {getEntitiesForRegisterView} from "../../services/backend";

export type DataProps = {
  view: Element | undefined | null
}

const parseRegisterMetaView = (view: Element | undefined | null) => {
  if (!view) return null

  const columns: string[] = []
  const bindings: string[] = []

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
      bindings.push(element.getAttribute("Text")!)
      columns.push(captionOverride ?? getColumnHeader(element))

    } else if (element.tagName === "Element") {
      bindings.push(element.getAttribute("Value")!)
      columns.push(captionOverride ?? getColumnHeader(element))
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

const parseOrderOptions = (view: Element) => {
  const orderOptions = view.getElementsByTagName("OrderOptions")[0]?.children

  if (orderOptions && orderOptions.length > 0)
    return orderOptions!.item(0)!.getAttribute("OrderingName")

  return null
}

const getObjectPropertyByString = (obj: any, path: string) => {
  return path.split('.').reduce((prev, cur) => prev[cur], obj)
}

export const RegisterView = ({view}: DataProps) => {
  const [fetchedEntities, setFetchedEntities] = useState<any | null>(null)

  console.log(view)

  const header = view!.getAttribute("Header")
  const entityType = view!.getAttribute("EntityType")
  const viewName = view!.getAttribute("Name")

  const orderBy = parseOrderOptions(view!)

  const searchOptions = {
    entityType,
    viewName,
    currentPage: 0,
    orderBy
  }

  const mutation = useMutation({
    mutationFn: getEntitiesForRegisterView,
    onSuccess: data => setFetchedEntities(data.Results)
  })

  const {columns, bindings} = parseRegisterMetaView(view)!

  let trimmedBindings = bindings.map(b => {
    if (b.startsWith("{Binding")) {
      return b.substring(8).trim().slice(0, length - 1)
    }
    return b
  })

  return (
    <div>
      <button onClick={() => mutation.mutate(searchOptions)}>Fetch table data</button>
      {mutation.isLoading && <h2 className="text-2xl">Loading...</h2>}
      <>
        <h2 className="text-2xl">{header}</h2>
        <p>This entity is of type {entityType}</p>
        <p>The viewName of this entity is {viewName}</p>
        {orderBy && <p>These element are sorted based on {orderBy} by default.</p>}
        <table className="border-collapse border border-slate-500">
          <thead>
          <tr>
            {columns?.map((c, idx) => <th key={idx}>{c}</th>)}
          </tr>
          </thead>
          {(fetchedEntities && fetchedEntities?.length > 0) && <tbody>
          {fetchedEntities.map((entity: any, idx: React.Key) => {
            return (
              <tr key={idx}>
                {trimmedBindings.map((binding: string, idx) => {
                  return (<td className="text-left" key={idx}>{binding.startsWith('{') ? binding : getObjectPropertyByString(entity, binding)}</td>)
                })}
              </tr>)
          })}
          </tbody>}
        </table>
      </>
    </div>
  )
}
