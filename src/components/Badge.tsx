import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react"

type badgeProps = { isActive: any; title: string | number | boolean 
  | ReactElement<any, string | JSXElementConstructor<any>> 
  | ReactFragment | ReactPortal | null | undefined }

export const Badge = (props: badgeProps) => {
    return <div className={
      "header" +
      (props.isActive ? " active" : "")
    }>{props.title}</div>
  }