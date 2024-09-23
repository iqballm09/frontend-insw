import { getBank, getTerminalOperator } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useGetTerminalOperator = () => {
  return useQuery({
    queryKey: ["terminal-operator"],
    queryFn: getTerminalOperator,
  });
};

export default useGetTerminalOperator;
