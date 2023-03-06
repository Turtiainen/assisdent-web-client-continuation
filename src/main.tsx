import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {ErrorPage} from "./components/ErrorPage";
import {ShowView} from "./components/View/ShowView";
import {loader as schemaLoader} from "./temp/SchemaUtils";
import {PrintSchemaInfo} from "./temp/PrintSchemaInfo";
import {IndexPage} from "./components/IndexPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        element: <IndexPage/>,
        loader: schemaLoader(queryClient)
      },
      {
        path: "view/:viewId",
        element: <ShowView />,
        loader: schemaLoader(queryClient)
      }
    ]
  },
  { // For schema debugging purposes
    path: "/print-schema-xml",
    element: <PrintSchemaInfo/>
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}/>
        </QueryClientProvider>
    </React.StrictMode>,
);
