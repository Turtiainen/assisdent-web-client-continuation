import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CardView } from '../components/View/CardView';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import json from '../temp/schema.json';
import { DtoSchema } from '../types/DtoSchema';
import { getViewFromSchemaByName } from '../utils/Parser';
import cardJson from '../temp/card.json';
import { DynamicObject } from '../types/DynamicObject';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Mock the store with the static schema.json
const mockSchema = json as unknown as DtoSchema & {
    getState: () => { schema: object };
};

mockSchema.getState = function () {
    return {
        schema: json,
    };
};

const mockCard = cardJson as unknown as {
    ViewModelType: string;
    ViewModelData: DynamicObject;
};

jest.mock('../store/store', () => {
    return {
        ...mockSchema,
        getState: jest.fn(() => {
            return {
                schema: mockSchema,
            };
        }),
    };
});

jest.mock('../services/backend', () => ({
    getViewModelData: jest.fn(() => {
        return mockCard;
    }),
}));

const MockCardView = () => {
    const entity = getViewFromSchemaByName(mockSchema, 'PatientCardView');
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <CardView view={entity!.documentElement} />
            </BrowserRouter>
        </QueryClientProvider>
    );
};

// Prevent polluting stdout
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
    jest.spyOn(console, 'log').mockImplementation(() => jest.fn());
});

describe('Register Patient CardView header', () => {
    it('should render the header with a full name', async () => {
        render(<MockCardView />);
        await waitFor(() => {
            expect(
                screen.getAllByText(/Poutiaisentytär Kaisa Esmeralda/)[0],
            ).toBeInTheDocument();
        });
    });

    it('should render the header subtitle with an SNN', async () => {
        render(<MockCardView />);
        await waitFor(() => {
            expect(
                screen.getByText(/241187-900U #97099284/),
            ).toBeInTheDocument();
        });
    });
});

describe('Register Patient CardView content', () => {
    it('should render input labels', async () => {
        render(<MockCardView />);
        await waitFor(() => {
            expect(screen.getByText(/Sukunimi/)).toBeInTheDocument();
        });
    });

    it('should render sub headings', async () => {
        render(<MockCardView />);
        await waitFor(() => {
            expect(screen.getByText(/Yhteystiedot/)).toBeInTheDocument();
        });
    });
});
