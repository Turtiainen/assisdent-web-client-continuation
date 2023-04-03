import {
    checkIfObjectHasNestedProperty,
    findValueFromArrayOfNestedObjects,
} from '../utils/objectUtils';

// describe('Call getValueOfMatchingKeyFromNestedArray', () => {
//     it('Should return null from emtpy array', () => {
//         const returnValue = getValueOfMatchingKeyFromNestedArray('Target', []);
//         expect(returnValue).toBeNull();
//     });
//
//     it('Should return null from array with no matching key', () => {
//         const returnValue = getValueOfMatchingKeyFromNestedArray('Target', [
//             { Test: 'Test' },
//         ]);
//         expect(returnValue).toBeNull();
//     });
//
//     it('Should return value from array with matching key', () => {
//         const returnValue = getValueOfMatchingKeyFromNestedArray('Target', [
//             { Target: 'Test' },
//         ]);
//         expect(returnValue).toEqual('Test');
//     });
//
//     it('Should return value from nested array with matching key', () => {
//         const returnValue = getValueOfMatchingKeyFromNestedArray('Target', [
//             { Test: { Target: 'Test' } },
//         ]);
//         expect(returnValue).toEqual('Test');
//     });
// });

describe('Call findValueFromArrayOfNestedObjects', () => {
    it('Should return null from emtpy array of objects', () => {
        const returnValue = findValueFromArrayOfNestedObjects(['Target'], []);
        expect(returnValue).toBeNull();
    });

    it('Should return null from array of objects with no matching key', () => {
        const returnValue = findValueFromArrayOfNestedObjects(
            ['Target'],
            [{ Test: 'Test' }],
        );
        expect(returnValue).toBeNull();
    });

    it('Should return value from array of objects with matching key', () => {
        const returnValue = findValueFromArrayOfNestedObjects(
            ['Target'],
            [{ Target: 'Test' }],
        );
        expect(returnValue).toEqual('Test');
    });

    it('Should return value from nested array of objects with matching key', () => {
        const returnValue = findValueFromArrayOfNestedObjects(
            ['Test', 'Target'],
            [{ Test: { Target: 'Test' } }],
        );
        expect(returnValue).toEqual('Test');
    });
});

describe('Call checkIfObjectHasNestedProperty', () => {
    it('Should return false from emtpy object', () => {
        const returnValue = checkIfObjectHasNestedProperty({}, ['Test']);
        expect(returnValue).toBeFalsy();
    });

    it('Should return false from object with no matching key', () => {
        const returnValue = checkIfObjectHasNestedProperty({ Test: 'Test' }, [
            'Target',
        ]);
        expect(returnValue).toBeFalsy();
    });

    it('Should return true from object with matching key', () => {
        const returnValue = checkIfObjectHasNestedProperty({ Target: 'Test' }, [
            'Target',
        ]);
        expect(returnValue).toBeTruthy();
    });

    it('Should return true from nested object with matching keys', () => {
        const returnValue = checkIfObjectHasNestedProperty(
            { Test: { Target: 'Test' } },
            ['Test', 'Target'],
        );
        expect(returnValue).toBeTruthy();
    });

    it('Should return false from nested object with no matching keys', () => {
        const returnValue = checkIfObjectHasNestedProperty(
            { Test: { Target: 'Test' } },
            ['Target', 'Test'],
        );
        expect(returnValue).toBeFalsy();
    });
});
