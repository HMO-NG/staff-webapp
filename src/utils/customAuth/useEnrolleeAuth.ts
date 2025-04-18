import {
    createNhiaEnrolleeService,
    getAllAndSearchNhiaEnrolleeService,
    getAllNhiaEnrolleeService,
    OnboardNhiaCompanyEnrolleesService
} from "@/services/EntrolleeService"

type Status = 'success' | 'failed'

type NHIAEnrollee = {
    // value as id
    id: string,
    // label as policy_id
    policy_id: string,
    relationship: string,
    surname: string,
    other_names: string,
    dob: string,
    sex: string,
    company_id: string,
    provider_id: string,
    provider_name: string,
    provider_Address: string,
    created_by: string,
    created_at: string,
}
function useEnrollee() {

    const useCreateNhiaEnrolleeAuth = async (data: any): Promise<{
        status: Status,
        message: string,
        data?: any,
    } | undefined> => {
        try {

            const response = await createNhiaEnrolleeService(data)

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

    const getAllAndSearchNhiaEnrolleeAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status
        total: any
    } | undefined> => {
        try {
            const response = await getAllAndSearchNhiaEnrolleeService(data)

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


    const useGetAllNhiaEnrolleeAuth = async (data: any): Promise<{
        message: string,
        data?: NHIAEnrollee,
        status: Status
    } | undefined> => {
        try {
            const response = await getAllNhiaEnrolleeService({ "query": data ,"sort":{"order":"asc","key":""}})

            return {
                message: response.data.message,
                data: response.data.data.map((i:any) => {
                    return {
                        label: i.policy_id,
                        value: i.id,
                        relationship: i.relationship,
                        surname: i.surname,
                        other_names: i.other_names,
                        dob:i.dob,
                        sex:i.sex,
                        company_id:i.company_id,
                        provider_id:i.provider_id,
                        provider_name:i.provider_name,
                        provider_Address:i.provider_Address,
                        created_by:i.created_by,
                        created_at:i.created_at
                    }
                }),
                status: 'success',

            }
        } catch (error: any) {
            return {
                status: 'failed',
                message: error?.response?.data?.message || error.toString(),
            }
        }
    }

    const OnboardNhiaCompanyEnrolleesAuth = async (data: any): Promise<{
      message: string,
      data?: any,
      status: Status
      total: any
  } | undefined> => {
      try {
          const response = await OnboardNhiaCompanyEnrolleesService(data)

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


    return {
        useCreateNhiaEnrolleeAuth,
        getAllAndSearchNhiaEnrolleeAuth,
        useGetAllNhiaEnrolleeAuth,
        OnboardNhiaCompanyEnrolleesAuth
    }

}

export default useEnrollee
