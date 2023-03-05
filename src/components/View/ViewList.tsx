import React, {ChangeEventHandler} from "react";
import {useNavigate} from "react-router-dom";
import {sortByDocumentHeader} from "../../utils/sortingUtils";
import {useIsFetching, useQuery} from "@tanstack/react-query";
import {schemaQuery} from "../../temp/SchemaUtils";
import {getRegisterViewsFromSchema} from "../../utils/Parser";

export const ViewList = ({className}: { className?: string }) => {
  const navigate = useNavigate()
  const {data: schema} = useQuery(schemaQuery())
  const {data: registerViews} = useQuery({
    queryKey: ["schema", "metaview", "register", "all"],
    queryFn: () => getRegisterViewsFromSchema(schema!),
    enabled: !!schema
  })
  const isLoading = useIsFetching(["schema", "metaview", "register", "all"]) > 0

  const handleOnChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    evt.preventDefault()
    navigate(`view/${evt.target.value}`)
  }

  const registerViewNames = registerViews?.sort(sortByDocumentHeader).map((doc: Document) => {
    const docName = doc!.documentElement!.getAttribute("Name")!
    const header = doc!.documentElement!.getAttribute("Header") || docName

    return (
      <option key={docName} value={docName}>
        {header}
      </option>
    )
  })

  return (
    <div className={`px-8 py-4`}>
      {isLoading && <p>Loading view names...</p>}
      {registerViewNames?.length && <select
        className={`border-2 border-slate-200 hover:border-blue-400 cursor-pointer rounded p-2 ${className}`}
        onChange={handleOnChange}
      >
        {registerViewNames}
      </select>}
    </div>
  )
}
