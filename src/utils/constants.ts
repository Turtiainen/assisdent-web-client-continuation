export const getDomain = () => localStorage.getItem('domain');
export const BASE_ROUTE = () =>
    'https://appointment-beta.assiscare.com:28090/api/' + getDomain() + '/';

export enum Endpoint {
    Login = 'login',
    Schema = 'dack/schema',
    ViewModelGet = 'dack/viewmodel/get',
    ViewModelSave = 'dack/viewmodel/save',
    EntitySearch = 'dack/entity/search',
    Entity = 'dack/entity',
}

export const getEndpoint = (endpoint: Endpoint) => `${BASE_ROUTE()}${endpoint}`;

// This feature is introduced for dynamic calling when localStorage's value change
export const getUrls = () => {
    return {
        loginUrl: getEndpoint(Endpoint.Login),
        schemaUrl: getEndpoint(Endpoint.Schema),
        viewModelGetUrl: getEndpoint(Endpoint.ViewModelGet),
        viewModelSaveUrl: getEndpoint(Endpoint.ViewModelSave),
        entitySearchUrl: getEndpoint(Endpoint.EntitySearch),
        entityUrl: getEndpoint(Endpoint.Entity),
    };
};

export const SUPPORTED_LANGUAGES = ['fi', 'en', 'sv'] as const;
export type SupportedLanguages = typeof SUPPORTED_LANGUAGES;
export type ChosenLanguage = SupportedLanguages[number];
export const DEFAULT_LANGUAGE: ChosenLanguage = 'fi';

export const SHOW_ON_PAGE_OPTIONS = [10, 20, 50, 100];
export type ShowOnPageOptions = typeof SHOW_ON_PAGE_OPTIONS;
export type ShowOnPageOption = ShowOnPageOptions[number];
export const DEFAULT_SHOW_ON_PAGE: ShowOnPageOption = 10;
