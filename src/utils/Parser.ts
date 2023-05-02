import { DtoView } from '../types/DtoView';
import { DtoSchema } from '../types/DtoSchema';
import { DynamicObject } from '../types/DynamicObject';
import {
    OrderBy,
    OrderOptionNameObject,
} from '../types/ViewTypes/OrderOptions';
import { DtoEntity } from '../types/DtoEntity';
import { getMetaViews } from '../temp/SchemaUtils';

export const getCardViews = async () => {
    const xmlMetaViewList = getMetaViews();
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

const getColumnHeader = (element: Element): string => {
    return (
        element.getAttribute('ColumnHeader')! ||
        element.getAttribute('Caption')!
    );
};

const pushBindingsAndColumns = (
    element: Element,
    bindings: Array<Array<string>>,
    columns: string[],
    captionOverride: string | null,
    getAttributeBy: string,
) => {
    if (
        columns.length === 0 ||
        (captionOverride ?? getColumnHeader(element)) !==
            columns[columns.length - 1]
    ) {
        bindings.push([element.getAttribute(getAttributeBy)!]);
        columns.push(captionOverride ?? getColumnHeader(element));
    } else {
        bindings[bindings.length - 1].push(
            element.getAttribute(getAttributeBy)!,
        );
    }
};

export const parseRegisterMetaView = (view: Element) => {
    const columns: string[] = [];
    const bindings: string[][] = [];

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
            pushBindingsAndColumns(
                element,
                bindings,
                columns,
                captionOverride,
                'Text',
            );
        } else if (element.tagName === 'Element') {
            pushBindingsAndColumns(
                element,
                bindings,
                columns,
                captionOverride,
                'Value',
            );
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

// Split OrderName attribute into an array, if the string has commas in it
// e.g. OrderName="ordering1,..,orderingN"
const orderNameToObjectArray = (
    OrderName: string,
    SchemaOrderOptions: DynamicObject,
    IsDescending: boolean,
) => {
    let result: OrderOptionNameObject[] = [];
    if (OrderName.includes(',')) {
        let tempArr = OrderName.split(',');
        tempArr.forEach((opt) => {
            const name: string = SchemaOrderOptions[opt]?.Name || opt;
            result.push({ OrderOptionName: name, IsDescending });
        });
    } else {
        const name = SchemaOrderOptions[OrderName]?.Name || OrderName;
        result.push({ OrderOptionName: name, IsDescending });
    }
    return result;
};

export const parseOrderOptions = (
    OrderOptionsEl: Element,
    SchemaEntity: DtoEntity,
) => {
    if (!(OrderOptionsEl && OrderOptionsEl.hasChildNodes())) {
        return [];
    }

    const SchemaOrderOptions: DynamicObject = SchemaEntity.OrderOptions;
    const allOptions = OrderOptionsEl.children;
    const OrderOptions: OrderBy[] = [];

    // Create an array of different order options
    // Parse attributes from elements and push into the result array
    Array.from(allOptions).forEach((element) => {
        let OrderOption: DynamicObject = {};
        const ElementAttributeNames = element.getAttributeNames();

        // Get all OrderOption attributes and values
        for (const attr of ElementAttributeNames) {
            // use NS version of getAttribute because regular one lowercases the attribute name
            const value = element.getAttributeNS(null, attr);
            if (value === null) continue;

            if (attr === 'IsDescending') {
                OrderOption[attr] = value === 'true';
            } else OrderOption[attr] = value;
        }

        // Handle the case of ordering by multiple columns
        // Split OrderingName into an array, if the string is in
        // the form of 'order1,..,orderN'
        if (OrderOption.OrderingName === undefined) {
            console.error(
                'Could not find OrderingName from view XML',
                OrderOption,
            );
            return [];
        }

        OrderOption.OrderOptionNames = orderNameToObjectArray(
            OrderOption.OrderingName,
            SchemaOrderOptions,
            OrderOption.IsDescending,
        );

        OrderOptions.push({
            Caption: OrderOption['Caption'],
            OrderBy: OrderOption,
        } as OrderBy);
    });

    return OrderOptions;
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
