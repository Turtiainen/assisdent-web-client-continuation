import '@testing-library/jest-dom';
import {
    getCardViews,
    getRegisterViewsFromSchema,
    parseOrderOptions,
    parseRegisterMetaView,
} from '../utils/Parser';
import { OrderBy } from '../types/ViewTypes/OrderOptions';
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
                { OrderOptionName: 'LastNameOrdering', IsDescending: false },
                { OrderOptionName: 'IdOrderOption', IsDescending: false },
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
                { OrderOptionName: 'FirstNameOrdering', IsDescending: false },
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

describe('Call getCardViews', () => {
    it('should return only cardView schemas when called', async () => {
        const result = await getCardViews();
        expect(result).toBeInstanceOf(Array);
        expect(result).not.toHaveLength(0);

        //Results should only contain Documents with type "CardViewDefinition"
        result.forEach((document: Document) => {
            expect(document).toBeInstanceOf(Document);

            const child = document.children[0];

            expect(child.getAttribute('xsi:type')).toEqual(
                'CardViewDefinition',
            );
        });
    });
});

describe('Call getRegisterViewsFromSchema', () => {
    it('should extract registerviews from the passed schema', () => {
        const result = getRegisterViewsFromSchema(mockSchema);
        expect(result).toBeInstanceOf(Array);
        expect(result).not.toHaveLength(0);
        //Results should only contain Documents with type "TabViewDefinition"
        result.forEach((document: Document, index) => {
            expect(document).toBeInstanceOf(Document);

            const child = document.children[0];
            const xsi_type = child.getAttribute('xsi:type');
            const name = child.getAttribute('Name');

            expect(name).toContain('RegisterView');
            expect(['TabViewDefinition', 'RegisterViewDefinition']).toContain(
                xsi_type,
            );
        });
    });
    it('should return empty array if schema is not passed as parameter', () => {
        const result = getRegisterViewsFromSchema();
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(0);
    });
});

describe('Call parseRegisterMetaView', () => {
    it('should return the register view columns when valid xml view element is passed', () => {
        //Patient register view
        const registerView = getRegisterViewsFromSchema(mockSchema)[5];
        const result = parseRegisterMetaView(
            registerView as unknown as Element,
        );
        expect(result).toBeInstanceOf(Array);
        expect(result).not.toHaveLength(0);

        //Result should have correct table column headers
        const expectedHeaders = [
            'Nimi',
            'Henkilötunnus',
            'Perustiedot',
            'Oma toimipiste',
        ];
        const actualHeaders = result.map((c) => c.header);

        expect(actualHeaders.sort()).toEqual(expectedHeaders.sort());
    });
    it('should return empty array if element is not valid', () => {
        const result = parseRegisterMetaView(document.createElement('div'));
        expect(result).toEqual([]);
    });
});
