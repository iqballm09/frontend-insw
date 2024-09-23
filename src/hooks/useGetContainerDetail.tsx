import { getRequestDetail } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetContainerDetail = (id: number) => {
    return useQuery({
        queryKey: ["get-container-detail", id],
        queryFn: () => getRequestDetail(id)
    })
}

export default useGetContainerDetail;