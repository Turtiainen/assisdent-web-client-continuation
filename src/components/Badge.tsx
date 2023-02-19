import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react"
import "./Badge.css"

export const Badge = (props: { isActive: any; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined }) => {
    return <h2 className={
      "header" +
      (props.isActive ? " active" : "")
    }>{props.title}</h2>
  }