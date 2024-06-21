import {
    createProvider,
    getProviderByID,
    getAllProvider,
    editProviderByID
} from "@/services/ProviderService";

function useProvider() {

    const useCreateProvider = async (data: any): Promise<{
        data: string,
        message: string
    }> => {
        try {
            const response = await createProvider(data)

            return response.data

        } catch (error: any) {

            return error

        }
    }

    const useGetAllProvider = async (data: any): Promise<{
        message: string,
        data: [],
        total: any
    }> => {
        try {
            const response = await getAllProvider(data)

            return { message: response.data.message, data: response.data.data, total: response.data.total }

        } catch (error: any) {
            return error
        }
    }

    const useGetProviderByID = async (data: any): Promise<{
        message: string,
        data: any,
    }> => {
        try {

            const response = await getProviderByID(data)
            return response.data

        } catch (error: any) {
            return error
        }
    }

    const useEditProviderById = async (data: any): Promise<{ message: string }> => {
        try {
            const result = await editProviderByID(data)

            return result.data
        } catch (error: any) {
            return error
        }
    }

    return {
        useCreateProvider,
        useGetAllProvider,
        useGetProviderByID,
        useEditProviderById
    }
}

export default useProvider