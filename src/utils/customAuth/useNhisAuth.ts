import {
    createNhiaServiceTarrifService,
    getAllAndSearchNhiaService,
    createNhiaDrugTarrifService,
    getAllAndSearchNhiaDrugTarrifService,
    createNhiaClaimService
} from "@/services/NhisService"
import { retry } from "@reduxjs/toolkit/dist/query"
import { ErrorMessage } from "formik"

type Status = 'success' | 'failed'

function useNhia() {

    const useCreateNhiaServiceTarrifAuth = async (data: any): Promise<{
        status: Status,
        message: string,
        data?: any,
    } | undefined> => {
        try {

            const response = await createNhiaServiceTarrifService(data)

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
    const useCreateNhiaServiceBulkUpload = async (data: any) => {

        const BATCH_SIZE = 100;
        try {

            if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i += BATCH_SIZE) {
                    const batch = data.slice(i, i + BATCH_SIZE);
                    try {
                        const k = await Promise.all(batch.map(item => createNhiaServiceTarrifService(item)));
                        console.log(k)
                        console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
                    } catch (error) {
                        console.error(`Error processing batch ${i / BATCH_SIZE + 1}:`, error);
                    }
                }
            } else {
                console.log("data is not any arrat")
            }

        } catch (error: any) {

            // return {
            //     status: 'failed',
            //     message: error?.response?.data?.message || error.toString(),
            // }

            console.log("error called in nhis service", error.toString())

        }
    }

    const getAllAndSearchNhiaServiceTarrifAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status
        total: any
    } | undefined> => {
        try {
            const response = await getAllAndSearchNhiaService(data)

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

    const useCreateNhiaDrugTarrifAuth = async (data: any): Promise<{
        status: Status,
        message: string,
        data?: any,
    } | undefined> => {
        try {

            const response = await createNhiaDrugTarrifService(data)

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

    const getAllAndSearchNhiaDrugTarrifAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status
        total: any
    } | undefined> => {
        try {
            const response = await getAllAndSearchNhiaDrugTarrifService(data)

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

    const useCreateNhiaClaimsAuth = async (data: any): Promise<{
        message: string,
        status: Status
    } | undefined> => {
        try {
            const response = await createNhiaClaimService(data)

            return {
                message: response.data.message,
                status: 'success'
            }
        } catch (error: any) {
            return {
                message: error?.response?.data?.message || error.toString(),
                status: 'failed'
            }
        }
    }
    return {
        useCreateNhiaServiceTarrifAuth,
        useCreateNhiaServiceBulkUpload,
        getAllAndSearchNhiaServiceTarrifAuth,
        useCreateNhiaDrugTarrifAuth,
        getAllAndSearchNhiaDrugTarrifAuth,
        useCreateNhiaClaimsAuth
    }

}

export default useNhia