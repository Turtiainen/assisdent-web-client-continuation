import { create } from 'zustand';
import { DtoSchema } from '../types/DtoSchema';
import { SchemaStore } from '../types/SchemaStore';

const useSchemaStore = create<SchemaStore>()(() => ({
    schema: {} as DtoSchema,
}));

export default useSchemaStore;
