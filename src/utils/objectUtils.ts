import { DynamicObject } from '../types/DynamicObject';

const findValueFromNestedObject = (
    props: Array<string>,
    obj: DynamicObject,
): string | null => {
    let currentObj = obj;
    for (const prop of props) {
        // eslint-disable-next-line no-prototype-builtins
        if (currentObj.hasOwnProperty(prop)) {
            currentObj = currentObj[prop];
        } else {
            return null;
        }
    }
    return currentObj.toString();
};

export const findValueFromArrayOfNestedObjects = (
    props: Array<string>,
    array: Array<DynamicObject>,
) => {
    for (const obj of array) {
        const value = findValueFromNestedObject(props, obj);
        if (value) {
            return value;
        }
    }
    return null;
};

// This might be useless, because the function above does pretty much the same thing
export const checkIfObjectHasNestedProperty = (
    obj: DynamicObject,
    props: string[],
): boolean => {
    let currentObj = obj;
    for (const prop of props) {
        // eslint-disable-next-line no-prototype-builtins
        if (currentObj.hasOwnProperty(prop)) {
            currentObj = currentObj[prop];
        } else {
            return false;
        }
    }
    return true;
};

const getElementsFromViewAsObjectRecursive = (root: Element) => {
    const resultObj: DynamicObject = { TagName: root.tagName };
    for (const attrName of root.getAttributeNames()) {
        resultObj[attrName] = root.getAttribute(attrName);
    }
    if (root.hasChildNodes()) {
        resultObj['Children'] = [] as DynamicObject[];
        for (let i = 0; i < root.children.length; i++) {
            resultObj['Children'].push(
                getElementsFromViewAsObjectRecursive(root.children[i]),
            );
        }
    }
    return resultObj;
};
export const getRegisterMetaViewAsObject = (view: Element) => {
    return getElementsFromViewAsObjectRecursive(view);
};
