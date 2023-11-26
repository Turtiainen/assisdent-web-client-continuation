import { render, fireEvent, screen, act } from '@testing-library/react';
import { LoginWithCredentials } from '../components/LoginWithCredentials';
import { Login } from '../components/Login';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

const localStorageMock = (function () {
    let store: { [key: string]: string } = {};

    return {
        getItem(key: string | number) {
            return store[key];
        },

        setItem(key: string | number, value: string) {
            store[key] = value;
        },

        clear() {
            store = {};
        },

        removeItem(key: string | number) {
            delete store[key];
        },

        getAll() {
            return store;
        },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
describe('Field Choice', () => {
    beforeEach(() => {
        window.localStorage.clear();
        window.localStorage.setItem('domain', 'feature_sweproject');
        render(
            <Router>
                <Login />
            </Router>,
        );
    });

    it('should update username and password on change', () => {
        const usernameInput = screen.getByPlaceholderText(
            'Käyttäjätunnus',
        ) as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText(
            'Salasana',
        ) as HTMLInputElement;

        fireEvent.change(usernameInput, {
            target: { value: 'seppomö' },
        });
        fireEvent.change(passwordInput, {
            target: { value: 'pora' },
        });

        expect(usernameInput.value).toBe('seppomö');
        expect(passwordInput.value).toBe('pora');
    });

    it('should display error when domain name is empty', async () => {
        const enterButton = screen.getByText('Jatka');
        const regex = /Kirjautuminen\s*epäonnistui\./;

        fireEvent.click(enterButton);

        await act(async () => {
            expect(screen.getByText(regex)).toBeInTheDocument();
        });
    });

    // it('should record after input domain name', async () => {
    //     const fieldInput = screen.getByPlaceholderText(
    //         'Toimialue',
    //     ) as HTMLInputElement;
    //     const enterButton = screen.getByText('Jatka');
    //     const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
    //
    //     fireEvent.change(fieldInput, {
    //         target: { value: 'feature_sweproject' },
    //     });
    //
    //     fireEvent.click(enterButton);
    //
    //     expect(mockSetItem).toHaveBeenCalledTimes(1);
    //     expect(mockSetItem).toHaveBeenCalledWith(
    //         'domain',
    //         'feature_sweproject',
    //     );
    // });
});
