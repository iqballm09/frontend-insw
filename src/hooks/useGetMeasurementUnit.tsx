import { getMeasurementUnit } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetMeasurementUnit = () => {
  return useQuery({
    queryKey: ["measure-unit"],
    queryFn: () => getMeasurementUnit(),
  });
};

export default useGetMeasurementUnit;
