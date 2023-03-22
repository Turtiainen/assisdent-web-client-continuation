import { render, screen } from '@testing-library/react';
import { Checkbox } from '../components/Checkbox';
import '@testing-library/jest-dom';

describe('Register Checkbox', () => {
    it('should render the element with the correct label', () => {
        render(
            <Checkbox
                label={'TestCheckbox'}
                onChange={() => {
                    return;
                }}
                labelSide={'left'}
            />,
        );
        expect(screen.getByText(/TestCheckbox/)).toBeInTheDocument();
    });
});
