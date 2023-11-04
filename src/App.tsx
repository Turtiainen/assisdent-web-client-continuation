import { Sidebar } from './components/Sidebar';
import { MainView } from './components/MainView';
import { Outlet, useNavigation } from 'react-router-dom';
import { useEffect } from 'react';
import { getSchemaToStore } from './utils/storeUtils';
import { Login } from './components/Login';

function App() {
    const navigation = useNavigation();

    const hasToken = () => {
        // console.log(sessionStorage.getItem('bt'));
        return sessionStorage.getItem('bt') !== null;
    };

    useEffect(() => {
        if (hasToken()) getSchemaToStore();
    }, [hasToken()]);

    if (!hasToken()) return <Login />;
    else
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
