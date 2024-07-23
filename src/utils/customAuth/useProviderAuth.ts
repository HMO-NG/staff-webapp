import {
    createProvider,
    getProviderByID,
    getAllProvider,
    editProviderByID,
    updateProviderActivationStatus,
    createNHIAProviderService,
    searchNHIAProviderByHCPIDService
} from "@/services/ProviderService";
import { string } from "yup";

type Status = 'success' | 'failed'

export type NHIAProviderType = {
    // value as id
    value: string,
    // label as name
    label: string,
    hcp_id: string,
    is_active: string,
    created_by: string
}

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

    const useUpdateProviderActivationStatus = async (id: string, data: any): Promise<{ message: string }> => {
        try {
            const result = await updateProviderActivationStatus(id, data)
            return result.data
        } catch (error: any) {
            return error
        }
    }

    // ---NHIA PROVIDER ---
    const useCreateNHIAProviderAuth = async (data: any): Promise<{
        data?: string,
        message: string,
        status: Status
    }> => {
        try {
            const response = await createNHIAProviderService(data)

            return {
                data: response.data.data,
                message: response.data.message,
                status: 'success'
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }

        }
    }

    const useSearchNHIAProviderByHCPIDAuth = async (data: any): Promise<{
        data?: NHIAProviderType[],
        message: string,
        status: Status
    }> => {
        try {
            const response = await searchNHIAProviderByHCPIDService({"hcpId":data})

            return {
                data: response.data.data.map((i: any) => {
                    return {
                        label: i.name,
                        value: i.id,
                        hcp_id: i.hcp_id,
                        is_active: i.is_active,
                        created_by: i.created_by
                    }
                }),
                message: response.data.message,
                status: 'success'
            }

        } catch (error: any) {

            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }

        }
    }

    return {
        useCreateProvider,
        useGetAllProvider,
        useGetProviderByID,
        useEditProviderById,
        useUpdateProviderActivationStatus,
        useCreateNHIAProviderAuth,
        useSearchNHIAProviderByHCPIDAuth
    }
}
export default useProvider