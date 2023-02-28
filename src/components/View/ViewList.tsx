import React from "react";
import {useQuery} from "@tanstack/react-query";
import {getRegisterViews} from "../../utils/Parser";
import {useParams} from "react-router-dom";

export type ViewListProps = {
  selectDocument: (doc: Element) => void
}

export const ViewList = ({selectDocument}: ViewListProps) => {
  const {isLoading, error, data, isFetching} = useQuery({
    queryKey: ['getRegisterViews'],
    queryFn: async () => {
      return await getRegisterViews();
    }
  });

  const { viewid } = useParams()
  if (viewid) {
    const viewDocument = data?.find((element) => element.documentElement.getAttribute("Name") === viewid)
    if (viewDocument) selectDocument(viewDocument?.documentElement)
  }

  const registerViewNames = data?.map((doc: Document) => {
    const docName = doc!.documentElement!.getAttribute("Name")!
    return (
      <option
        key={docName}
        value={docName}
      >
        {docName}
      </option>
    )
  })

  const contentList = (
    <select className={`border-2 border-slate-200 hover:border-blue-400 cursor-pointer rounded p-2`}>
      {registerViewNames}
    </select>
  )
  const loadingSpinner = <p>Loading...</p>

  return (
    <div className={`px-8`}>
      <>
        {error && <p>There was an error while loading register views</p>}
        {isLoading && loadingSpinner}
        {(data && data.length > 0) && contentList}
      </>
    </div>
  )
}
