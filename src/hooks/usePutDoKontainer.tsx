import { useAppState } from "@/provider/AppProvider";
import { createDoKontainer, updateDoKontainer } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const usePutDoKontainer = () => {
  const queryClient = useQueryClient();
  const context = useAppState();
  const router = useRouter();
  return useMutation({
    mutationFn: updateDoKontainer,
    mutationKey: ["update-do-kontainer"],
    onError: (error) => {
      console.log({ error });
      toast.error("Failed Save DO Request");
    },
    onMutate: () => {
      toast.loading("Loading...");
    },
    onSuccess() {
      window.setTimeout(() => {
        toast.success("Succesfully Save DO Request");

        queryClient.invalidateQueries({
          queryKey: ["list-do"],
        });
        queryClient.invalidateQueries({
          queryKey: ["do", context.containerIdActive],
        });
        router.push("/")
      }, 4000)
    },
  });
};

export default usePutDoKontainer;
