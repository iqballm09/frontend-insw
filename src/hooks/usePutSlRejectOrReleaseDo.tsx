import { slUpdateDo } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const usePutSlRejectOrReleaseDo = (id: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: slUpdateDo,
    onError: (error) => {
      console.log({ error });
      toast.error("Failed Update DO Request");
    },
    onMutate: () => {
      toast.loading("Loading...");
    },
    onSuccess({ data }) {
      window.setTimeout(() => {
        toast.success(`Successfull ${data.name} DO Request!`);

        queryClient.invalidateQueries({
          queryKey: ["list-do"],
        });
        queryClient.invalidateQueries({
          queryKey: ["do", id],
        });
        router.push('/')
      }, 4000)
    },
  });
};

export default usePutSlRejectOrReleaseDo;
