import {
    createNhiaServiceTarrifService,
    getAllAndSearchNhiaService,
    createNhiaDrugTarrifService,
    getAllAndSearchNhiaDrugTarrifService,
    createNhiaClaimService,
    getAllNhiaClaimService,
    getNhiaClaimByIDService,
    updateNhiaClaimByIDService,
} from "@/services/NhisService"
import { retry } from "@reduxjs/toolkit/dist/query"
import { ErrorMessage } from "formik"

type Status = 'success' | 'failed'

export type NHIAClaimType = {
            id: string,
            nhia_enrollee_name:string,
            nhia_enrollee_id: string,
            referring_hcf: string,
            recieving_hcf: string,
            referral_code: string,
            approval_date: string,
            date_hmo_recieved_claim: string,
            diagnosis: string,
            items:any[],
            status: 'pending' | 'approved' | 'denied' | 'partially approved';
            requested_amount: number;
            approved_amount: number;
            comment: string | null;
            created_by: string,
            created_at:string
          }
export const defaultNhiaClaim: NHIAClaimType = {
             id: '',
             nhia_enrollee_name: '',
             nhia_enrollee_id: '',
             referring_hcf: '',
             recieving_hcf: '',
             referral_code: '',
             approval_date: '',
             date_hmo_recieved_claim: '',
             diagnosis: '',
             items: [[]],
             requested_amount: 0,
             approved_amount: 0,
             comment: null,
             status: 'pending',
             created_by: '',
             created_at: ''
            }
export type tariffType={
  id:string
  drug_name?: string,
  service_name?: string,
  status:"pending" | "approved" | "denied"
  comment: string | null,
  amt_claimed: number, //amount from provider
  quantity: number,
  approved_quantity?:number
  price: number //original price
  approved_price:number
  approved_total:number
  percentage?: number //percentage of the drug price
  total_price?:number// total price multiplied by quantity (for drugs after discount)
}
export const defaultService: tariffType = {
  id: '',
  service_name: '',
  price: 0,
  status: 'pending',
  comment: null,
  amt_claimed: 0,
  quantity: 0,

  approved_quantity: 0,
  approved_price: 0,
  approved_total: 0,
  total_price: 0,
};
export const defaultDrug: tariffType = {
  id: '',
  drug_name: '',
  price: 0,
  status: 'pending',
  comment: null,
  amt_claimed: 0,
  quantity: 0,

  approved_quantity: 0,
  approved_price: 0,
  approved_total: 0,
  percentage: 0,
  total_price: 0,
};
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

    const getAllNhiaClaimAuth = async (): Promise<{
        message: string,
        data?: NHIAClaimType[],
        total?: number,
        status: Status
    }> => {
        try {
            const response = await getAllNhiaClaimService()

            return {
                message: response.data.message,
                data: response.data.data,
                total: response.data.total,
                status: 'success',
            }
        } catch (error: any) {
            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }
        }
    }

   const getNhiaClaimByIdAuth = async (id:string): Promise<{
        message: string,
        data?: NHIAClaimType,
        total?: number,
        status: Status
    }> => {
        try {
            const response = await getNhiaClaimByIDService(id)

            return {
                message: response.data.message,
                data: response.data.data,
                status: 'success',
            }
        } catch (error: any) {
            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }
        }
    }

    const useupdateNhiaClaimByIdAuth = async (id: string,data:any): Promise<{
        status: Status,
        message: string,
        data?: any,
    } | undefined> => {
        try {

            const response = await updateNhiaClaimByIDService(id,data)

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
        useCreateNhiaServiceTarrifAuth,
        useCreateNhiaServiceBulkUpload,
        getAllAndSearchNhiaServiceTarrifAuth,
        useCreateNhiaDrugTarrifAuth,
        getAllAndSearchNhiaDrugTarrifAuth,
        useCreateNhiaClaimsAuth,
        getAllNhiaClaimAuth,
        getNhiaClaimByIdAuth,
        useupdateNhiaClaimByIdAuth,
    }

}

export default useNhia
