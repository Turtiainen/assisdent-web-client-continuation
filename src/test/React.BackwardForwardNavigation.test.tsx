import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { BackwardForwardNavigation } from '../components/BackwardForwardNavigation';

// Mock the 'react-router-dom' module to replace the actual 'useNavigate' with a Jest mock function
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const MockBackwardForwardNavigation = () => {
    return (
        <BrowserRouter>
            <BackwardForwardNavigation />
        </BrowserRouter>
    );
};

describe('BackwardForwardNavigation Component', () => {
    let navigateMock;

    beforeEach(() => {
        // Reset the mock function before each test
        navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);
    });

    it('should render the component', () => {
        render(<MockBackwardForwardNavigation />);
        expect(screen.getByAltText('Go Back Icon')).toBeInTheDocument();
        expect(screen.getByAltText('Go Forward Icon')).toBeInTheDocument();
        expect(screen.getByAltText('Refresh Icon')).toBeInTheDocument();
    });

    it('should navigate backward when the "Go Back" button is clicked', () => {
        render(<MockBackwardForwardNavigation />);
        const goBackButton = screen.getByAltText('Go Back Icon');
        fireEvent.click(goBackButton);
        expect(navigateMock).toHaveBeenCalledWith(-1);
    });

    it('should navigate forward when the "Go Forward" button is clicked', () => {
        render(<MockBackwardForwardNavigation />);
        const goForwardButton = screen.getByAltText('Go Forward Icon');
        fireEvent.click(goForwardButton);
        expect(navigateMock).toHaveBeenCalledWith(1);
    });

    it('should log "refresh" to the console when the "Refresh" button is clicked', () => {
        render(<MockBackwardForwardNavigation />);
        const refreshButton = screen.getByAltText('Refresh Icon');
        const consoleSpy = jest.spyOn(console, 'log');
        fireEvent.click(refreshButton);
        expect(consoleSpy).toHaveBeenCalledWith('refresh');
    });
});
