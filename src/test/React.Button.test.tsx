import { render, screen } from '@testing-library/react';
import Button from '../components/Button';
import '@testing-library/jest-dom';

describe('Register Button', () => {
    it('should render the element with a child inside', () => {
        render(
            <Button
                onClick={() => {
                    return;
                }}
            >
                <>Child</>
            </Button>,
        );
        expect(screen.getByText(/Child/)).toBeInTheDocument();
    });
});
