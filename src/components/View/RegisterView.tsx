/**
 * TODO
 * Cleanup; figure out why mutation.mutate() causes infinite loop if done on component load
 */

import React, {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {getEntitiesForRegisterView} from "../../services/backend";
import {RegisterTable} from "./RegisterTable";
import {PrintEntities} from "../../temp/PrintEntities";
import {DynamicObject} from "../../types/DynamicObject";
import {getEntityPropertiesSchema} from "../../temp/SchemaUtils";

export type DataProps = {
  view: Element
}

const parseRegisterMetaView = (view: Element) => {
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

export const RegisterView = ({view}: DataProps) => {
  const [fetchedEntities, setFetchedEntities] = useState<DynamicObject[] | null>(null)

  const header = view.getAttribute("Header")
  const entityType = view.getAttribute("EntityType")
  const viewName = view.getAttribute("Name")
  const orderBy = parseOrderOptions(view)

  const {columns, bindings} = parseRegisterMetaView(view)

  const searchOptions = {
    entityType,
    viewName,
    currentPage: 0,
    orderBy
  }

  const mutation = useMutation({
    mutationFn: getEntitiesForRegisterView,
    onSuccess: data => {
      setFetchedEntities(data.Results)
    }
  })

  return (
    <div className={`py-2`}>
      <button
        className={`bg-blue-500 hover:bg-blue-400 p-1 text-white rounded my-2 mx-4 px-2`}
        onClick={() => mutation.mutate(searchOptions)}>
          Fetch table data
      </button>
      {mutation.isLoading && <h2 className="text-2xl">Loading...</h2>}
      <div className={`px-4`}>
        <h2 className="text-2xl">{header}</h2>
        <p>This entity is of type {entityType}</p>
        <p>The viewName of this entity is {viewName}</p>
        {orderBy && <p>These elements are sorted based on {orderBy} by default.</p>}
      </div>
      {
        (fetchedEntities && fetchedEntities.length > 0)
          && <RegisterTable
                columns={columns}
                entities={fetchedEntities}
                bindings={bindings}
                entityType={entityType}/>
      }
      {entityType && <PrintEntities entityType={entityType}/>}
    </div>
  )
}
