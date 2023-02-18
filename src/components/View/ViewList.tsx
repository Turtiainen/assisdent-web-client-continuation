import React from "react";
import {useQuery} from "@tanstack/react-query";
import {getRegisterViews} from "../../utils/Parser";

export const ViewList: React.FC<{ onClick: (doc: HTMLElement) => void }> = ({onClick}) => {
  const {isLoading, error, data, isFetching} = useQuery({
    queryKey: ['getRegisterViews'],
    queryFn: async () => {
      return await getRegisterViews();
    },
  });

  const registerViewNames = data?.map((doc: Document, idx: React.Key) => {
    return (
      <li
        key={idx}
        onClick={() => onClick(doc.documentElement)}
      >
        {doc?.documentElement.attributes["Name"].value}
      </li>
    )
  })

  const contentList = <ul>{registerViewNames}</ul>
  const loadingSpinner = <p>Loading...</p>

  return (
    <>
      {error && <p>There was an error while loading register views</p>}
      {isLoading && loadingSpinner}
      {(data && data.length > 0) && contentList}
    </>
  )
}
