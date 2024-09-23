import { useAppState } from "@/provider/AppProvider"
import { createContainerDetail, getContainerDetail } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { GitPullRequestCreateArrowIcon } from "lucide-react"
import { toast } from "sonner"

const usePostContainerDetail = () => {
    const queryClient = useQueryClient()
    const context = useAppState();
    return useMutation({
        mutationFn: createContainerDetail,
        mutationKey: ["create-container-detail"],
        onError: (error) => {
            console.log(error)
            toast.error("Failed Save Container Detail Data")
        },
        onMutate: () => {
            toast.loading("Loading...")
        },
        onSuccess: async (response) => {
            toast.success("Successfully Save Container Detail Data")

            queryClient.invalidateQueries({
                queryKey: ["get-container-detail", context.containerIdActive]
            });

            const updateData = await queryClient.fetchQuery({
                queryKey: ['get-container-detail', context.containerIdActive], 
                queryFn: () => getContainerDetail(context.containerIdActive)
            });

            if (updateData) {
                console.log("update data", updateData);
                context.setContainerItems(updateData.containerDetailForm.map((con: any) => ({
                    Id: String(con.Id),
                    containerNumber: con.containerNumber,
                    sealNumber: con.containerSeal,
                    sizeAndType: con.sizeType,
                    grossWeight: String(con.grossWeightAmount),
                    unit: con.grossWeightUnit,
                    ownership: String(con.ownership),
                    depoName: con.depoForm.nama,
                    depoNpwp: con.depoForm.npwp,
                    noTelp: con.depoForm.noTelp,
                    alamat: con.depoForm.alamat,
                    kotaDepo: con.depoForm.kota,
                    kodePos: con.depoForm.kodePos
                })))
            } else {
                toast.error("Failed to fetch updated container detail data!");
            }
        }
    })
}

export default usePostContainerDetail;