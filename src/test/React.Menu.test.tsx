import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Menu } from '../components/Menu';

const mockOnClick = jest.fn();

const MockMenu = () => {
    return (
        <BrowserRouter>
            <Menu onClick={mockOnClick} />
        </BrowserRouter>
    );
};
describe('Menu', () => {
    it('renders the menu element', () => {
        render(<MockMenu />);
        expect(screen.getByText('Valikko')).toBeInTheDocument();
    });

    it('should call onClick prop when close button is clicked', () => {
        render(<MockMenu />);
        fireEvent.click(screen.getByAltText(/Close Icon/));
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('renders "Luo uusi potilas" button with correct link', () => {
        render(<MockMenu />);
        fireEvent.click(screen.getByText('POTILAAT'));
        fireEvent.click(screen.getByText('Luo uusi potilas'));
        expect(window.location.pathname).toBe('/view/PatientCardView/new');
    });
});
