import {
    createProvider,
    getProviderByID,
    getAllProvider,
    editProviderByID,
    updateProviderActivationStatus,
    createNHIAProviderService,
    searchNHIAProviderByHCPIDService,
    CreateProviderTariffService,
    getProviderTariffByIdfService,
    getAllProviderTariffService,
    getSingleProviderTariffByIdService,
    CreatePreAuthorization,
    getAllpreauthorizationRequestService,
    getSinglePreAuthorizationByIdService,
    UpdatePreAuthorizationService,
    getPreAuthorizationByPACodeService,
    updatePreAuthorizationByPACodeService,
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
export type ProviderServiceTariffType={
  id:string,
  item_name:string,
  item_price:string,
  provider_id:string,
  linked_plans:{
    id: string,
    plan_name: string
  }[],
  available_to_all_plans:boolean,
  tariff_type:string,
  hcpcs_code:string,
  is_surgical:string,
  patient_type:string,
  category:string,
  service_type:'primary'|'secondary'|'tertiary',
  created_by:string
}
export type ProviderDrugTariffType={
  id:string,
  item_name:string,
  item_price:string,
  provider_id:string,
  insurance_plan_type:string,
  formulation:string,
  unit_of_measure:string,
  category:string,
  strength:string,
  created_by:string
}
export type PAType={
        id: string,
        diagnosis: string,
        selected_tariffs: [{}]
        approved_price: string,
        requested_total_price: string,
        provider_comment: string,
        pa_code: string,
        status: "pending"|'approved'| 'denied'|'partially approved',
        is_claimed:boolean,
        created_at: string,
        created_by: string,
        enrollee: {
            id: string,
            name: string,
            plan_name: string
        },
        provider: {
            id:string,
            name: string,
            code: string
        }
}

export const defaultPAType: PAType = {
             id: '',
             diagnosis: '',
             selected_tariffs: [{}],
             approved_price: '',
             requested_total_price: '',
             provider_comment: '',
             pa_code: '',
             status: 'pending',
             is_claimed: false,
             created_at: '',
             created_by: '',

             enrollee: {
               id: '',
               name: '',
               plan_name: '',
             },

             provider: {
               id: '',
               name: '',
               code: '',
             },
};

function useProvider() {

    const useCreateProvider = async (data: any): Promise<{
        data?: any,
        message: string,
        status: Status
    }> => {
        try {
            const response = await createProvider(data)

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
            const response = await searchNHIAProviderByHCPIDService({"query":data,"sort":{"order":"asc","key":""}})

            return {
                data: response.data.data.map((i: any) => {
                    return {
                        label: i.name,
                        value: i.id,
                        hcp_id: i.code,
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

    const useCreateProviderServiceTariffAuth = async (data: any): Promise<{
      data?: any,
      message: string,
      status: Status
  }> => {
      try {
          const response = await CreateProviderTariffService(data)

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

        const usegetProviderServiceTariffByIdAuth = async (id:string): Promise<{
          message: string,
          data?: ProviderServiceTariffType[],
          count?:number
          status: Status
      }> => {

          try {

              const response = await getProviderTariffByIdfService(id);
              return {
                  message: response.data.message,
                  data:response.data.data,
                  count:response.data.count,
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

      const usegetAllProviderServiceTariffAuth = async (): Promise<{
        message: string,
        data?: ProviderServiceTariffType[],
        status: Status
    }> => {

        try {

            const response = await getAllProviderTariffService();
            return {
                message: response.data.message,
                data:response.data.data,
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

    const usegetSingleProviderServiceTariffByIdAuth = async (id:string): Promise<{
      message: string,
      data?: ProviderServiceTariffType,
      status: Status
  }> => {

      try {

          const response = await getSingleProviderTariffByIdService(id);
          return {
              message: response.data.message,
              data:response.data.data,
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




const useCreatePreAuthorizationAuth = async (data: any): Promise<{
  data?: any,
  message: string,
  status: Status
}> => {
  try {
      const response = await CreatePreAuthorization(data)

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

const usegetAllpreauthorizationRequestAuth = async (): Promise<{
  message: string,
  data?: PAType[],
  status: Status
}> => {

  try {

      const response = await getAllpreauthorizationRequestService();
      return {
          message: response.data.message,
          data:response.data.data,
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
const usegetSinglePreAuthorizationByIdAuth = async (id:string): Promise<{
  message: string,
  data?: PAType,
  status: Status
}> => {

  try {

      const response = await getSinglePreAuthorizationByIdService(id);
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

const useUpdatePreAuthorizationAuth = async (id:string,data: any): Promise<{
  data?: any,
  message: string,
  status: Status
}> => {
  try {
      const response = await UpdatePreAuthorizationService(id,data)

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

const usegetPreAuthorizationByPACodeAuth = async (PA_code:string): Promise<{
  message: string,
  data?: PAType,
  status: Status
}> => {

  try {
     const encoded_PA_code = encodeURIComponent(PA_code);

      const response = await getPreAuthorizationByPACodeService(encoded_PA_code);
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

const useUpdatePreAuthorizationByPA_codeAuth = async (PA_code:string,data: any): Promise<{
  data?: any,
  message: string,
  status: Status
}> => {
  try {
      const encoded_PA_code = encodeURIComponent(PA_code);
      const response = await updatePreAuthorizationByPACodeService(encoded_PA_code,data)

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


    return {
        useCreateProvider,
        useGetAllProvider,
        useGetProviderByID,
        useEditProviderById,
        useUpdateProviderActivationStatus,
        useCreateNHIAProviderAuth,
        useSearchNHIAProviderByHCPIDAuth,
        useCreateProviderServiceTariffAuth,
        usegetProviderServiceTariffByIdAuth,
        usegetAllProviderServiceTariffAuth,
        usegetSingleProviderServiceTariffByIdAuth,
        useCreatePreAuthorizationAuth,
        usegetAllpreauthorizationRequestAuth,
        usegetSinglePreAuthorizationByIdAuth,
        useUpdatePreAuthorizationAuth,
        usegetPreAuthorizationByPACodeAuth,
        useUpdatePreAuthorizationByPA_codeAuth,
    }
}
export default useProvider
