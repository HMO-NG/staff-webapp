import {
    createNhiaEnrolleeService,
    getAllAndSearchNhiaEnrolleeService
} from "@/services/EntrolleeService"

type Status = 'success' | 'failed'

function useEnrollee() {

    const useCreateNhiaEnrolleeAuth = async (data: any): Promise<{
        status: Status,
        message: string,
        data?: any,
    } | undefined> => {
        try {

            const response = await createNhiaEnrolleeService(data)

            return {
                status: 'success',
                message: response.data.message,
                data: response.data.data
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }

        }
    }

    const getAllAndSearchNhiaEnrolleeAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status
        total: any
    } | undefined> => {
        try {
            const response = await getAllAndSearchNhiaEnrolleeService(data)

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
    return {
        useCreateNhiaEnrolleeAuth,
        getAllAndSearchNhiaEnrolleeAuth,
    }

}

export default useEnrollee