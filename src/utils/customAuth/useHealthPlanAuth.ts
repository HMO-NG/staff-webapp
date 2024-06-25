import { createHealthPlanService } from "@/services/HealthPlanService"

function useHealthPlan() {

    const useCreateHealthPlan = async (data: any): Promise<{
        message: string
        data: any,
    }> => {
        try {
            const response = await createHealthPlanService(data)

            return response.data;

        } catch (error: any) {

            return error

        }
    }

    return {
        useCreateHealthPlan
    }
}

export default useHealthPlan