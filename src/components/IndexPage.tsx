import {ViewList} from "./View/ViewList";

export const IndexPage = () => {
  return (
    <>
      <p className={`px-8 pt-4 font-semibold`}>Select page:</p>
      <ViewList/>
    </>
  )
}
