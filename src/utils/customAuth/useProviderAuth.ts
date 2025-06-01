import {
    createProvider,
    getProviderByID,
    getAllProvider,
    editProviderByID,
    updateProviderActivationStatus,
    createNHIAProviderService,
    searchNHIAProviderByHCPIDService,
    CreateProviderServiceTariffService,
    getProviderServiceTariffByIdfService,
    getAllProviderServiceTariffService,
    getSingleProviderServiceTariffByIdService,
    CreateProviderDrugTariffService,
    getProviderDrugTariffByIdfService,
    getAllProviderDrugTariffService,
    getSingleProviderDrugTariffByIdService,
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
  insurance_plan_type:string,
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
          const response = await CreateProviderServiceTariffService(data)

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

              const response = await getProviderServiceTariffByIdfService(id);
              return {
                  message: response.data.message,
                  data: response.data.data.map((data: any) => {
                      return {
                        id:data.id,
                        item_name:data.item_name,
                        item_price:data.item_price,
                        provider_id:data.provider_id,
                        insurance_plan_type:data.insurance_plan_type,
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

            const response = await getAllProviderServiceTariffService();
            return {
                message: response.data.message,
                data: response.data.data.map((data: any) => {
                    return {
                      id:data.id,
                      item_name:data.item_name,
                      item_price:data.item_price,
                      provider_id:data.provider_id,
                      insurance_plan_type:data.insurance_plan_type,
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

          const response = await getSingleProviderServiceTariffByIdService(id);
          return {
              message: response.data.message,
              data: response.data.data.map((data: any) => {
                  return {
                    id:data.id,
                    item_name:data.item_name,
                    item_price:data.item_price,
                    provider_id:data.provider_id,
                    insurance_plan_type:data.insurance_plan_type,
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




  const useCreateProviderDrugTariffAuth = async (data: any): Promise<{
    data?: any,
    message: string,
    status: Status
}> => {
    try {
        const response = await CreateProviderDrugTariffService(data)

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

      const usegetProviderDrugTariffByIdAuth = async (id:string): Promise<{
        message: string,
        data?: ProviderDrugTariffType[],
        count?:number
        status: Status
    }> => {

        try {

            const response = await getProviderServiceTariffByIdfService(id);
            return {
                message: response.data.message,
                data: response.data.data.map((data: any) => {
                    return {
                      id:data.id,
                      item_name:data.item_name,
                      item_price:data.item_price,
                      provider_id:data.provider_id,
                      insurance_plan_type:data.insurance_plan_type,
                      formulation:data.formulation,
                      unit_of_measure:data.unit_of_measure,
                      category:data.category,
                      strength:data.strength,
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

    const usegetAllProviderDrugTariffAuth = async (): Promise<{
      message: string,
      data?: ProviderDrugTariffType[],
      status: Status
  }> => {

      try {

          const response = await getAllProviderDrugTariffService();
          return {
              message: response.data.message,
              data: response.data.data.map((data: any) => {
                  return {
                    id:data.id,
                    item_name:data.item_name,
                    item_price:data.item_price,
                    provider_id:data.provider_id,
                    insurance_plan_type:data.insurance_plan_type,
                    formulation:data.formulation,
                    unit_of_measure:data.unit_of_measure,
                    category:data.category,
                    strength:data.strength,
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

  const usegetSingleProviderDrugTariffByIdAuth = async (id:string): Promise<{
    message: string,
    data?: ProviderDrugTariffType,
    status: Status
}> => {

    try {

        const response = await getSingleProviderDrugTariffByIdService(id);
        return {
            message: response.data.message,
            data: response.data.data.map((data: any) => {
                return {
                  id:data.id,
                  item_name:data.item_name,
                  item_price:data.item_price,
                  provider_id:data.provider_id,
                  insurance_plan_type:data.insurance_plan_type,
                  formulation:data.formulation,
                  unit_of_measure:data.unit_of_measure,
                  category:data.category,
                  strength:data.strength,
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
        useCreateProviderDrugTariffAuth,
        usegetProviderDrugTariffByIdAuth,
        usegetSingleProviderDrugTariffByIdAuth,
        usegetAllProviderDrugTariffAuth
    }
}
export default useProvider
