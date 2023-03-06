import React, {useState} from "react";
import {ShowViewContent} from "./ShowViewContent";
import {ViewList} from "./ViewList";
import { Routes, Route } from 'react-router-dom';
import { CardViewSelect } from "./CardViewSelect";
import { CardView } from "./CardView";
import {PrintSchemaInfo} from "../../temp/PrintSchemaInfo";

export const ShowView = () => {
  const [selectedDocument, setSelectedDocument] = useState<HTMLElement | null>(null);
  const [selectedCard, setSelectedCard] = useState<string>('');

  const selectDocument = (val: HTMLElement) => {
    setSelectedDocument(val)
  }

  const selectCardEntity = (name: string) => {
    setSelectedCard(name.split("CardView")[0]);
  }

  return (
      <section className="flex p-4">
          <Routes>
              <Route
                  path="/view/:viewid"
                  element={
                        <>
                          <ViewList selectDocument={selectDocument} />
                          <ShowViewContent view={selectedDocument} />
                        </>
                  }
              />
              <Route
                  path="/card"
                  element={
                        <>
                            <CardViewSelect selectCardEntity={selectCardEntity} />
                        </>
                  }
              />
              <Route
                  path="/card/:cardid"
                  element={
                        <>
                            <CardView entity={selectedCard} />
                        </>
                  }
              />
              {/*TODO: For debug purposes, remove later*/}
              <Route path={`view/print-schema-xml`} element={PrintSchemaInfo()} />
          </Routes>
      </section>
  );
}
