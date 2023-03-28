import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../components/Sidebar';
import { SubSidebarSearch } from '../components/SubSidebarSearch';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import json from '../temp/schema.json';
import { DtoSchema } from '../types/DtoSchema';

const MockSidebar = () => {
    return (
        <BrowserRouter>
            <Sidebar />
        </BrowserRouter>
    );
};

// Mock the store with the static schema.json
const mockSchema = json as unknown as DtoSchema;
jest.mock('../store/store', () =>
    jest.fn(() => {
        return mockSchema;
    }),
);

const MockSubSidebar = () => {
    return (
        <BrowserRouter>
            <SubSidebarSearch
                onClick={() => {
                    return;
                }}
            />
        </BrowserRouter>
    );
};

describe('Register Sidebar with SubSidebar', () => {
    it('should have a search menu item', () => {
        render(<MockSidebar />);
        expect(screen.getByText(/Haku/)).toBeInTheDocument();
    });

    it('should have a toggleable search view', async () => {
        render(<MockSidebar />);
        const searchMenuItem = screen.getByText(/Haku/);
        fireEvent.click(searchMenuItem);
        expect(screen.getByPlaceholderText(/Kirjoita hakusana/));
    });

    it('should not accept search terms shorter than two', () => {
        render(<MockSidebar />);
        const searchMenuItem = screen.getByText(/Haku/);
        fireEvent.click(searchMenuItem);
        expect(screen.getByPlaceholderText(/Kirjoita hakusana/));
    });
});

describe('Register Sidebar with Search', () => {
    it('should not accept search terms shorter than two', () => {
        render(<MockSubSidebar />);
        const searchBar = screen.getByPlaceholderText(/Kirjoita hakusana/);
        fireEvent.change(searchBar, { target: { value: 'P' } });
        expect(screen.getByText(/Syötä lisää merkkejä/)).toBeInTheDocument();
    });

    it('should handle a non-existing search term correctly', () => {
        render(<MockSubSidebar />);
        const searchBar = screen.getByPlaceholderText(/Kirjoita hakusana/);
        fireEvent.change(searchBar, { target: { value: '&X&' } });
        expect(screen.getByText(/Ei hakutuloksia/)).toBeInTheDocument();
    });

    it('should return search results for a correct search term', async () => {
        render(<MockSubSidebar />);
        const searchBar = screen.getByPlaceholderText(/Kirjoita hakusana/);
        fireEvent.change(searchBar, { target: { value: 'Poti' } });
        const searchItems = await screen.findAllByTestId(/search-result-item/);
        expect(searchItems.length).toBeGreaterThanOrEqual(1);
    });

    it('should take to the correct router path on click', async () => {
        render(<MockSubSidebar />);
        const searchBar = screen.getByPlaceholderText(/Kirjoita hakusana/);
        fireEvent.change(searchBar, { target: { value: 'Potilaat' } });
        const searchItems = await screen.findAllByTestId(/search-result-item/);
        fireEvent.click(searchItems[0]);
        expect(window.location.pathname).toBe('/view/PatientRegisterView');
    });
});
