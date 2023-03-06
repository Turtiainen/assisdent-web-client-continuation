import {ReactNode} from "react";

export const MainView = ({children}: {children: ReactNode | ReactNode[]}) => {
  return <main className={`w-full`}>{children}</main>
}
