import {useQuery} from "@tanstack/react-query";

export const OrganizationName = () => {
  const {isLoading, error, data, isFetching} = useQuery({
    queryKey: ["organizationName"],
    queryFn: async () => {
      return await fetch("https://appointment-beta.assiscare.com:28090/api/feature_sweproject/organization")
        .then(res => res.json())
        .then((dt) => dt)
    }
  })

  return (
    <div className="card">
      <p>
        {isLoading ? "Loading..." : data?.OrganizationName}
      </p>
    </div>
  )
}
