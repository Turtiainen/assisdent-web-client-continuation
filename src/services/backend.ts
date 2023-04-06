import axios, { AxiosRequestConfig, isAxiosError } from 'axios';
import { DtoSchema } from '../types/DtoSchema';
import { DynamicObject } from '../types/DynamicObject';

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

type EntitySearchTypes = {
    entityType: string | null;
    viewName: string | null;
    currentPage?: number;
    orderBy: string | null;
};

/*
  TODO: later this can be refactored to separate login function, which securely stores the AccessToken for further query
  for getting the actual data.

  Also, return type is any for
*/
export async function getSchema() {
    console.log('----------------- Getting schema -----------------');
    const loginData: LoginData = {
        Username: import.meta.env.VITE_ASSISCARE_USER,
        Password: import.meta.env.VITE_ASSISCARE_PASS,
        Type: 'Api',
        LoginType: 'Rest',
    };
    try {
        const { data } = await axios.post<LoginResponse>(
            `${import.meta.env.VITE_ASSISCARE_BASE}${
                import.meta.env.VITE_ASSISCARE_ROUTE
            }login`,
            loginData,
        );
        if (data.AccessToken) {
            // TODO store AccessToken?
            const accessToken = data.AccessToken;
            sessionStorage.setItem('bt', accessToken);
            try {
                const headers: DataQueryHeaders = {
                    Authorization: `Bearer ${accessToken}`,
                };

                // TODO typing (reference: DtoSchema in sample cs project. Very heavy typing, has to be done later)
                const { data } = await axios.get(
                    `${import.meta.env.VITE_ASSISCARE_BASE}${
                        import.meta.env.VITE_ASSISCARE_ROUTE
                    }dack/schema`,
                    {
                        headers,
                    },
                );
                return data as DtoSchema;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(`error at getSchema: ${error.message}`);
                } else {
                    console.log(`unknown error at login: ${error}`);
                }
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(`error at login: ${error.message}`);
        } else {
            console.log(`unknown error at login: ${error}`);
        }
    }
}

export async function getOrganizationName() {
    const { data } = await axios.get(
        `${import.meta.env.VITE_ASSISCARE_BASE}${
            import.meta.env.VITE_ASSISCARE_ROUTE
        }organization`,
    );
    return data.json();
}

export const getEntitiesForRegisterView = async ({
    entityType,
    viewName,
    currentPage,
    orderBy,
}: EntitySearchTypes) => {
    const token = sessionStorage.getItem('bt');
    if (!token) {
        console.log('should login');
        return;
    }

    const body = {
        EntityType: entityType,
        Purpose: 'Register',
        PurposeArgs: {
            ViewName: viewName,
        },
        Skip: currentPage! * 10,
        Take: 10,
        OrderBy: null,
        SearchLanguage: 'fi',
    };

    try {
        const { data } = await axios.post(
            `${import.meta.env.VITE_ASSISCARE_BASE}${
                import.meta.env.VITE_ASSISCARE_ROUTE
            }dack/entity/search`,
            body,
            { headers: { Authorization: `Bearer ${token}` } },
        );
        return data;
    } catch (e) {
        if (isAxiosError(e)) {
            console.log(`error at getEntitiesForRegisterView: ${e.message}`);
        } else {
            console.log(`unknown error at getEntitiesForRegisterView: ${e}`);
        }
    }

    return null;
};

export const getEntityData = async (searchOptions: DynamicObject) => {
    const token = sessionStorage.getItem('bt');
    if (!token) {
        console.log('should login');
        return;
    }
    try {
        const body = {
            ...searchOptions,
        };
        const { data } = await axios.post(
            `${import.meta.env.VITE_ASSISCARE_BASE}${
                import.meta.env.VITE_ASSISCARE_ROUTE
            }dack/entity/search`,
            body,
            { headers: { Authorization: `Bearer ${token}` } },
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(`error at getEntityData: ${error.message}`);
        } else {
            console.log(`unknown error at getEntityData: ${error}`);
        }
        return null;
    }
};

export const getViewModelData = async (searchOptions: DynamicObject) => {
    const token = sessionStorage.getItem('bt');
    if (!token) {
        console.log('should login');
        return null;
    }

    try {
        const body = {
            ...searchOptions,
        };
        const { data } = await axios.post(
            `${import.meta.env.VITE_ASSISCARE_BASE}${
                import.meta.env.VITE_ASSISCARE_ROUTE
            }dack/viewmodel/get`,
            body,
            { headers: { Authorization: `Bearer ${token}` } },
        );

        if (data)
            return data as {
                ViewModelType: string;
                ViewModelData: DynamicObject;
            };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(`error at getViewModelData: ${error.message}`);
        } else {
            console.log(`unknown error at getViewModelData: ${error}`);
        }
    }
    return null;
};
