import './App.css';
import { OrganizationName } from './OrganizationName';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Sidebar } from './components/Sidebar';
import Button from './components/Button';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <h1>Proto2</h1>
                <OrganizationName />
                <Sidebar />
            </div>
        </QueryClientProvider>
    );
}

export default App;
