import { createProvider } from "@/services/ProviderService";

function useProvider() {

    const useCreateProvider = async (data: any): Promise<{
        data:string,
        message:string
    }> => {
        try {
            const response = await createProvider(data)

            return response.data

        } catch (error:any) {

            return error

        }
    }

    return {
        useCreateProvider
    }
}

export default useProvider