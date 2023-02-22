import React, {useState} from "react";
import {ShowViewContent} from "./ShowViewContent";
import './ShowView.css'
import {ViewList} from "./ViewList";
import {RegisterView} from "./RegisterView";

export const ShowView = () => {
  const [selectedDocument, setSelectedDocument] = useState<HTMLElement | null>(null)

  const onClickSetSelectedDocument = (val: HTMLElement) => {
    setSelectedDocument(val)
  }

  return (
    <section className="view-data">
      <ViewList onClick={onClickSetSelectedDocument} />
      {selectedDocument && <RegisterView key={selectedDocument.getAttribute("Name")} view={selectedDocument}/>}
    </section>
  )
}
