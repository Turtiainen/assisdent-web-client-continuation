import { Sidebar } from './components/Sidebar';
import { MainView } from './components/MainView';
import { Outlet, useNavigation } from 'react-router-dom';
import { useEffect } from 'react';
import { getSchemaToStore } from './utils/storeUtils';

function App() {
    const navigation = useNavigation();

    useEffect(() => {
        getSchemaToStore();
    }, []);

    return (
        <div className="App w-full flex relative">
            <Sidebar />
            <MainView>
                {navigation.state === 'loading' && (
                    <p className={`px-8 pt-4 text-2xl`}>Loading page...</p>
                )}
                <Outlet />
            </MainView>
        </div>
    );
}

export default App;
