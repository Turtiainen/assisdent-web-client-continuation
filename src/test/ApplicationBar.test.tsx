import { render, screen } from '@testing-library/react';
import { ApplicationBar } from '../components/ApplicationBar';
import '@testing-library/jest-dom';

describe('Register ApplicationBar', () => {
    it('should render the element', () => {
        render(<ApplicationBar />);
        expect(screen.getByText(/Kotisivu/)).toBeInTheDocument();
    });
});
