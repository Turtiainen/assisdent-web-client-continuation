import { DynamicObject } from '../types/DynamicObject';

const getNestedKeyValue = (
    obj: DynamicObject,
    target: string,
): string | null => {
    for (const key in obj) {
        if (key === target) {
            console.log(obj[key]);
            console.log(key);
            return obj[key];
        } else if (typeof obj[key] === 'object') {
            return getNestedKeyValue(obj[key], target);
        }
    }
    return null;
};

export const getValueOfMatchingKeyFromNestedArray = (
    target: string,
    array: Array<DynamicObject>,
) => {
    for (const obj of array) {
        const valueOfMatchingKey = getNestedKeyValue(obj, target);
        if (valueOfMatchingKey) {
            return valueOfMatchingKey;
        }
    }
    return null;
};
