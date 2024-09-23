import { getCurrency } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetCurrency = () => {
  return useQuery({
    queryKey: ["currency"],
    queryFn: () => getCurrency(),
  });
};

export default useGetCurrency;
