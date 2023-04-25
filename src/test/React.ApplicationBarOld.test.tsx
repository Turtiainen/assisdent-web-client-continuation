import { render, screen } from '@testing-library/react';
import { ApplicationBarOld } from '../components/ApplicationBarOld';
import '@testing-library/jest-dom';

describe('Register ApplicationBarOld', () => {
    it('should render the element', () => {
        render(<ApplicationBarOld />);
        expect(screen.getByText(/Kotisivu/)).toBeInTheDocument();
    });

    it('should have a help icon', () => {
        render(<ApplicationBarOld />);
        expect(screen.getByText(/❔/)).toBeInTheDocument();
    });
});
