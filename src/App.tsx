import './App.css';
import { OrganizationName } from './OrganizationName';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Sidebar } from './components/Sidebar';
import Input from './components/Input';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <Sidebar />
                <h1>Proto2</h1>
                <OrganizationName />
            </div>

            <Input label="Name" onChange={() => console.log('Hi')} />
        </QueryClientProvider>
    );
}

export default App;
