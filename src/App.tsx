import { Sidebar } from './components/Sidebar';
import { MainView } from './components/MainView';
import { ApplicationBar } from './components/ApplicationBar';
import { Outlet, useNavigation } from 'react-router-dom';

function App() {
    const navigation = useNavigation();

    return (
        <div className="App w-full flex">
            <Sidebar />
            <MainView>
                <ApplicationBar />
                {navigation.state === 'loading' && (
                    <p className={`px-8 pt-4 text-2xl`}>Loading page...</p>
                )}
                <Outlet />
            </MainView>
        </div>
    );
}

export default App;
