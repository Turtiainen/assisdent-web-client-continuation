import { getSchema } from '../services/backend';
import useSchemaStore from '../store/store';

export const getSchemaToStore = () => {
    getSchema().then((res) => {
        useSchemaStore.setState({ schema: res });
        const data = useSchemaStore.getState()?.schema;
        console.log("Schema in store :>>", data);
    });
};
