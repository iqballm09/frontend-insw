import { getBlType } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetBlType = () => {
  return useQuery({
    queryKey: ["blType"],
    queryFn: () => getBlType(),
  });
};

export default useGetBlType;
