import '@testing-library/jest-dom';
import {
    sortByDocumentHeader,
    sortByDocumentName,
} from '../utils/sortingUtils';

const staticWordsInWrongOrder = [
    'Mansikka',
    'Mustikka',
    'Vadelma',
    'Puolukka',
    'Karpalo',
];
const staticWordsInOrder = [
    'Karpalo',
    'Mansikka',
    'Mustikka',
    'Puolukka',
    'Vadelma',
];

function getMockList(list: string[]) {
    const mockDocuments: Document[] = [];
    for (let i = 0; i < list.length; i++) {
        const doc = document.implementation.createHTMLDocument('Document');
        doc.documentElement.setAttribute('Name', list[i]);
        doc.documentElement.setAttribute('Header', list[i]);
        mockDocuments.push(doc);
    }
    return mockDocuments;
}

describe('Call sortByDocumentName', () => {
    it('should return an empty list given an empty list', () => {
        const sortedDocuments = [].sort(sortByDocumentName);
        expect(sortedDocuments).toEqual([]);
    });

    it('should return a list of Documents sorted by the name attribute', () => {
        const mockDocuments = getMockList(staticWordsInWrongOrder);
        const sortedDocuments = mockDocuments.sort(sortByDocumentName);
        expect(sortedDocuments).toEqual(getMockList(staticWordsInOrder));
    });
});

describe('Call sortByDocumentHeader', () => {
    it('should return an empty list given an empty list', () => {
        const sortedDocuments = [].sort(sortByDocumentHeader);
        expect(sortedDocuments).toEqual([]);
    });

    it('should return a list of Documents sorted by the header attribute', () => {
        const mockDocuments = getMockList(staticWordsInWrongOrder);
        const sortedDocuments = mockDocuments.sort(sortByDocumentHeader);
        expect(sortedDocuments).toEqual(getMockList(staticWordsInOrder));
    });
});
