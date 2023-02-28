import {ReactNode} from "react";

export const MainView = ({children}: {children: ReactNode[]}) => {
  return <main className={`flex-1`}>{children}</main>
}
