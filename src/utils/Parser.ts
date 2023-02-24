import { getData } from '../services/backend';

type MetaView = {
    XML: string;
};

export const parseCardGroups = (document: Document | Element): any => {
    const groups: any[] = [];

    const parseElements = (document: Document | Element): any => {
        const elements: any[] = [];
        for (let i = 0; i < document.children.length; i++) {
            if (document.children[i].tagName === 'Group') {
                const group = parseElements(document.children[i]);
                group.map((element: any) => elements.push(element));
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

    const constructGroup = (document: Document | Element): any => {
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

const parseCardContent = (document: Document | Element): any => {
    const contentElements = document.getElementsByTagName('Content');
    return parseCardGroups(contentElements[0]).groups;
};

export const getRegisterViews = async () => {
    return await getData().then((result) => {
        const xmlMetaViewList = result.MetaViews;
        const xmlParser = new DOMParser();
        const listOfMetaViews: Document[] = [];

        xmlMetaViewList.map((metaView: MetaView) =>
            listOfMetaViews.push(
                xmlParser.parseFromString(metaView.XML, 'text/xml'),
            ),
        );
        return listOfMetaViews.filter((doc) =>
            doc.children[0].attributes[4].nodeValue!.endsWith('RegisterView'),
        );
    });
};

export const getCardView = async (entity: string) => {
    return await getData().then((result) => {
        const xmlMetaViewList = result.MetaViews;
        const xmlParser = new DOMParser();
        const listOfMetaViews: Document[] = [];
        xmlMetaViewList.map((metaView: MetaView) =>
            listOfMetaViews.push(
                xmlParser.parseFromString(metaView.XML, 'text/xml'),
            ),
        );
        const filteredViews = listOfMetaViews.filter((doc) =>
            doc.children[0].attributes[4].nodeValue!.endsWith(
                `${entity}CardView`,
            ),
        );
        const parsedCardView = [];
        parsedCardView.push(parseCardContent(filteredViews[0]));
        return parsedCardView;
    });
};
