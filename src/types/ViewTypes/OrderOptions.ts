export type OrderOptionNameObject = {
    OrderOptionName: string;
    IsDescending?: boolean;
};

export type OrderOption = {
    __id: string;
    Identifier: string;
    Caption: string;
    OrderingName: string;
    IsDescending: boolean;
    OrderOptionNames: OrderOptionNameObject[]; // Custom property for API calls
    [index: string]: string | string[] | boolean | OrderOptionNameObject[];
};

export type OrderBy = {
    Caption: string;
    OrderBy: OrderOption;
};
