import { deleteDo } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteDo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-do"],
    mutationFn: deleteDo,
    onMutate(variables) {
      toast.loading("Deleting...");
    },
    onError: () => {
      toast.error("Error when deleting");
    },
    onSuccess: () => {
      toast.success("Delete success");
      queryClient.invalidateQueries({
        queryKey: ["list-do"],
      });
    },
  });
};

export default useDeleteDo;
