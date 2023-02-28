import React, {useState} from "react";
import {ViewList} from "./ViewList";
import {RegisterView} from "./RegisterView";
import {Routes, Route} from 'react-router-dom';
import {PrintSchemaInfo} from "../../temp/PrintSchemaInfo";


export const ShowView = () => {
  const [selectedDocument, setSelectedDocument] = useState<Element | null>(null)

  const selectDocument = (val: Element) => {
    setSelectedDocument(val)
  }

  return (
    <>
      <header className={`w-full bg-white p-4`}>
        <h1 className={`text-3xl text-ad-hero-title font-medium`}>{selectedDocument?.getAttribute("Header")}</h1>
      </header>
      <section className={`flex flex-col py-8`}>
        <Routes>
          <Route
            path={`view/:viewid`}
            element={
              <>
                <ViewList selectDocument={selectDocument}/>
                {selectedDocument &&
                  <RegisterView key={selectedDocument.getAttribute("Name")} view={selectedDocument}/>}
              </>
            }/>
          <Route path={`view/print-schema-xml`} element={PrintSchemaInfo()} />

        </Routes>
      </section>
    </>
  )
}
