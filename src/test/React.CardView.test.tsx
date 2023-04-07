import { render, screen, fireEvent } from '@testing-library/react';
import { CardView } from '../components/View/CardView';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import json from '../temp/schema.json';
import { DtoSchema } from '../types/DtoSchema';
import { getViewFromSchemaByName } from '../utils/Parser';
import cardJson from '../temp/card.json';
import { DynamicObject } from '../types/DynamicObject';

// Mock the store with the static schema.json
const mockSchema = json as unknown as DtoSchema;

const mockCard = cardJson as unknown as {
    ViewModelType: string;
    ViewModelData: DynamicObject;
};

jest.mock('../store/store', () =>
    jest.fn(() => {
        return mockSchema;
    }),
);

jest.mock('../services/backend', () => ({
    getViewModelData: jest.fn(() => {
        console.log(mockCard);
        return mockCard;
    })
}));

const MockCardView = () => {
    const entity = getViewFromSchemaByName(mockSchema, 'PatientRegisterView');
    return (
        <BrowserRouter>
            <CardView view={entity!.documentElement}/>
        </BrowserRouter>
    );
};

describe('Register Patient CardView', () => {
    it('should render the view', () => {
        render(<MockCardView />);
    });
});
