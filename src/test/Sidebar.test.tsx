import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../components/Sidebar';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

const MockSidebar = () => {
    return (
        <BrowserRouter>
            <Sidebar/>
        </BrowserRouter>
    )
}

describe('Register Sidebar', () => {
    it('should render the element', () => {
        render(<MockSidebar />);
        expect(screen.getByText(/AssisDent/)).toBeInTheDocument();
    });

    it('should have a link to the home page', async () => {
        render(<MockSidebar />);
        const homeLink = screen.getByText(/AssisDent/);
        fireEvent.click(homeLink);
        expect(window.location.pathname).toBe('/');
    });

    it('should have a search link', () => {
        render(<MockSidebar />);
        expect(screen.getByText(/Haku/)).toBeInTheDocument();
    });

    it('should have at least three menu items', async () => {
        render(<MockSidebar />);
        const sidebarItems = await screen.findAllByTestId(/sidebar-item/);
        expect(sidebarItems.length).toBeGreaterThanOrEqual(2);
    });

    it('should have a sidebar footer', () => {
        render(<MockSidebar />);
        screen.findAllByTestId(/sidebar-footer/);
        expect(screen.findAllByTestId(/sidebar-footer/)).toBeInTheDocument;
    });
});
