import React, {useState} from "react";
import {ShowViewContent} from "./ShowViewContent";
import {ViewList} from "./ViewList";

export const ShowView = () => {
  const [selectedDocument, setSelectedDocument] = useState<HTMLElement | null>(null)

  const onClickSetSelectedDocument = (val: HTMLElement) => {
    setSelectedDocument(val)
  }

  return (
    <section className="flex p-4">
      <ViewList onClick={onClickSetSelectedDocument} />
      <ShowViewContent view={selectedDocument} />
    </section>
  )
}
