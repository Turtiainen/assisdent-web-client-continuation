export const BASE_ROUTE = `${import.meta.env.VITE_ASSISCARE_BASE}${
    import.meta.env.VITE_ASSISCARE_ROUTE
}`;
export const ENDPOINT_LOGIN = `${BASE_ROUTE}login`;
export const ENDPOINT_SCHEMA = `${BASE_ROUTE}dack/schema`;
export const ENDPOINT_VIEWMODEL_GET = `${BASE_ROUTE}dack/viewmodel/get`;
export const ENDPOINT_ENTITY_SEARCH = `${BASE_ROUTE}dack/entity/search`;

export const SUPPORTED_LANGUAGES = ['fi', 'en', 'sv'] as const;
export type SupportedLanguages = typeof SUPPORTED_LANGUAGES;
export type ChosenLanguage = SupportedLanguages[number];
export const DEFAULT_LANGUAGE: ChosenLanguage = 'fi';

export const SHOW_ON_PAGE_OPTIONS = [10, 20, 50, 100];
export type ShowOnPageOptions = typeof SHOW_ON_PAGE_OPTIONS;
export type ShowOnPageOption = ShowOnPageOptions[number];
export const DEFAULT_SHOW_ON_PAGE: ShowOnPageOption = 10;
