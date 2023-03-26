import { create } from 'zustand';

interface SchemaStore {
    schema:
        | {
              string: [];
          }
        | {};
}

const useSchemaStore = create<SchemaStore>()(() => ({
    schema: {},
}));

export default useSchemaStore;
