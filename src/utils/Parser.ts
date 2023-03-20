import { getSchema } from '../services/backend';
import { DtoView } from '../types/DtoView';
import { DtoSchema } from '../types/DtoSchema';
import { DynamicObject } from '../types/DynamicObject';

export const getRegisterViews = async () => {
    return await getSchema().then((result) => {
        if (!result) return [];

        const xmlMetaViewList = result.MetaViews;
        const xmlParser = new DOMParser();
        const listOfMetaViews: Document[] = [];

        xmlMetaViewList.map((metaView: DtoView) =>
            listOfMetaViews.push(
                xmlParser.parseFromString(metaView.XML, 'text/xml'),
            ),
        );
        return listOfMetaViews.filter((doc) =>
            doc.children[0].attributes[4].nodeValue!.endsWith('RegisterView'),
        );
    });
};

export const getCardViews = async () => {
    return await getSchema().then((result) => {
        if (!result) return [];

        const xmlMetaViewList = result.MetaViews;
        const xmlParser = new DOMParser();
        const listOfMetaViews: Document[] = [];

        xmlMetaViewList.map((metaView: DtoView) =>
            listOfMetaViews.push(
                xmlParser.parseFromString(metaView.XML, 'text/xml'),
            ),
        );
        return listOfMetaViews.filter((doc) =>
            doc.children[0].attributes[4].nodeValue!.endsWith('CardView'),
        );
    });
};

export const getRegisterViewsFromSchema = (schema?: DtoSchema) => {
    if (!schema) return [];

    const xmlParser = new DOMParser();
    const listOfMetaViews: Document[] = [];

    schema.MetaViews?.map((metaView: DtoView) => {
        listOfMetaViews.push(
            xmlParser.parseFromString(metaView.XML, 'text/xml'),
        );
    });

    return listOfMetaViews.filter((doc) => {
        return doc?.firstElementChild
            ?.getAttribute('Name')
            ?.endsWith('RegisterView');
    });
};

export const getViewFromSchemaByName = (schema: DtoSchema, name: string) => {
    const xmlParser = new DOMParser();
    const listOfMetaViews: Document[] = [];

    schema.MetaViews?.map((metaView: DtoView) => {
        listOfMetaViews.push(
            xmlParser.parseFromString(metaView.XML, 'text/xml'),
        );
    });

    return listOfMetaViews.find((view) => {
        return view?.documentElement.getAttribute('Name') === name;
    });
};

export const parseRegisterMetaView = (view: Element) => {
    const columns: string[] = [];
    const bindings: string[] = [];

    const getColumnHeader = (element: Element): string => {
        return (
            element.getAttribute('ColumnHeader')! ||
            element.getAttribute('Caption')!
        );
    };

    const captionOverrides: string[] = [];

    const getColumnsRecursively = (element: Element) => {
        if (!element) return;

        let captionAdded = false;
        if (element.tagName === 'Group') {
            captionOverrides.push(getColumnHeader(element));
            captionAdded = true;
        }

        const captionOverride =
            captionOverrides.length > 0
                ? captionOverrides[captionOverrides.length - 1]
                : null;

        if (element.tagName === 'Button') {
            bindings.push(element.getAttribute('Text')!);
            columns.push(captionOverride ?? getColumnHeader(element));
        } else if (element.tagName === 'Element') {
            bindings.push(element.getAttribute('Value')!);
            columns.push(captionOverride ?? getColumnHeader(element));
        }

        for (const child of element.children) {
            getColumnsRecursively(child);
        }

        if (captionAdded) captionOverrides.pop();
    };

    if (view.getElementsByTagName('RegisterItem')) {
        getColumnsRecursively(
            view
                ?.getElementsByTagName('RegisterItem')[0]
                ?.getElementsByTagName('Content')[0],
        );
    }

    return { columns, bindings };
};

export const parseOrderOptions = (view: Element) => {
    const orderOptions = view.getElementsByTagName('OrderOptions')[0]?.children;

    if (orderOptions && orderOptions.length > 0)
        return orderOptions!.item(0)!.getAttribute('OrderingName');

    return null;
};

type TreeNode = {
    name: string;
    children?: TreeNode[];
    attributes?: { [index: string]: any };
};

const parseXmlToJsonRecursively = (cardviewXML: Element): TreeNode => {
    const node: TreeNode = { name: cardviewXML.nodeName };
    const attributes = cardviewXML.attributes;
    if (attributes && attributes.length > 0) {
        node.attributes = {};

        Array.from(attributes).forEach((att) => {
            node.attributes![att.nodeName] = att.nodeValue!;
        });
    }
    if (cardviewXML.hasChildNodes()) {
        node.children = [];
        for (let i = 0; i < cardviewXML.childNodes.length; i++) {
            const childNode = cardviewXML.childNodes[i];
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                node.children.push(
                    parseXmlToJsonRecursively(childNode as Element),
                );
            }
        }
    }
    return node;
};

export const parseCardMetaView = (document: Element): DynamicObject => {
    const contentElements = document.getElementsByTagName('Content');
    return parseXmlToJsonRecursively(contentElements[0]);
};
