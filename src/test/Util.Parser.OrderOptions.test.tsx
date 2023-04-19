import '@testing-library/jest-dom';
import { parseOrderOptions } from '../utils/Parser';
import { OrderBy, OrderOption } from '../types/ViewTypes/OrderOptions';
import json from '../temp/schema.json';
import { DtoSchema } from '../types/DtoSchema';
import { DynamicObject } from '../types/DynamicObject';

/**
 * Mocking
 */

//Mock the store with the static schema.json
const mockSchema = json as unknown as DtoSchema & {
    getState: () => { schema: object };
};

mockSchema.getState = function () {
    return {
        schema: json,
    };
};

jest.mock('../store/store', () => {
    return {
        ...mockSchema,
        getState: jest.fn(() => {
            return {
                schema: mockSchema,
            };
        }),
    };
});

const findMockSchemaEntity = (entityName: string) =>
    mockSchema.MetaData.Entities.find((e) => e.Name === entityName);

const createOrderOptionsElementFromObjectArray = (arr: DynamicObject[]) => {
    const OrderOptionsEl: Element = document.createElement('OrderOptions');
    arr.forEach((obj) => {
        const OptionEl: Element = document.createElement('OrderOption');
        for (const [key, value] of Object.entries(obj)) {
            // Use NS version of setAttribute, regular version lowercases the attribute name
            OptionEl.setAttributeNS(null, key, value);
        }
        OrderOptionsEl.appendChild(OptionEl);
    });
    return OrderOptionsEl;
};

/**
 * Simple input mocking
 */
const simpleInputOrderOptions: DynamicObject[] = [
    {
        __id: 'b89cdd95-f2e8-4314-9bdc-3a4154a41105',
        Identifier: 'Name',
        Caption: 'Nimi',
        OrderingName: 'Name',
        IsDescending: false,
    },
    {
        __id: '0456f466-aeff-4e4a-a174-0a09a184e01e',
        Identifier: 'PostalCode',
        Caption: 'Postinumero',
        OrderingName: 'Address.PostalCode',
        IsDescending: false,
    },
    {
        __id: 'c2e99e6b-4ff7-4a2e-a4f6-7acd11acae8b',
        Identifier: 'City',
        Caption: 'Postitoimipaikka',
        OrderingName: 'Address.City',
        IsDescending: false,
    },
];

const expectedSimpleOutput: OrderBy[] = [
    {
        Caption: 'Nimi',
        OrderBy: {
            __id: 'b89cdd95-f2e8-4314-9bdc-3a4154a41105',
            Identifier: 'Name',
            Caption: 'Nimi',
            OrderingName: 'Name',
            IsDescending: false,
            OrderOptionNames: [
                { OrderOptionName: 'Name', IsDescending: false },
            ],
        },
    },
    {
        Caption: 'Postinumero',
        OrderBy: {
            __id: '0456f466-aeff-4e4a-a174-0a09a184e01e',
            Identifier: 'PostalCode',
            Caption: 'Postinumero',
            OrderingName: 'Address.PostalCode',
            IsDescending: false,
            OrderOptionNames: [
                { OrderOptionName: 'Address.PostalCode', IsDescending: false },
            ],
        },
    },
    {
        Caption: 'Postitoimipaikka',
        OrderBy: {
            __id: 'c2e99e6b-4ff7-4a2e-a4f6-7acd11acae8b',
            Identifier: 'City',
            Caption: 'Postitoimipaikka',
            OrderingName: 'Address.City',
            IsDescending: false,
            OrderOptionNames: [
                { OrderOptionName: 'Address.City', IsDescending: false },
            ],
        },
    },
];

const simpleInput = createOrderOptionsElementFromObjectArray(
    simpleInputOrderOptions,
);

/**
 * More complicated input mocking
 */
const complicatedInputOrderOptions: DynamicObject[] = [
    {
        __id: '2791ea52-d0ee-44b2-9fff-44dfacf08638',
        Identifier: 'Date',
        Caption: 'Päivämäärä',
        OrderingName: 'DateOrdering,LastNameOrdering,IdOrderOption',
        IsDescending: false,
    },
    {
        __id: '55491326-1428-4e20-a3da-4b7bdca41cf3',
        Identifier: 'LastName',
        Caption: 'Sukunimi',
        OrderingName: 'LastNameOrdering,FirstNameOrdering',
        IsDescending: false,
    },
];

const complicatedInput = createOrderOptionsElementFromObjectArray(
    complicatedInputOrderOptions,
);

const expectedComplicatedOutput: OrderBy[] = [
    {
        Caption: 'Päivämäärä',
        OrderBy: {
            __id: '2791ea52-d0ee-44b2-9fff-44dfacf08638',
            Identifier: 'Date',
            Caption: 'Päivämäärä',
            OrderingName: 'DateOrdering,LastNameOrdering,IdOrderOption',
            IsDescending: false,
            OrderOptionNames: [
                { OrderOptionName: 'DateOrdering', IsDescending: false },
                { OrderOptionName: 'LastNameOrdering' },
                { OrderOptionName: 'IdOrderOption' },
            ],
        },
    },
    {
        Caption: 'Sukunimi',
        OrderBy: {
            __id: '55491326-1428-4e20-a3da-4b7bdca41cf3',
            Identifier: 'LastName',
            Caption: 'Sukunimi',
            OrderingName: 'LastNameOrdering,FirstNameOrdering',
            IsDescending: false,
            OrderOptionNames: [
                { OrderOptionName: 'LastNameOrdering', IsDescending: false },
                { OrderOptionName: 'FirstNameOrdering' },
            ],
        },
    },
];

describe('Call parseOrderOptions', () => {
    it('should return expected output array with simple input', () => {
        const SchemaEntity = findMockSchemaEntity('Branch');
        expect(parseOrderOptions(simpleInput, SchemaEntity!)).toEqual(
            expectedSimpleOutput,
        );
    });

    it('should return expected output array with multicolumn orderings', () => {
        const SchemaEntity = findMockSchemaEntity('Recall');
        expect(parseOrderOptions(complicatedInput, SchemaEntity!)).toEqual(
            expectedComplicatedOutput,
        );
    });
});
