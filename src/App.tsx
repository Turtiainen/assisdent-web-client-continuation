import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Sidebar} from './components/Sidebar';
import {ShowView} from "./components/View/ShowView";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App ml-64 text-sm">
        <Sidebar/>
        <h1 className={`py-2 px-4 text-3xl`}>Proto2</h1>
        <ShowView/>
      </div>
    </QueryClientProvider>
  )
}

export default App;
