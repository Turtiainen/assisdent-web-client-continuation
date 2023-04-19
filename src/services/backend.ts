import axios, { isAxiosError } from 'axios';
import { DtoSchema } from '../types/DtoSchema';
import { DynamicObject } from '../types/DynamicObject';
import {
    ENDPOINT_ENTITY_SEARCH,
    ENDPOINT_LOGIN,
    ENDPOINT_SCHEMA,
    ENDPOINT_VIEWMODEL_GET,
} from '../utils/constants';

type LoginData = {
    Username: string;
    Password: string;
    Type: string;
    LoginType: string;
};

type LoginResponse = {
    AccessToken: string;
};

type DataQueryHeaders = {
    Authorization: string;
};

const hasAccessToken = () => {
    const token = sessionStorage.getItem('bt');
    return token !== null;
};

const getAccessToken = () => {
    const token = sessionStorage.getItem('bt');
    if (token === null) {
        console.warn('No access token is stored. Please log in first.');
        return false;
    }
    return token;
};

const doLogin = async () => {
    const loginData: LoginData = {
        Username: import.meta.env.VITE_ASSISCARE_USER,
        Password: import.meta.env.VITE_ASSISCARE_PASS,
        Type: 'Api',
        LoginType: 'Rest',
    };

    try {
        const { data } = await axios.post<LoginResponse>(
            ENDPOINT_LOGIN,
            loginData,
        );

        if (data.AccessToken) {
            sessionStorage.setItem('bt', data.AccessToken);
            return data.AccessToken;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`error at login: ${error.message}`);
        } else {
            console.error(`unknown error at login: ${error}`);
        }
    }

    return false;
};

const login = () => {
    if (hasAccessToken()) {
        return getAccessToken();
    }
    return doLogin().then((data) => data);
};

export async function getSchema() {
    console.log('----------------- Getting schema -----------------');

    login();

    if (hasAccessToken()) {
        const accessToken = getAccessToken();
        try {
            const headers: DataQueryHeaders = {
                Authorization: `Bearer ${accessToken}`,
            };

            const { data } = await axios.get(ENDPOINT_SCHEMA, { headers });
            return data as DtoSchema;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(`error at getSchema: ${error.message}`);
            } else {
                console.error(`unknown error at login: ${error}`);
            }
        }
    }

    console.warn('should login');
    return null;
}

export const getEntitiesForRegisterView = async (options: DynamicObject) => {
    const token = getAccessToken();
    if (token === null) {
        console.warn('should login');
        return;
    }

    const body = {
        ...options,
    };

    try {
        const { data } = await axios.post(ENDPOINT_ENTITY_SEARCH, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    } catch (e) {
        if (isAxiosError(e)) {
            console.error(`error at getEntitiesForRegisterView: ${e.message}`);
        } else {
            console.error(`unknown error at getEntitiesForRegisterView: ${e}`);
        }
    }

    return null;
};

export const getViewModelData = async (searchOptions: DynamicObject) => {
    const token = sessionStorage.getItem('bt');
    if (token === null) {
        console.log('should login');
        return null;
    }

    try {
        const body = {
            ...searchOptions,
        };
        const { data } = await axios.post(ENDPOINT_VIEWMODEL_GET, body, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (data)
            return data as {
                ViewModelType: string;
                ViewModelData: DynamicObject;
            };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`error at getViewModelData: ${error.message}`);
        } else {
            console.error(`unknown error at getViewModelData: ${error}`);
        }
    }
    return null;
};
