import { getData } from '../services/backend';

type MetaView = {
    XML: string;
};

const parseCardGroups = (document: Document): any => {
    const groups: any[] = [];
    const groupElements = document.getElementsByTagName('Group');
    for (let i = 0; i < groupElements.length; i++) {
        const groupElement = groupElements[i];
        const group: any = {
            identifier: groupElement.getAttribute('Identifier'),
            hideIfEmpty: groupElement.getAttribute('HideIfEmpty') === 'true',
            elements: [],
        };
        const elementElements = groupElement.getElementsByTagName('Element');
        for (let j = 0; j < elementElements.length; j++) {
            const elementElement = elementElements[j];
            const element: any = {
                identifier: elementElement.getAttribute('Identifier'),
                value: elementElement.getAttribute('Value'),
                caption: elementElement.getAttribute('Caption'),
                isEditable:
                    elementElement.getAttribute('IsEditable') === 'true',
                isMultiline:
                    elementElement.getAttribute('IsMultiline') === 'true',
            };
            group.elements.push(element);
        }
        groups.push(group);
    }
    return { groups };
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
        return parseCardGroups(filteredViews[0]);
    });
};
