import { getValueOfMatchingKeyFromNestedArray } from '../utils/objectUtils';

describe('Call getValueOfMatchingKeyFromNestedArray', () => {
    it('Should return null from emtpy array', () => {
        const returnValue = getValueOfMatchingKeyFromNestedArray('Target', []);
        expect(returnValue).toBeNull();
    });

    it('Should return null from array with no matching key', () => {
        const returnValue = getValueOfMatchingKeyFromNestedArray('Target', [
            { Test: 'Test' },
        ]);
        expect(returnValue).toBeNull();
    });

    it('Should return value from array with matching key', () => {
        const returnValue = getValueOfMatchingKeyFromNestedArray('Target', [
            { Target: 'Test' },
        ]);
        expect(returnValue).toEqual('Test');
    });

    it('Should return value from nested array with matching key', () => {
        const returnValue = getValueOfMatchingKeyFromNestedArray('Target', [
            { Test: { Target: 'Test' } },
        ]);
        expect(returnValue).toEqual('Test');
    });
});
