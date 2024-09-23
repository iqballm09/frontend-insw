import { useAppState } from "@/provider/AppProvider";
import {
  createDoKontainer,
  updateDoKontainer,
  updateDoNonKontainer,
} from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const usePutDoNonKontainer = () => {
  const queryClient = useQueryClient();
  const context = useAppState();

  const router = useRouter();
  return useMutation({
    mutationFn: updateDoNonKontainer,
    mutationKey: ["update-do-non-kontainer"],
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
        router.push("/?con=2")
      }, 4000)
    },
  });
};

export default usePutDoNonKontainer;
