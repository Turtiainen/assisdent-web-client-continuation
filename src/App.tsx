import './App.css';
import { OrganizationName } from './OrganizationName';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dropdown from './components/Dropdown';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <h1>Proto2</h1>
                <OrganizationName />

                <Dropdown
                    // TODO: testipalikka, poistoon
                    label="Dropdown"
                    options={['Option 1', 'Option 2', 'Option 3']}
                    onChange={(value) => console.log(value)}
                ></Dropdown>
            </div>
        </QueryClientProvider>
    );
}

export default App;
