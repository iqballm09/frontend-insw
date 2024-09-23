import { getRequestPartiesDetail } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"

const useGetPartiesDetail = (id: number) => {
    return useQuery({
        queryKey: ["get-parties-detail", id],
        queryFn: () => getRequestPartiesDetail(id)
    })
}

export default useGetPartiesDetail;