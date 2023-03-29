import { create } from 'zustand';
import { DtoSchema } from '../types/DtoSchema';

interface SchemaStore {
    schema: DtoSchema;
}

const useSchemaStore = create<SchemaStore>()(() => ({
    schema: {} as DtoSchema,
}));

export default useSchemaStore;
