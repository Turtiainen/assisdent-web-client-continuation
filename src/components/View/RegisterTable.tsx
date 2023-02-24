import React, {ChangeEventHandler, useState} from "react";
import {resolveEntityBindings} from "../../utils/utils";

export type RegisterTableProps = {
  columns: string[]
  entities: any[]
  bindings: string[]
}

export const RegisterTable = ({columns, entities, bindings}: RegisterTableProps) => {
  const [selectedList, setSelectedList] = useState<Set<string>>(new Set())

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (evt.target.checked) {
      setSelectedList((oldState) => {
        return new Set(oldState.values()).add(evt.target.name)
      })
    } else {
      setSelectedList((oldState) => {
        oldState.delete(evt.target.name)
        return new Set(oldState.values())
      })
    }
  }

  const handleCheckAll: ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (evt.target.checked) {
      if (entities && entities.length < 1) return

      setSelectedList((oldState) => {
        const newState = new Set(oldState.values())
        entities.map(entity => newState.add(entity.Id))
        return newState
      })
    } else {
      setSelectedList(new Set())
    }
  }

  const TableHeaders = (
    <thead className={`bg-[#d2dce6] text-sm`}>
    <tr className={`border-b-2 border-white`}>
      <th className="text-center w-8 h-8 border-r-4 border-white"></th>
      <th className="text-center w-8 h-8 border-r border-white font-normal">
        <input
          type="checkbox"
          onChange={handleCheckAll}
          disabled={!entities || entities.length === 0}/>
      </th>
      {columns?.map((c, idx) => {
        return <th className="text-left border-r border-white px-2 font-semibold text-slate-600" key={idx}>{c}</th>
      })}
      <th className={`text-center w-16`}></th>
    </tr>
    </thead>
  )

  const TableRows = (
    entities.map((entity) => {
      const entityBindings = resolveEntityBindings(entity, bindings)

      return (
        <tr key={entity.Id} className={`border-b`}>
          <td className="text-center w-8 bg-[#e2e9ee] border-r-4 border-white">⬇️</td>
          <td className="text-center w-8">
            <input type="checkbox" name={entity.Id} onChange={handleChange} checked={selectedList.has(entity.Id)}/>
          </td>
          {entityBindings.map((bindingValue, idx) => {
            return (
              <td className="text-left text-xs px-2" key={idx}>
                {bindingValue}
              </td>
            )
          })}
        </tr>)
    })
  )

  return (
    <table className="border-collapse w-full mt-2 bg-white">
      {TableHeaders}
      {(entities && entities?.length > 0) && <tbody>
      {TableRows}
      </tbody>}
    </table>
  )
}
