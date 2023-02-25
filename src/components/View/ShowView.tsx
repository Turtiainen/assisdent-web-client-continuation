import React, {useState} from "react";
import {ViewList} from "./ViewList";
import {RegisterView} from "./RegisterView";

export const ShowView = () => {
  const [selectedDocument, setSelectedDocument] = useState<Element | null>(null)

  const handleChange = (val: Element | undefined) => {
    if (!val) return
    setSelectedDocument(val)
  }

  return (
    <section className={`w-full`}>
      <ViewList onChange={handleChange} selectedDoc={selectedDocument} />
      {selectedDocument && <RegisterView key={selectedDocument.getAttribute("Name")} view={selectedDocument}/>}
    </section>
  )
}
