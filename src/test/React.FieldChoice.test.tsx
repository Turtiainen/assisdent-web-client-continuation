import { render, fireEvent, screen, act } from '@testing-library/react';
import { LoginWithCredentials } from '../components/LoginWithCredentials';
import { Login } from '../components/Login';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Field Choice', () => {
    beforeEach(() => {
        render(
            <Router>
                <Login />
            </Router>,
        );
    });

    it('should update domain name on change', () => {
        const fieldInput = screen.getByPlaceholderText(
            'Toimialue',
        ) as HTMLInputElement;

        fireEvent.change(fieldInput, {
            target: { value: 'feature_sweproject' },
        });

        expect(fieldInput.value).toBe('feature_sweproject');
    });

    it('should display error when domain name is empty', async () => {
        const enterButton = screen.getByText('Jatka');
        const regex = /Kirjautuminen\s*epäonnistui\./;

        fireEvent.click(enterButton);

        await act(async () => {
            expect(screen.getByText(regex)).toBeInTheDocument();
        });
    });

    it('should record after input domain name', async () => {
        const fieldInput = screen.getByPlaceholderText(
            'Toimialue',
        ) as HTMLInputElement;
        const enterButton = screen.getByText('Jatka');
        const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');

        fireEvent.change(fieldInput, {
            target: { value: 'feature_sweproject' },
        });

        fireEvent.click(enterButton);

        expect(mockSetItem).toHaveBeenCalledTimes(1);
        expect(mockSetItem).toHaveBeenCalledWith(
            'domain',
            'feature_sweproject',
        );
    });
});
