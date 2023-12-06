import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { MenuSection } from '../components/MenuSection';

const mockOnClick = jest.fn();
const mockItems = [
    {
        text: 'Ajanvaraukset',
        onClick: mockOnClick,
        linkTo: '/view/AppointmentRegisterView',
    },
    {
        text: 'Jatko-ohjeet',
        onClick: mockOnClick,
        linkTo: '/view/FollowupInstructionRegisterView',
    },
    {
        text: 'Kutsut',
        onClick: mockOnClick,
        linkTo: '/view/RecallRegisterView',
    },
    {
        text: 'Potilaat',
        onClick: mockOnClick,
        linkTo: '/view/PatientRegisterView',
    },
];

const MockMenuSection = () => {
    return (
        <BrowserRouter>
            <MenuSection
                title="Test Section"
                items={mockItems}
                onClick={mockOnClick}
            />
        </BrowserRouter>
    );
};

describe('MenuSection Component', () => {
    it('should render the section title', () => {
        render(<MockMenuSection />);
        expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should toggle the list when clicking on the title', () => {
        render(<MockMenuSection />);
        fireEvent.click(screen.getByText('Test Section'));
        expect(screen.getByAltText('Up Icon')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Test Section'));
        expect(screen.getByAltText('Down Icon')).toBeInTheDocument();
    });

    it('should render the correct text for each menu item', () => {
        render(<MockMenuSection />);
        fireEvent.click(screen.getByText('Test Section'));
        mockItems.forEach((item) => {
            expect(screen.getByText(item.text)).toBeInTheDocument();
        });
    });

    it('should render links with the correct "to" prop for each menu item', () => {
        render(<MockMenuSection />);
        fireEvent.click(screen.getByText('Test Section'));

        mockItems.forEach((item) => {
            const linkElement = screen.getByText(item.text).closest('a');
            expect(linkElement).toHaveAttribute('href', item.linkTo);
        });
    });

    it('should navigate to the correct route when a menu item is clicked', () => {
        render(<MockMenuSection />);
        fireEvent.click(screen.getByText('Test Section'));

        mockItems.forEach((item) => {
            const linkElement = screen.getByText(item.text).closest('a');
            fireEvent.click(linkElement);
            expect(window.location.pathname).toBe(item.linkTo);
        });
    });
});
