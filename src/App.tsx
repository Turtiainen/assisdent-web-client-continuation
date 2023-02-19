import './App.css';
import { OrganizationName } from './OrganizationName';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Sidebar } from './components/Sidebar';
import { Badge } from './components/Badge.jsx';

function App() {
    const queryClient = new QueryClient();

    const isActive = false;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Badge title="20" isActive={isActive} />
        <Sidebar />
        <h1>Proto2</h1>
          <OrganizationName />
      </div>
    </QueryClientProvider>
  )
}

export default App;
