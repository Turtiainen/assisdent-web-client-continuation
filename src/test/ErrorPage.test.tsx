import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorPage } from '../components/ErrorPage';
import '@testing-library/jest-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Link } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <p>Home</p>
                <Link to={'/error'}>link</Link>
            </>
        ),
        errorElement: <ErrorPage />,
    },
]);

const MockErrorPage = () => {
    return <RouterProvider router={router} />;
};

describe('Register ErrorPage', () => {
    beforeEach(() => {
        // Do not render 404 errors to console
        jest.spyOn(console, 'warn').mockImplementation(() => {
            return;
        });
        jest.spyOn(console, 'log').mockImplementation(() => {
            return;
        });
    });

    it('should not render error page on a successful route', () => {
        render(<MockErrorPage />);
        expect(screen.getByText(/Home/)).toBeInTheDocument();
    });

    it('should render an error message on an erroneous route', () => {
        render(<MockErrorPage />);
        const erroneousLink = screen.getByText(/link/);
        fireEvent.click(erroneousLink);
        expect(screen.getByText(/Page not found/)).toBeInTheDocument();
    });
});
