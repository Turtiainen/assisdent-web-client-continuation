import '@testing-library/jest-dom';
import { mapObjectPaths, mapObjectValueByIntendedUse } from '../utils/mapUtils';

describe('Call mapObjectValueByIntendedUse', () => {
    it('should return the same value given an empty string as the intendedUse', () => {
        const returnValue = mapObjectValueByIntendedUse(10, '');
        expect(returnValue).toEqual(10);
    });

    it('should return a percentage string of a given value with percentage as the intendedUse', () => {
        const returnValue = mapObjectValueByIntendedUse(0, 'Percentage');
        expect(returnValue).toEqual('0%');
    });

    it('should return a correct percentage string for a float', () => {
        const returnValue = mapObjectValueByIntendedUse(0.065, 'Percentage');
        expect(returnValue).toEqual('6.5%');
    });

    it('should return a correct percentage string a negative value', () => {
        const returnValue = mapObjectValueByIntendedUse(-0.01, 'Percentage');
        expect(returnValue).toEqual('-1%');
    });
});

describe('Call mapObjectPaths', () => {
    const shallowObject1 = {
        Test1: 'value1',
        Test2: 'value2',
        Test3: 'value3',
    };

    const nestedObject1 = {
        Test1: 'value1',
        Test2: {
            Test3: 'value3',
            Test4: 'value4',
        },
    };

    const nestedObject2 = {
        Test1: 'value1',
        Test2: {
            Test3: 'value3',
            Test4: {
                Test5: 'value5',
                Test6: 'value6',
            },
        },
    };

    it('should return empty array if called with empty object', () => {
        const returnValue = mapObjectPaths({});
        expect(returnValue).toEqual([]);
    });

    it('should return an array of paths for a shallow object', () => {
        const returnValue = mapObjectPaths(shallowObject1);
        expect(returnValue).toEqual(['Test1', 'Test2', 'Test3']);
    });

    it('should return an array of paths for a nested object', () => {
        const returnValue = mapObjectPaths(nestedObject1);
        expect(returnValue).toEqual(['Test1', 'Test2.Test3', 'Test2.Test4']);
    });

    it('should return an array of paths for a nested (3 levels) object', () => {
        const returnValue = mapObjectPaths(nestedObject2);
        expect(returnValue).toEqual([
            'Test1',
            'Test2.Test3',
            'Test2.Test4.Test5',
            'Test2.Test4.Test6',
        ]);
    });
});
