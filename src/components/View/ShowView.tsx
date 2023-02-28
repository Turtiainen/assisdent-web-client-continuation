import React, {useState} from "react";
import {ViewList} from "./ViewList";
import {RegisterView} from "./RegisterView";
import {Routes, Route} from 'react-router-dom';


export const ShowView = () => {
  const [selectedDocument, setSelectedDocument] = useState<Element | null>(null)

  const selectDocument = (val: Element) => {
    setSelectedDocument(val)
  }

  return (
    <section className={`flex p-4`}>
      <Routes>
        <Route
          path={`view/:viewid`}
          element={
            <>
              <ViewList selectDocument={selectDocument}/>
              {selectedDocument && <RegisterView key={selectedDocument.getAttribute("Name")} view={selectedDocument}/>}
            </>
          }/>

      </Routes>
    </section>
  )
}
