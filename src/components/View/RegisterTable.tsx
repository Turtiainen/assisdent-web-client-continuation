import React, {ChangeEventHandler, MouseEventHandler, useState} from "react";
import {resolveEntityBindings} from "../../utils/utils";
import {DynamicObject} from "../../types/DynamicObject";

export type RegisterTableProps = {
  columns: string[]
  entities: DynamicObject[]
  bindings: string[]
  entityType: string | null
}

export const RegisterTable = ({columns, entities, bindings, entityType}: RegisterTableProps) => {
  const [selectedList, setSelectedList] = useState<Set<string>>(new Set())
  const [favoriteList, setFavoriteList] = useState<Set<string>>(new Set())

  entities.map((entity) => {
    if (entity.IsFavorite) {
      setFavoriteList((oldState) => {
        return new Set(oldState.values()).add(entity.Id)
      })
    }
  })

  const handleCheckToggleOne: ChangeEventHandler<HTMLInputElement> = (evt) => {
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

  const handleCheckToggleAll: ChangeEventHandler<HTMLInputElement> = (evt) => {
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

  const handleFavoriteToggle: MouseEventHandler<HTMLButtonElement> = (evt) => {
    const eventTarget = evt.target as HTMLButtonElement
    const targetEntity = eventTarget.name
    if (favoriteList.has(targetEntity)) {
      setFavoriteList((oldState) => {
        oldState.delete(targetEntity)
        return new Set(oldState.values())
      })
    } else {
      setFavoriteList((oldState) => {
        oldState.add(targetEntity)
        return new Set(oldState.values())
      })
    }
  }

  const TableHeaders = (
    <thead className={`bg-[#d2dce6] text-xs`}>
    <tr className={``}>
      <th className="text-center w-8 h-8"></th>
      <th className="text-center w-8 h-8 font-normal">
        <input
          type="checkbox"
          onChange={handleCheckToggleAll}
          disabled={!entities || entities.length === 0}/>
      </th>
      {columns?.map((c, idx) => {
        return <th className="text-left px-2 font-semibold text-slate-600" key={idx}>{c}</th>
      })}
      <th className={`text-center w-16`}></th>
    </tr>
    </thead>
  )

  const TableRows = (
    entities.map((entity) => {
      const entityBindings = resolveEntityBindings(entity, bindings, entityType)

      return (
        <tr key={entity.Id} className={`border-b border-gray-300 hover:bg-blue-100/30`}>
          <td className="text-center w-8 bg-[#e2e9ee]">⬇️</td>
          <td className="text-center w-8">
            <input type="checkbox" name={entity.Id} onChange={handleCheckToggleOne}
                   checked={selectedList.has(entity.Id)}/>
          </td>
          {entityBindings.map((bindingValue, idx) => {
            const isLink = idx === 0
            return (
              <td className="text-left text-xs px-2" key={idx}>
                {isLink
                  ? (
                    <>
                      <a className={`underline font-semibold cursor-pointer`}>{bindingValue}</a>
                      <span className={`font-bold`}>{`>`}</span>
                    </>
                  )
                  : bindingValue}
              </td>
            )
          })}
          <td className={`text-xs flex justify-around`}>
            <span className={favoriteList.has(entity.Id) ? `opacity-100` : `opacity-20`}>
              <button className={`cursor-pointer`} name={entity.Id} onClick={handleFavoriteToggle}>⭐</button>
            </span>
            <span>🎚️</span></td>
        </tr>)
    })
  )

  return (
      <table className="border-collapse border-spacing-1 w-full bg-white">
        {TableHeaders}
        {(entities && entities?.length > 0) && <tbody>
        {TableRows}
        </tbody>}
      </table>
  )
}
