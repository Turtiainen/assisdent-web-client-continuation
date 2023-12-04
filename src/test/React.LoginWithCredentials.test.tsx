import {
    render,
    fireEvent,
    screen,
    act,
    waitFor,
} from '@testing-library/react';
import { LoginWithCredentials } from '../components/LoginWithCredentials';
import { Login } from '../components/Login';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

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
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });
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
            target: { value: 'test username' },
        });
        fireEvent.change(passwordInput, {
            target: { value: 'test password' },
        });

        expect(usernameInput.value).toBe('test username');
        expect(passwordInput.value).toBe('test password');
    });

    it('should display error when input is empty', async () => {
        const enterButton = screen.getByText('Jatka');
        const regex = /Kirjautuminen\s*epäonnistui\./;

        fireEvent.click(enterButton);

        await act(async () => {
            expect(screen.getByText(regex)).toBeInTheDocument();
        });
    });

    it('should try to do login after input', async () => {
        // const mockNavigate = useNavigate();
        const regex = /Kirjautuminen\s*epäonnistui\./;

        const usernameInput = screen.getByPlaceholderText(
            'Käyttäjätunnus',
        ) as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText(
            'Salasana',
        ) as HTMLInputElement;

        fireEvent.change(usernameInput, {
            target: { value: 'test' },
        });
        fireEvent.change(passwordInput, {
            target: { value: 'test' },
        });

        const enterButton = screen.getByText('Jatka');
        // const mockSetItem = jest.spyOn(window.sessionStorage, 'setItem');

        fireEvent.click(enterButton);
        expect(screen.getByText('Doing login...')).toBeInTheDocument(); // Loging state once clicking the button
        await sleep(3000);

        // const homepageText = screen.getByText('OMAT TIEDOT');

        // expect(mockNavigate).toHaveBeenCalledWith('/');
        // expect(mockSetItem).toHaveBeenCalledTimes(1);
        expect(screen.getByText(regex)).toBeInTheDocument(); // Report error if login failed
        // expect(mockSetItem).toHaveBeenCalledWith(
        //     'domain',
        //     'feature_sweproject',
        // );
    });

    it('toggles password visibility', () => {
        const passwordInput = screen.getByPlaceholderText('Salasana');
        const togglePasswordVisibilityButton = screen.getByAltText(/password/i);
        expect(passwordInput).toHaveAttribute('type', 'password');

        // Simulate a click on the show/hide password button
        fireEvent.click(togglePasswordVisibilityButton);
        expect(passwordInput).toHaveAttribute('type', 'text');
        fireEvent.click(togglePasswordVisibilityButton);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });
});
