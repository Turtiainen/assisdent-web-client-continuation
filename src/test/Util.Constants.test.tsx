import {
    BASE_ROUTE,
    Endpoint,
    getDomain,
    getEndpoint,
    getUrls,
} from '../utils/constants';

/**
 * MOCK LOCALSTORAGE
 */

const localStorageMock = (function () {
    let store: { [key: string]: string } = {};
    return {
        getItem(key: string) {
            return store[key];
        },

        setItem(key: string, value: string) {
            store[key] = value;
        },

        clear() {
            store = {};
        },

        removeItem(key: string) {
            delete store[key];
        },

        getAll() {
            return store;
        },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

/**
 * END MOCK LOCALSTORAGE
 */

describe('call getDomain', () => {
    it('should return mocked localstorage domain value', () => {
        localStorageMock.setItem('domain', 'mock-domain');
        const result = getDomain();
        expect(result).toEqual('mock-domain');
    });
});
describe('Call BASE_ROUTE', () => {
    it('should return baseeroute with domain that is set to localstorage', () => {
        const result = BASE_ROUTE();
        expect(result).toEqual(
            `https://appointment-beta.assiscare.com:28090/api/${getDomain()}/`,
        );
    });
});
describe('Call getEndpoint', () => {
    it('should return baseroute concatenated with valid endpoints', () => {
        Object.values(Endpoint).forEach((value) => {
            const result = getEndpoint(value);
            expect(result).toEqual(`${BASE_ROUTE()}${value}`);
        });
    });
});
describe('Call getUrls', () => {
    it('should return a object containing urls for all endpoints', () => {
        const result = getUrls();
        //Check that reuslt object has all keys
        const expectedKeys = [
            'loginUrl',
            'schemaUrl',
            'viewModelGetUrl',
            'viewModelSaveUrl',
            'entitySearchUrl',
            'entityUrl',
        ];
        expect(Object.keys(result).sort()).toEqual(expectedKeys.sort());
        //Check that all result object has valid values
        const endpoints = Object.values(Endpoint);
        Object.values(result).forEach((url) => {
            const strippedUrl = url?.replace(BASE_ROUTE(), '');
            expect(endpoints).toContain(strippedUrl);
        });
    });
});
