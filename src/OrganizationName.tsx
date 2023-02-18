import { useQuery } from '@tanstack/react-query';
import { getOrganizationName } from './services/backend';

export const OrganizationName = () => {
    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ['organizationName'],
        queryFn: async () => {
            return await getOrganizationName();
        },
    });

    return (
        <div className="card">
            <p>Hello, {import.meta.env.VITE_ASSISCARE_USER}!</p>
            <p>{isLoading ? 'Loading...' : data?.OrganizationName}</p>
            <p>
                {error
                    ? 'Failed to fetch the resource. Is VITE_ASSISCARE_BASE set up correctly?'
                    : ''}
            </p>
        </div>
    );
};
