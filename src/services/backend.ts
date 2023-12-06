/**
 * Excluded from testing (for now) because needs API access
 */

import axios, { isAxiosError } from 'axios';
import { DtoSchema } from '../types/DtoSchema';
import { DynamicObject } from '../types/DynamicObject';
import { getUrls } from '../utils/constants';

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

// const navigate = useNavigate();

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

export const doLogin = async (username: string, password: string) => {
    const loginData: LoginData = {
        Username: username,
        Password: password,
        Type: 'Api',
        LoginType: 'Rest',
    };

    console.log(localStorage.getItem('domain'));
    try {
        const { data } = await axios.post<LoginResponse>(
            getUrls().loginUrl,
            loginData,
        );

        if (data.AccessToken) {
            sessionStorage.setItem('bt', data.AccessToken);
            return data.AccessToken;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`error at login: ${error.message}`);
            return 'error: ' + error.message;
        } else {
            console.error(`unknown error at login: ${error}`);
            return 'error: ' + error;
        }
    }

    return false;
};

const login = async () => {
    if (hasAccessToken()) {
        return getAccessToken();
    }
    // return await doLogin().then((data) => data);
    return null;
};

export async function getSchema() {
    console.log('----------------- Getting schema -----------------');

    await login();

    if (hasAccessToken()) {
        const accessToken = getAccessToken();
        try {
            const headers: DataQueryHeaders = {
                Authorization: `Bearer ${accessToken}`,
            };

            const { data } = await axios.get(getUrls().schemaUrl, { headers });
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
    return;
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
        const { data } = await axios.post(getUrls().entitySearchUrl, body, {
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

export const getEntityData = async (searchOptions: DynamicObject) => {
    const token = sessionStorage.getItem('bt');
    if (token === null) {
        console.warn('should login');
        return;
    }
    try {
        const body = {
            ...searchOptions,
        };
        const { data } = await axios.post(getUrls().entitySearchUrl, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`error at getEntityData: ${error.message}`);
        } else {
            console.error(`unknown error at getEntityData: ${error}`);
        }
        return null;
    }
};

export const getViewModelData = async (searchOptions: DynamicObject) => {
    const token = sessionStorage.getItem('bt');
    if (token === null) {
        console.warn('should login');
        return null;
    }

    try {
        const body = {
            ...searchOptions,
        };
        const { data } = await axios.post(getUrls().viewModelGetUrl, body, {
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

export const putEntityData = async (entityData: DynamicObject) => {
    const token = sessionStorage.getItem('bt');
    if (!token) {
        return;
    }

    try {
        const body = {
            ...entityData,
        };
        const { data } = await axios.put(getUrls().entityUrl, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(`error at putEntityData: ${error.message}`);
        } else {
            console.log(`unknown error at putEntityData: ${error}`);
        }
    }
};

export const postEntityData = async (entityData: DynamicObject) => {
    const token = sessionStorage.getItem('bt');
    if (!token) {
        return;
    }

    try {
        const body = {
            ...entityData,
        };
        const { data } = await axios.post(getUrls().entityUrl, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(`error at putEntityData: ${error.message}`);
        } else {
            console.log(`unknown error at putEntityData: ${error}`);
        }
    }
};

export const saveViewModelData = async (viewModelData: DynamicObject) => {
    const token = sessionStorage.getItem('bt');
    if (!token) {
        return;
    }

    try {
        const body = {
            ...viewModelData,
        };
        const { data } = await axios.post(getUrls().viewModelSaveUrl, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(`error at saveViewModelData: ${error.message}`);
        } else {
            console.log(`unknown error at saveViewModelData: ${error}`);
        }
    }
};
