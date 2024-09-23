import { useAppState } from "@/provider/AppProvider";
import { createDoKontainer, setToken, signUp } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const usePostSignUp = (token: string) => {
  const router = useRouter();
  return useMutation({
    mutationFn: signUp,
    mutationKey: ["sign-up"],
    onError: (error) => {
      console.log({ error });
      toast.error("Sign Up Error");
    },
    onMutate: () => {
      toast.loading("Loading...");
    },
    onSuccess(data) {
      toast.success("Sign Up Success");
      console.log({ data });

      router.push("api/auth/signin?token=" + token);
    },
  });
};

export default usePostSignUp;
