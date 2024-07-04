import {
    createHealthPlanService,
    ViewBenefits,
    createBenefits,
    getAllHealthPlanCategoryService,
    ViewHealthPlanCategoryService,
    ViewHealthPlanService
} from "@/services/HealthPlanService"

type Status = 'success' | 'failed'

export type PlanCategory = {
    value: string,
    label: string,
}

function useHealthPlan() {

    const useCreateHealthPlanAuth = async (data:any): Promise<{
        message: string,
        data?: any,
        status: Status
    }> => {
        try {
            const response = await createHealthPlanService(data)

            return {
                message: response.data.message,
                data: response.data.data,
                status: "success"
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }

        }
    }

    const useGetHealthPlanCategoryAuth = async (): Promise<{
        message: string,
        data?: PlanCategory[],
        status: Status
    }> => {
        try {
            const response = await getAllHealthPlanCategoryService()

            return {
                message: response.data.message,
                data: response.data.data.map((i: { name: any; id: any }) => {
                    return {
                        label: i.name, value: i.id
                    }
                }),
                status: 'success'
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),

            }

        }
    }

    const useCreateBenefitAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status
    }> => {
        try {
            const response = await createBenefits(data)

            return {
                message: response.data.message,
                data: response.data.data,
                status: 'success'

            }


        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }
        }

    }

    const useViewBenefitAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status,
        total?: any
    }> => {
        try {
            const response = await ViewBenefits(data)

            return {
                message: response.data.message,
                data: response.data.data,
                status: 'success',
                total: response.data.total
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
                total: 0
            }
        }

    }

    const useViewHealthPlanCategoryAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status,
        total?: any
    }> => {
        try {
            const response = await ViewHealthPlanCategoryService(data)

            return {
                message: response.data.message,
                data: response.data.data,
                status: 'success',
                total: response.data.total
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
                total: 0
            }
        }

    }

    const useViewHealthPlanAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status,
        total?: any
    }> => {
        try {
            const response = await ViewHealthPlanService(data)

            return {
                message: response.data.message,
                data: response.data.data,
                status: 'success',
                total: response.data.total
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
                total: 0
            }
        }

    }

    const useBenefitBulkUploadAuth = async (data: any): Promise<{
        data?: any,
        status: Status
    }> => {

        const BATCH_SIZE = 10;
        let response;

        try {

            for (let i = 0; i < data.length; i += BATCH_SIZE) {
                const batch = data.slice(i, i + BATCH_SIZE);
                response = await Promise.all(batch.map(item => createBenefits(item)));
                console.log(`Processed batch ${i / BATCH_SIZE + 1}`);

            }
            return {
                data: response,
                status: 'success'

            }


        } catch (error: any) {

            return {
                status: 'failed',
                data: error?.response?.data?.message || error.toString(),
            }
        }

    }

    return {
        useCreateHealthPlanAuth,
        useCreateBenefitAuth,
        useViewBenefitAuth,
        useBenefitBulkUploadAuth,
        useGetHealthPlanCategoryAuth,
        useViewHealthPlanCategoryAuth,
        useViewHealthPlanAuth
    }
}

export default useHealthPlan