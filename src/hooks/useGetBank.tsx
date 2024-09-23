import { getBank } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetBank = () => {
  return useQuery({
    queryKey: ["bank"],
    queryFn: () => getBank(),
  });
};

export default useGetBank;
