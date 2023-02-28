import {Sidebar} from './components/Sidebar';
import {ShowView} from "./components/View/ShowView";
import {MainView} from "./components/MainView";
import {ApplicationBar} from "./components/ApplicationBar";

function App() {
  return (
    <div className="App w-full flex">
      <Sidebar/>
      <MainView>
        <ApplicationBar/>
        <ShowView/>
      </MainView>
    </div>
  )
}

export default App;
