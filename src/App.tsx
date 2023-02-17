import './App.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {Sidebar} from './components/Sidebar';
import {ShowView} from "./components/View/ShowView";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Sidebar/>
        <h1>Proto2</h1>
        <ShowView/>
      </div>
    </QueryClientProvider>
  )
}

export default App;
