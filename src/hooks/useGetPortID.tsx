import { getPort } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetPortID = () => {
    const kodeNegara = "ID"
    const keyword = ""
    return useQuery({
        queryKey: ["port-id"],
        queryFn: () => getPort({kodeNegara, keyword}),
        refetchOnWindowFocus: true, // Refetch data when window regains focus
        refetchOnMount: true,
    });
};

export default useGetPortID;