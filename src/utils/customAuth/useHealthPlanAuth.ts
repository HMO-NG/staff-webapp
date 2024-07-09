import {
    createHealthPlanService,
    ViewBenefits,
    createBenefits,
    getAllHealthPlanCategoryService,
    ViewHealthPlanCategoryService,
    ViewHealthPlanService,
    createHealthPlanCategoryService,
    GetSingleHealthPlanCategoryService,
    GetAllBenefitListService
} from "@/services/HealthPlanService"

type Status = 'success' | 'failed'

export type PlanCategory = {
    value: string,
    label: string,

}

export type healthPlan = {
    // value as id
    value: string,
    // label as plan_name
    label: string,
    plan_type: string,
    allow_dependent: boolean,
    max_dependant: string,
    plan_age_limit: string,
    plan_cost: string,
    created_at: string,
    health_plan_category_name: string,
    health_plan_category_code: string,
    health_plan_category_band: string,
    user_id: string,
    entered_by: string
}

export type benefitList = {
    // id as value
    value: string,
    category: string,
    sub_category: string
    // benefit_name as label
    label: string
}

function useHealthPlan() {

    const useCreateHealthPlanAuth = async (data: any): Promise<{
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

    const useCreateHealthPlanCategoryAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status
    }> => {
        try {
            const response = await createHealthPlanCategoryService(data)

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
    const useGetHealthPlanAuth = async (data: any): Promise<{
        message: string,
        data?: healthPlan[],
        status: Status
    }> => {
        try {
            const response = await ViewHealthPlanService(data)

            return {
                message: response.data.message,
                data: response.data.data.map((i: any) => {
                    return {
                        label: i.plan_name,
                        value: i.id,
                        plan_type: i.plan_type,
                        allow_dependent: i.allow_dependent,
                        max_dependant: i.max_dependant,
                        plan_age_limit: i.plan_age_limit,
                        plan_cost: i.plan_cost,
                        created_at: i.created_at,
                        health_plan_category_name: i.health_plan_category_name,
                        health_plan_category_code: i.health_plan_category_code,
                        health_plan_category_band: i.health_plan_category_band,
                        user_id: i.user_id,
                        entered_by: i.entered_by
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
                response = await Promise.all(batch.map((item: any) => createBenefits(item)));
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

    const useGetSingleHealthPlanCategoryAuth = async (id: any): Promise<{
        message: string,
        data?: any,
        status: Status
    }> => {

        try {

            const response = await GetSingleHealthPlanCategoryService(id);
            return {
                message: response.data.message,
                data: response.data.data,
                status: 'success'

            }
        }
        catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }
        }

    }

    const useGetAllBenefitListAuth = async (): Promise<{
        message: string,
        data?: benefitList[],
        status: Status
    }> => {

        try {

            const response = await GetAllBenefitListService();
            return {
                message: response.data.message,
                data: response.data.data.map((items: any) => {
                    return {
                        // id as value
                        value: items.id,
                        category: items.category,
                        sub_category: items.sub_category,
                        // benefit_name as label
                        label: items.benefit_name
                    }
                }),
                status: 'success'

            }
        }
        catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
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
        useViewHealthPlanAuth,
        useCreateHealthPlanCategoryAuth,
        useGetSingleHealthPlanCategoryAuth,
        useGetHealthPlanAuth,
        useGetAllBenefitListAuth
    }
}

export default useHealthPlan