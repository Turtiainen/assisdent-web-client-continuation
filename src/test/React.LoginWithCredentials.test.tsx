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
            target: { value: 'seppomö' },
        });
        fireEvent.change(passwordInput, {
            target: { value: 'pora' },
        });

        expect(usernameInput.value).toBe('seppomö');
        expect(passwordInput.value).toBe('pora');
    });

    it('should display error when input is empty', async () => {
        const enterButton = screen.getByText('Jatka');
        const regex = /Kirjautuminen\s*epäonnistui\./;

        fireEvent.click(enterButton);

        await act(async () => {
            expect(screen.getByText(regex)).toBeInTheDocument();
        });
    });

    it('should doing login after correct input', async () => {
        const mockNavigate = useNavigate();

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

        const enterButton = screen.getByText('Jatka');
        const mockSetItem = jest.spyOn(window.sessionStorage, 'setItem');

        fireEvent.click(enterButton);
        await sleep(3000);

        // const homepageText = screen.getByText('OMAT TIEDOT');

        // expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(mockSetItem).toHaveBeenCalledTimes(1);
        // expect(mockSetItem).toHaveBeenCalledWith(
        //     'domain',
        //     'feature_sweproject',
        // );
    });
});
