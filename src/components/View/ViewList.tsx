import {getRegisterViews} from "../../utils/Parser";
import React from "react";

export const ViewList: React.FC<{onClick: (doc: HTMLElement) => void}> = ({onClick}) => {
  const registerViews = getRegisterViews()

  const registerViewNames = registerViews.map((doc, idx) => {
    return (
      <li
        key={idx}
        onClick={() => onClick(doc.documentElement)}
      >
        {doc.documentElement.attributes["Name"].value}
      </li>
    )
  })

  return (
    <ul>
      {registerViewNames}
    </ul>
  )
}
