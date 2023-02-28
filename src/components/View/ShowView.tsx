import React, {useState} from "react";

<
<
<
<
<
<< HEAD
  import {ViewList} from "./ViewList";
import {RegisterView} from "./RegisterView";

======
=
import {ShowViewContent} from "./ShowViewContent";
import {ViewList} from "./ViewList";
import {Routes, Route} from 'react-router-dom';

>>>>>>>
development

export const ShowView = () => {
  const [selectedDocument, setSelectedDocument] = useState<Element | null>(null)

  const selectDocument = (val: HTMLElement) => {
    setSelectedDocument(val)
  }

  return (
    <section className={`flex p-4`}>
      <Routes>
        <Route
          path={`view/:viewid`}
          element={
            <>
              <ViewList selectDocument={selectedDocument}/>
              {selectedDocument && <RegisterView key={selectedDocument.getAttribute("Name")} view={selectedDocument}/>}
            </>
          }/>

      </Routes>
    </section>
  )
}
