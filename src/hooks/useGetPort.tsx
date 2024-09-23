import { getPort } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetPort = (kodeNegara: string) => {
  const keyword = ""
  return useQuery({
    queryKey: ["port"],
    queryFn: () => getPort({kodeNegara, keyword}),
    refetchOnWindowFocus: true, // Refetch data when window regains focus
    refetchOnMount: true,
  });
};

export default useGetPort;