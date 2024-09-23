import { getCargoVinDetail } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetCargoVinDetail = (id: number) => {
    return useQuery({
        queryKey: ["get-cargovin-detail", id],
        queryFn: () => getCargoVinDetail(id)
    })
}

export default useGetCargoVinDetail;