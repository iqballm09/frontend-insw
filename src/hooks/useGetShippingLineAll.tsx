import { getShippingLine, getShippingLineAll } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetShippingLineAll = () => {
  return useQuery({
    queryKey: ["shippingLineAll"],
    queryFn: () => getShippingLineAll(),
    refetchOnWindowFocus: true, // Refetch data when window regains focus
    refetchOnMount: true,
  });
};;

export default useGetShippingLineAll;
