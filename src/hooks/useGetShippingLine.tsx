import { getShippingLine, getShippingLineAll } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetShippingLine = (keyword: string) => {
  return useQuery({
    queryKey: ["shippingLine"],
    queryFn: () => getShippingLine(keyword),
    enabled: !!keyword,
    refetchOnWindowFocus: true, // Refetch data when window regains focus
    refetchOnMount: true,
  });
};


export default useGetShippingLine;
