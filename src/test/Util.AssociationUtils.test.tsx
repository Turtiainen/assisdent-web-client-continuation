import '@testing-library/jest-dom';
import {
    commonFieldsReducer,
    getAssociationType,
    mapAssociationTypePatchCommands,
} from '../utils/associationUtils';
import { DynamicObject } from '../types/DynamicObject';
describe('Call getAssociationType', () => {
    it('should return null with empty object', () => {
        const returnValue = getAssociationType({});
        expect(returnValue).toBeNull();
    });

    it('should return null with empty array', () => {
        const returnValue = getAssociationType([]);
        expect(returnValue).toBeNull();
    });

    describe('should return correct association types', () => {
        it('Aggregation', () => {
            const testObject: DynamicObject = {
                IsRealAssociation: true,
                AssociationInfo: {
                    AssociationType: 1,
                },
            };
            const returnValue = getAssociationType(testObject);
            expect(returnValue).toEqual('Aggregation');
        });

        it('Composition', () => {
            const testObject: DynamicObject = {
                IsRealAssociation: true,
            };
            const returnValue = getAssociationType(testObject);
            expect(returnValue).toEqual('Composition');
        });
    });
});

describe('Call mapAssociationTypePatchCommands', () => {
    it('should return empty array when called with such', () => {
        const returnValue = mapAssociationTypePatchCommands([{}]);
        expect(returnValue).toEqual([{}]);
    });

    it('should remove associationType field when called with such object in array', () => {
        const returnValue = mapAssociationTypePatchCommands([
            {
                associationType: 'Aggregation',
            },
        ]);
        expect(returnValue).toEqual([{}]);
    });

    it('should leave other fields untouched', () => {
        const returnValue = mapAssociationTypePatchCommands([
            {
                associationType: null,
                test: 'test',
            },
        ]);
        expect(returnValue).toEqual([{ test: 'test' }]);
    });

    it('should work similarly with two objects in array', () => {
        const returnValue = mapAssociationTypePatchCommands([
            {
                associationType: null,
                test: 'test',
            },
            {
                associationType: null,
                test2: 'test2',
            },
        ]);
        expect(returnValue).toEqual([{ test: 'test' }, { test2: 'test2' }]);
    });

    it('should add _set_ref level to object with Aggregation associationType between the other key and its value', () => {
        const returnValue = mapAssociationTypePatchCommands([
            {
                associationType: 'Aggregation',
                test: 'test',
            },
        ]);
        expect(returnValue).toEqual([{ test: { _set_ref: ['test'] } }]);
    });

    it('should work similarly for Comositions but by adding _update level', () => {
        const returnValue = mapAssociationTypePatchCommands([
            {
                associationType: 'Composition',
                test: {
                    testKey: 'testValue',
                },
            },
        ]);
        expect(returnValue).toEqual([
            {
                test: {
                    _update: [
                        {
                            testKey: 'testValue',
                        },
                    ],
                },
            },
        ]);
    });
});

describe('Call commonFieldsReducer', () => {
    it('should include all keys if no common fields are found in the objects', () => {
        const testArray = [
            {
                test: 'test',
            },
            {
                test2: 'test2',
            },
        ];
        const result = testArray.reduce(commonFieldsReducer, {});
        expect(result).toEqual({
            test: 'test',
            test2: 'test2',
        });
    });

    it('should combine common keys from objects', () => {
        const testArray = [
            {
                test: {
                    testKey: 'testValue',
                },
            },
            {
                test: {
                    testKey2: 'testValue2',
                },
            },
        ];
        const result = testArray.reduce(commonFieldsReducer, {});
        expect(result).toEqual({
            test: {
                testKey: 'testValue',
                testKey2: 'testValue2',
            },
        });
    });

    it('should work even if there are patch commands in the objects', () => {
        const testArray = [
            {
                test: {
                    _set_ref: [{ test2: { testA: 'testA' } }],
                },
            },
            {
                test: {
                    _set_ref: [{ test3: { testB: 'testB' } }],
                },
            },
        ];
        const result = testArray.reduce(commonFieldsReducer, {});
        expect(result).toEqual({
            test: {
                _set_ref: [
                    {
                        test2: {
                            testA: 'testA',
                        },
                        test3: {
                            testB: 'testB',
                        },
                    },
                ],
            },
        });
    });

    it('should work with deeply nnested objects', () => {
        const testArray = [
            {
                Person: {
                    Address: {
                        Street: 'Linnanpellontie 21',
                    },
                },
            },
            {
                Person: {
                    Address: {
                        PostalCode: '03600',
                    },
                },
            },
        ];

        const result = testArray.reduce(commonFieldsReducer, {});
        console.log(result);
        expect(result).toEqual({
            Person: {
                Address: {
                    PostalCode: '03600',
                    Street: 'Linnanpellontie 21',
                },
            },
        });
    });
});
