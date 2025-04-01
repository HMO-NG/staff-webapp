import {createCompanyService,
  getCompanyService,getPrivateEnrolleeService,
  updateClientService,updateClientStatusService,
  getPrivateEnrolleeByCompanyIdService,
  getPrivateProviderService,OnboardCompanyEnrolleesService,
  OnboardIndividualEnrolleesService

}from "@/services/PrivatesService";


type Status = 'success' | 'failed'

type PrivateCompany={
  id: string
  company_name: string
  business_type: string
  company_heaadquaters: string
  primary_contact_position: string
  primary_contact_email: string
  primary_contact_phonenumber:string
  is_active:boolean
  user_id:string
  enrolled_by:string
}

type PrivateEnrollee={
      id:string
      first_name:string
      last_name:string
      middle_name:string
      email:string
      phone_number:number
      passport_url:string
      sex:string
      department:string
      position:string
      dob:string
      beneficiary_type:string
      family_size:string
      state:string
      city:string
      address:string
      is_active:boolean
      company_id:string
      provider_id:string
      provider_name:string
      company_name:string
      linked_to_user:string
      enrolled_by:string
}


function usePrivates() {

    const useCreateCompanyAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status
    }> => {
        try {
            const response = await createCompanyService(data)

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


      const useGetCompanyAuth = async (): Promise<{
          message: string,
          data?: PrivateCompany[],
          status: Status
      }> => {

          try {

              const response = await getCompanyService();
              return {
                  message: response.data.message,
                  data: response.data.data.map((items: any) => {
                      return {
                        id: items.id,
                        company_name: items.company_name,
                        business_type: items.business_type,
                        company_heaadquaters: items.company_heaadquaters,
                        primary_contact_position: items.primary_contact_position,
                        primary_contact_email: items.primary_contact_email,
                        primary_contact_phonenumber:items.primary_contact_phonenumber,
                        is_active:items.is_active,
                        // user_id:items.primary_contact_position,
                        enrolled_by:items.enrolled_by
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

      const OnboardPrivateEnrolleesAuth = async (data: any): Promise<{
            message: string,
            data?: any,
            status: Status
        } | undefined> => {
            try {
                const response = await OnboardCompanyEnrolleesService(data)

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
        const OnboardIndividualPrivateEnrolleesAuth = async (data: any): Promise<{
          message: string,
          data?: any,
          status: Status
      } | undefined> => {
          try {
              const response = await OnboardIndividualEnrolleesService(data)

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

      const updateClientAuth = async (data:any,id:string): Promise<{
        message: string,
        data?: PrivateCompany[],
        status: Status
    }> => {

        try {

            const response = await updateClientService(data,id);
            return {
                message: response.data.message,
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

    const updateClientStatusAuth = async (data:any,id:string): Promise<{
      message: string,
      data?: PrivateCompany[],
      status: Status
  }> => {

      try {

          const response =  await updateClientStatusService(data,id);
          return {
              message: response.data.message,
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


      const useGetPrivateEnrolleeAuth = async (): Promise<{
        message: string,
        data?: PrivateEnrollee[],
        status: Status
    }> => {

        try {

            const response = await getPrivateEnrolleeService();
            return {
                message: response.data.message,
                data: response.data.data.map((items: any) => {
                    return {

                      id:items.id,
                      first_name:items.first_name,
                      last_name:items.last_name,
                      middle_name:items.middle_name,
                      email:items.email,
                      phone_number:items.phone_number,
                      passport_url:items.passport_url,
                      sex:items.sex,
                      department:items.department,
                      position:items.position,
                      dob:items.dob,
                      beneficiary_type:items.beneficiary_type,
                      family_size:items.family_size,
                      state:items.state,
                      city:items.city,
                      address:items.address,
                      is_active:items.is_active,
                      company_id:items.company_id,
                      provider_id:items.provider_id,
                      provider_name:items.provider_name,
                      company_name:items.company_name,
                      linked_to_user:items.linked_to_user,
                      enrolled_by:items.enrolled_by
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

    const usegetPrivateEnrolleeByCompanyIdAuth = async (id:string): Promise<{
      message: string,
      data?: PrivateEnrollee[],
      count?:number,
      status: Status
  }> => {

      try {

          const response = await getPrivateEnrolleeByCompanyIdService(id);
          return {
              message: response.data.message,
              data: response.data.data.map((items: any) => {
                  return {
                    id:items.id,
                    first_name:items.first_name,
                    last_name:items.last_name,
                    middle_name:items.middle_name,
                    email:items.email,
                    phone_number:items.phone_number,
                    passport_url:items.passport_url,
                    sex:items.sex,
                    department:items.department,
                    position:items.position,
                    dob:items.dob,
                    beneficiary_type:items.beneficiary_type,
                    family_size:items.family_size,
                    state:items.state,
                    city:items.city,
                    address:items.address,
                    is_active:items.is_active,
                    company_id:items.company_id,
                    provider_id:items.provider_id,
                    provider_name:items.provider_name,
                    company_name:items.company_name,
                    linked_to_user:items.linked_to_user,
                    enrolled_by:items.enrolled_by
                  }
              }),
              count: response.data.count,
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
  const usegetPrivateProviderAuth = async (): Promise<{
    message: string,
    data?:[],
    status: Status
}> => {

    try {

        const response = await getPrivateProviderService();
        return {
            message: response.data.message,
            data: response.data.data.map((items: any) => {
                return {
                  id:items.id,
                  name:items.name,


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
        useCreateCompanyAuth,
        useGetCompanyAuth,
        OnboardPrivateEnrolleesAuth,
        OnboardIndividualPrivateEnrolleesAuth,
        useGetPrivateEnrolleeAuth,
        updateClientAuth,
        updateClientStatusAuth,
        usegetPrivateEnrolleeByCompanyIdAuth,
        usegetPrivateProviderAuth,
      }
}

export default usePrivates
