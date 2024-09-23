import { getGrossWeightUnit } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetGrossWeightUnit = () => {
  return useQuery({
    queryKey: ["gross-unit"],
    queryFn: () => getGrossWeightUnit(),
  });
};

export default useGetGrossWeightUnit;
