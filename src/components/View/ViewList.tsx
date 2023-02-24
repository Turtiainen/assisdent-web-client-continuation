import React from "react";
import {useQuery} from "@tanstack/react-query";
import {getRegisterViews} from "../../utils/Parser";

export type ViewListProps = {
  selectedDoc: Element | null
  onChange: (doc: Element | undefined) => void
}

export const ViewList = ({onChange, selectedDoc}: ViewListProps) => {
  const {isLoading, error, data, isFetching} = useQuery({
    queryKey: ['getRegisterViews'],
    queryFn: async () => {
      return await getRegisterViews();
    },
    onSuccess: (data) => {
      if (!selectedDoc)
        onChange(data[0].documentElement)
    }
  });

  const registerViewNames = data?.map((doc: Document, idx: React.Key) => {
    return (
      <option
        key={idx}
        value={doc!.documentElement!.getAttribute("Name")!}
      >
        {doc?.documentElement.getAttribute("Name")}
      </option>
    )
  })

  const contentList = (
    <select
      className={`border-2 border-slate-200 hover:border-blue-400 cursor-pointer rounded p-2`}
      value={selectedDoc?.getAttribute("Name") || undefined}
      onChange={(evt) => {
        const entity = data?.find((doc) => doc.documentElement.getAttribute("Name") === evt.target.value)
        onChange(entity?.documentElement)
      }}>
      {registerViewNames}
    </select>
  )
  const loadingSpinner = <p>Loading...</p>

  return (
    <div className={`px-4 py-2`}>
      <>
        {error && <p>There was an error while loading register views</p>}
        {isLoading && loadingSpinner}
        {(data && data.length > 0) && contentList}
      </>
    </div>
  )
}
