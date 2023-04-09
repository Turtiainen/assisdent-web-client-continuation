// TODO is there some other types of intended use?
import { DynamicObject } from '../types/DynamicObject';

export const mapObjectValueByIntendedUse = (
    value: any,
    intendedUse: string,
) => {
    switch (intendedUse) {
        case 'Percentage':
            return `${parseFloat(value) * 100}%`;
        default:
            return value;
    }
};

export const mapObjectPaths = (obj: DynamicObject, parentKey = '') => {
    let paths: string[] = [];

    for (const key in obj) {
        if (key === '_update' || key === '_set_ref') {
            continue;
        }
        const path = parentKey ? `${parentKey}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            paths = paths.concat(mapObjectPaths(obj[key], path));
        } else {
            paths.push(path);
        }
    }

    return paths;
};
