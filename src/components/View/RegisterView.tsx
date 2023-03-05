import React, {useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {getEntitiesForRegisterView} from "../../services/backend";
import {RegisterTable} from "./RegisterTable";
import {DynamicObject} from "../../types/DynamicObject";
import {parseRegisterMetaView, parseOrderOptions} from "../../utils/Parser";

export type DataProps = {
  view: Element
}

export const RegisterView = ({view}: DataProps) => {
  const [fetchedEntities, setFetchedEntities] = useState<DynamicObject[] | null>(null)

  const Header = view.getAttribute("Header")
  const EntityType = view.getAttribute("EntityType")
  const ViewName = view.getAttribute("Name")
  const DisableCreateNewEntity = view.getAttribute("DisableCreateNewEntity")
  const DisableItemSelection = view.getAttribute("DisableItemSelection")
  const CreateNewCardName = view.getAttribute("CreateNewCardName")

  // This object has all attributes of the view root element
  // TODO: Keep only the list above, or this object
  // const ViewMetaData: { [index: string]: any} = {}
  // for (const attr of view.attributes) {
  //   if (attr.name.includes("xmlns") || attr.name.includes("xsi")) continue
  //
  //   if (attr.value === "true" || attr.value === "false")
  //     ViewMetaData[attr.name] = attr.value === "true"
  //   else
  //     ViewMetaData[attr.name] = attr.value
  // }

  const orderBy = parseOrderOptions(view)
  const {columns, bindings} = parseRegisterMetaView(view)

  const searchOptions = {
    entityType: EntityType,
    viewName: ViewName,
    currentPage: 0,
    orderBy
  }

  const mutation = useMutation({
    mutationFn: getEntitiesForRegisterView,
    onSuccess: data => {
      setFetchedEntities(data.Results)
    }
  })

  // Fetch data for register table
  // Mutate only once, when component renders
  useEffect(() => {
    mutation.mutate(searchOptions)
  }, [])

  return (
    <>
      {mutation.isLoading && <h2 className="text-2xl px-8">Loading...</h2>}
      {
        (fetchedEntities && fetchedEntities.length > 0)
        && <RegisterTable
          columns={columns}
          entities={fetchedEntities}
          bindings={bindings}
          entityType={EntityType}/>
      }
      {(fetchedEntities && fetchedEntities?.length < 1) && <p className={`text-2xl px-8 py-4`}>No table data</p>}
    </>
  )
}
