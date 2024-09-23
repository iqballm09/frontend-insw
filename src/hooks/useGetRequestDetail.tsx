import { getRequestDetail } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"

const useGetRequestDetail = (id: number) => {
    return useQuery({
        queryKey: ["get-request-detail", id],
        queryFn: () => getRequestDetail(id)
    });
};

export default useGetRequestDetail;