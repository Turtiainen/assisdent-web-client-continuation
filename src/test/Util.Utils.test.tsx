import {
    parseHandlebars,
    resolveCardBindings,
    resolveEntityBindings,
    sanitizeBinding,
    tryToGetSchema,
} from '../utils/utils';
import json from '../temp/schema.json';
import { DtoSchema } from '../types/DtoSchema';

/**
 * START MOCKING SCHEMA
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

/**
 * END MOCKING SCHEMA
 */

describe('Call tryToGetSchema', () => {
    it('should return undefined if entityType is null', () => {
        const result = tryToGetSchema(null, 'somePath');
        expect(result).toBe(undefined);
    });

    it('should return correct entity schema when path is string', () => {
        //Searching for Person within Employee entity
        const result = tryToGetSchema('Employee', 'Person');
        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty('Name', 'Person');
    });
});

describe('Call resolveEntityBindings', () => {
    const mockEntity = {
        Person: {
            Id: 'some-id',
            FirstName: 'SomeName',
            LastName: 'SomeLastName',
            Gender: 0,
        },
        RecallMessageType: {
            Id: 'adc41a22-d3c3-601c-e394-8fef38f09ddd',
            Name: 'Nuorekas',
        },
        BirthDate: '0001-01-01T00:00:00',
        Language: 'fi',
        Age: '40',
        Tags: ['first', 'second'],
        OwnBranch: null,
    };
    it('should resolve multiple bindings to actual values when correct info is passed', () => {
        const mockBindings = [
            ['{FormattedText PersonFullName}'],
            ['{FormattedText PatientGenderAgeAndLanguage}'],
        ];
        const result = resolveEntityBindings(
            mockEntity,
            mockBindings,
            'Patient',
        );
        const expected = [['SomeLastName SomeName'], ['0 (40) fi']];
        expect(result).toEqual(expected);
    });
    it('should resolve unknown binding to undefined if passed in bindings array', () => {
        const result = resolveEntityBindings(
            mockEntity,
            [['{invalidBinding someAttribute}']],
            'Patient',
        );
        expect(result).toEqual([[undefined]]);
    });
    it('should return "-" if given binding can not be resolved into any attribute value', () => {
        const result = resolveEntityBindings(
            mockEntity,
            [['{Binding someAttribute}']],
            'Patient',
        );
        expect(result).toEqual([['-']]);
    });
    it('should return array of values when binding is resolved to attribute value that is array', () => {
        const result = resolveEntityBindings(
            mockEntity,
            [['{Binding Tags}']],
            'Patient',
        );
        expect(result).toBeInstanceOf(Array);
    });
    it('should return object name attribute when binding is resolved to attribute value that is an object', () => {
        const result = resolveEntityBindings(
            mockEntity,
            [['{Binding RecallMessageType}']],
            'Recall',
        );
        expect(result).toEqual([['Nuorekas']]);
    });
});

describe('call sanitizeBinding', () => {
    it('should return passed binding if it does not match eny binding types', () => {
        const result = sanitizeBinding('{invalid}');
        expect(result).toBe('{invalid}');
    });

    it('should return sanitized binding (without {Binding in front)', () => {
        const result = sanitizeBinding('{Binding someEntity.someAttribute}');
        expect(result).toBe('someEntity.someAttribute');
    });

    it('should return sanitized formattedText (without {FormattedText in front)', () => {
        const result = sanitizeBinding('{FormattedText some.id - some.name}');
        expect(result).toBe('some.id - some.name');
    });
});

describe('call resolveCardBindings', () => {
    const mockEntity = {
        Person: {
            Id: 'some-id',
            FirstName: 'SomeName',
            LastName: 'SomeLastName',
            Gender: 0,
        },
        BirthDate: '0001-01-01T00:00:00',
        Language: 'fi',
        Age: '40',
        Tags: ['first', 'second'],
        OwnBranch: null,
    };
    it('should resolve binding to actual value when valid bindings are passed', () => {
        const result = resolveCardBindings(
            mockEntity,
            '{FormattedText PersonFullName}',
            'Patient',
        );
        expect(result).toEqual('SomeLastName SomeName');
    });
    it('should resolve binding when valid path to entity is passed', () => {
        const result = resolveCardBindings(
            { Entity: mockEntity },
            '{FormattedText PersonFullName;;Path=Entity}',
            'Patient',
        );
        expect(result).toEqual('SomeLastName SomeName');
    });
    it('should return undefined when invalid path to entity is passed', () => {
        const result = resolveCardBindings(
            { Entity: mockEntity },
            '{FormattedText PersonFullName;;Path=invalid',
            'Patient',
        );
        expect(result).toEqual(undefined);
    });
    it('should return passed binding when bindingType is not valid', () => {
        const result = resolveCardBindings(
            mockEntity,
            '{InvalidBinding PersonFullName}',
            'Patient',
        );
        expect(result).toEqual('{InvalidBinding PersonFullName}');
    });
    it('should return "" if entity is null', () => {
        const result = resolveCardBindings(null, 'something');
        expect(result).toEqual('');
    });
    it('should return null if formattedText can not be created', () => {
        const result = resolveCardBindings(
            mockEntity,
            '{FormattedText NotFound}',
            'Patient',
        );
        expect(result).toBe(undefined);
    });
    it('should return Employee $EntityToString value (lastname firstname)', () => {
        const mockEmployee = {
            Entity: {
                Person: {
                    FirstName: 'Testi',
                    LastName: 'Testeri Tes',
                },
                ShortName: 'Test',
                UserName: 'testester',
            },
        };
        const result = resolveCardBindings(
            mockEmployee,
            '{FormattedText $EntityToString;;Path=Entity}',
            'Employee',
        );
        expect(result).toEqual('Testeri Tes Testi');
    });
});

describe('Call parseHandlebars', () => {
    it('should return undefined if template is undefined', () => {
        const result = parseHandlebars(undefined, 'data');
        expect(result).toBe(undefined);
    });
});
