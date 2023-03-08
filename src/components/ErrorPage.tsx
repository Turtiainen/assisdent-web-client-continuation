import {Link, useRouteError} from "react-router-dom";
import {Sidebar} from "./Sidebar";
import {MainView} from "./MainView";

export const ErrorPage = () => {
  const error = useRouteError()
  console.log(error)

  return (
    <div className={`w-full flex`}>
      <Sidebar/>
      <MainView>
        <section className={`flex flex-col h-full justify-center items-center`}>
          <h1 className={`text-3xl pb-8`}>Page not found...</h1>
          <p>Head back to <Link to={`/`} className={`text-blue-800 underline`}>homepage {`>`}</Link>.</p>
        </section>
      </MainView>
    </div>
  )
}
