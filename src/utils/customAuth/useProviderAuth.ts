import { createProvider, getProviderByID, getAllProvider } from "@/services/ProviderService";

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
            console.log("Ddddd", response   )
            return response.data

        } catch (error: any) {
            return error
        }
    }

    return {
        useCreateProvider,
        useGetAllProvider,
        useGetProviderByID
    }
}

export default useProvider