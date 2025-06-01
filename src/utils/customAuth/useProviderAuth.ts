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
  insurance_plan_id:string,
  tariff_type:string,
  hcpcs_code:string,
  is_surgical:string,
  patient_type:string,
  category:string,
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
    pa_code:string,
    requested_total_price:string,
    approved_price:string,
    diagnosis: string,
    enrollee_id: string,
    enrolee_plan: string,
    enrolee_plan_name: string,
    enrollee_name: string,
    selected_tariffs: [{}],
    status: "pending"|'approved'| 'denied'|'partially approved',
    created_at: string,
    provider_name: string,
    provider_code: string,
    provider_comment:string,
    created_by: string
}
export type SelectedPAType={
        id: string,
        diagnosis: string,
        selected_tariffs: [{}]
        approved_price: string,
        requested_total_price: string,
        created_at: string,
        created_by: string,
        enrollee: {
            id: string,
            name: string
        },
        provider: {
            id:string,
            name: string,
            code: string
        }
}

export const defaultSelectedPAType: SelectedPAType = {
             id: '',
             diagnosis: '',
             selected_tariffs: [{}],
             approved_price: '',
             requested_total_price: '',
             created_at: '',
             created_by: '',

             enrollee: {
               id: '',
               name: '',
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
                  data: response.data.data.map((data: any) => {
                      return {
                        id:data.id,
                        item_name:data.item_name,
                        item_price:data.item_price,
                        provider_id:data.provider_id,
                        insurance_plan_id:data.insurance_plan_id,
                        tariff_type:data.tariff_type,
                        hcpcs_code:data.hcpcs_code,
                        is_surgical:data.is_surgical,
                        patient_type:data.patient_type,
                        category:data.category,
                        created_by:data.created_by

                      }
                  }),
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
                data: response.data.data.map((data: any) => {
                    return {
                      id:data.id,
                      item_name:data.item_name,
                      item_price:data.item_price,
                      provider_id:data.provider_id,
                      insurance_plan_id:data.insurance_plan_id,
                      tariff_type:data.tariff_type,
                      hcpcs_code:data.hcpcs_code,
                      is_surgical:data.is_surgical,
                      patient_type:data.patient_type,
                      category:data.category,
                      created_by:data.created_by

                    }
                }),
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
              data: response.data.data.map((data: any) => {
                  return {
                    id:data.id,
                    item_name:data.item_name,
                    item_price:data.item_price,
                    provider_id:data.provider_id,
                    insurance_plan_id:data.insurance_plan_id,
                    tariff_type:data.tariff_type,
                    hcpcs_code:data.hcpcs_code,
                    is_surgical:data.is_surgical,
                    patient_type:data.patient_type,
                    category:data.category,
                    created_by:data.created_by

                  }
              }),
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
          data: response.data.data.map((data: any) => {
              return {
                id: data.id,
                pa_code:data.pa_code,
                approved_price:data.approved_price,
                requested_total_price:data.requested_total_price,
                diagnosis: data.diagnosis,
                enrollee_id: data.enrollee_id,
                enrolee_plan: data.enrolee_plan,
                enrolee_plan_name: data.enrolee_plan_name,
                enrollee_name: data.enrollee_name,
                selected_tariffs:data.selected_tariffs,
                status: data.status,
                created_at: data.created_at,
                provider_name: data.provider_name,
                provider_code: data.provider_code,
                created_by: data.created_by

              }
          }),
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
  data?: SelectedPAType,
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
    }
}
export default useProvider
