import '@testing-library/jest-dom';
import { mapObjectValueByIntendedUse } from '../utils/mapUtils';

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
