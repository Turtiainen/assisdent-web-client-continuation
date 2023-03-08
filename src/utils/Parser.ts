import { getSchema } from '../services/backend';
import { DtoView } from '../types/DtoView';
import { DtoSchema } from '../types/DtoSchema';

export const getRegisterViews = async () => {
    return await getSchema().then((result) => {
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

export const getRegisterViewsFromSchema = (schema: DtoSchema) => {
    const xmlParser = new DOMParser();
    const listOfMetaViews: Document[] = [];

    schema.MetaViews?.map((metaView: DtoView) => {
        listOfMetaViews.push(
            xmlParser.parseFromString(metaView.XML, 'text/xml'),
        );
    });

    return listOfMetaViews.filter((doc) => {
        return doc
            ?.getElementsByTagName('ViewDefinitionCoreBase')[0]
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

export const parseCardGroups = (document: Element) => {
    const groups: any = [];

    const parseElements = (document: Element) => {
        const elements: any[] = [];
        for (let i = 0; i < document.children.length; i++) {
            if (document.children[i].tagName === 'Group') {
                const group = parseElements(document.children[i]);
                group.map((element: Element) => elements.push(element));
            } else if (document.children[i].tagName === 'Element') {
                const element = {
                    Identifier: document.children[i].getAttribute('Identifier'),
                    Value: document.children[i].getAttribute('Value'),
                    Caption: document.children[i].getAttribute('Caption'),
                    IsEditable: document.children[i].getAttribute('IsEditable'),
                    IsMultiline:
                        document.children[i].getAttribute('IsMultiline'),
                };
                elements.push(element);
            }
        }
        return elements;
    };

    const constructGroup = (document: Element) => {
        const elements = parseElements(document);
        const groupElement = {
            Identifier: document.getAttribute('Identifier'),
            IsExpandable: document.getAttribute('IsExpandable'),
            IsCollapsed: document.getAttribute('IsCollapsed'),
            HideIfEmpty: document.getAttribute('HideIfEmpty'),
            Scale: document.getAttribute('Scale'),
            Spacing: document.getAttribute('Spacing'),
            MaxColumns: document.getAttribute('MaxColumns'),
            Elements: elements,
        };
        return groupElement;
    };

    for (let i = 0; i < document.children.length; i++) {
        const groupElement = constructGroup(document.children[i]);
        groups.push(groupElement);
    }
    return { groups };
};

export const parseCardMetaView = (document: Element): any => {
    const contentElements = document.getElementsByTagName('Content');
    return parseCardGroups(contentElements[0]).groups;
};
