import {
    sessionChecker,
} from "@/services/HealthCheckService"

type Status = 'success' | 'failed'

function useHealthCheck() {

    const useHealthCheckAuth = async (): Promise<{
        status: Status,
        message: string,
    } | undefined> => {
        try {

            const response = await sessionChecker()

            return {
                status: 'success',
                message: response.data.message,
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }

        }
    }
    return {
        useHealthCheckAuth
    }
}

export default useHealthCheck