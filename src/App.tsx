import './App.css';
import {Sidebar} from './components/Sidebar';
import {ShowView} from "./components/View/ShowView";
import {MainView} from "./components/MainView";
import {ApplicationBar} from "./components/ApplicationBar";

function App() {
  return (
    <div className="App w-full flex">
      <Sidebar/>
      <MainView>
        <ApplicationBar />
        <header className={`w-full bg-white p-4`}>
          <h1 className={`text-3xl text-ad-blue-600 font-medium`}>Toimipisteet</h1>
        </header>
        <ShowView/>
      </MainView>
    </div>
  )
}

export default App;
