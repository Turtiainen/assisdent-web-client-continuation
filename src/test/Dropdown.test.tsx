import { render, screen } from '@testing-library/react';
import Dropdown from '../components/Dropdown';
import '@testing-library/jest-dom';

describe('Register Dropdown', () => {
    const options = ['Mansikka', 'Mustikka', 'Vadelma'];

    it('should render the element with the correct label', () => {
        render(
            <Dropdown
                label={'Marjat'}
                options={[]}
                onChange={() => {
                    return;
                }}
            />,
        );
        expect(screen.getByText(/Marjat/)).toBeInTheDocument();
    });

    it('should render the element with given options', async () => {
        render(
            <Dropdown
                label={'Marjat'}
                options={options}
                onChange={() => {
                    return;
                }}
            />,
        );
        const dropdownOptions = await screen.findAllByTestId(/dropdown-option/);
        expect(dropdownOptions.length).toBe(3);
    });
});
