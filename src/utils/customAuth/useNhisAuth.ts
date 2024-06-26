import { createNhiaService } from "@/services/NhisService"
import { ErrorMessage } from "formik"

type Status = 'success' | 'failed'

function useNhia() {

    const useCreateNhiaService = async (data: any): Promise<{
        status: Status,
        message: string,
        data?: any,
    } | undefined> => {
        try {
            const response = await createNhiaService(data)

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

    return {
        useCreateNhiaService
    }
}

export default useNhia