import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './components/ErrorPage';
import { ShowView } from './components/View/ShowView';
import { PrintSchemaInfo } from './temp/PrintSchemaInfo';
import { IndexPage } from './components/IndexPage';
import { PrintEntitySchema } from './temp/PrintEntitySchema';
import ContextMenuProvider from './context/ContextMenuProvider';
import { FieldChoice } from './components/FieldChoice';
import { Login } from './components/Login';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <IndexPage />,
            },
            {
                path: 'view/:viewId/:Id?',
                element: <ShowView />,
            },
        ],
    },
    {
        // For schema debugging purposes
        path: '/print-schema-xml',
        element: <PrintSchemaInfo />,
    },
    {
        // For schema debugging purposes
        path: '/print-entity-schema',
        element: <PrintEntitySchema />,
    },
    {
        path: '/login',
        element: <Login />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ContextMenuProvider>
                <RouterProvider router={router} />
            </ContextMenuProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
