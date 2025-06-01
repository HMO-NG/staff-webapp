import {createCompanyService,
  getCompanyService,getPrivateEnrolleeService,
  updateClientService,updateClientStatusService,
  getPrivateEnrolleeByCompanyIdService,
  getPrivateProviderService,OnboardCompanyEnrolleesService,
  OnboardIndividualEnrolleesService,
  getSinglePrivateEnrolleeService,
  createPrivateEnrolleeDependantsService,
  updatePrivateEnrolleeService,

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
  number_of_enrollees:number
  is_active:boolean
  user_id:string
  enrolled_by:string
  count:number
}
type EnrolleeMedicalData={
  // id:string,
  // enrollee_id:string,
  blood_group: string,
  genotype: string,
  disabilities: string,
  allergies: string,
  pre_existing_conditions:string,
  past_surgeries: string,
  family_medical_history: string,
}

export type PrivateEnrollee={
      id:string
      first_name:string
      last_name:string
      middle_name:string
      email:string
      phone_number:string
      passport_url:string
      sex:string
      department:string
      position:string
      dob:string
      beneficiary_type:string
      enrollee_type:string
      family_size:number
      state:string
      city:string
      address:string
      is_active:boolean
      company_id:string
      provider_id:string
      provider_name:string
      company_name:string
      plan_name:string

      medical_data?: EnrolleeMedicalData

      linked_to_user:string
      enrolled_by:string
      created_at:string
}

export const defaultEnrolleeMedicalData: EnrolleeMedicalData = {
  // id: '',
  // enrollee_id: '',
  blood_group: '',
  genotype: '',
  disabilities: '',
  allergies: '',
  pre_existing_conditions: '',
  past_surgeries: '',
  family_medical_history: '',
};
export const defaultPrivateEnrollee: PrivateEnrollee = {
  id: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  phone_number: '',
  passport_url: '',
  sex: '',
  department: '',
  position: '',
  dob: '',
  beneficiary_type: '',
  enrollee_type: '',
  family_size: 0,
  state: '',
  city: '',
  address: '',
  is_active: false,
  company_id: '',
  provider_id: '',
  provider_name: '',
  company_name: '',
  plan_name: '',

  medical_data:defaultEnrolleeMedicalData,

  linked_to_user: '',
  enrolled_by: '',
  created_at: '',
};


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
                        number_of_enrollees:items.number_of_enrollees,
                        is_active:items.is_active,
                        count:items.count,
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
                      enrollee_type:items.enrollee_type,
                      family_size:items.family_size,
                      state:items.state,
                      city:items.city,
                      address:items.address,
                      is_active:items.is_active,
                      company_id:items.company_id,
                      provider_id:items.provider_id,
                      provider_name:items.provider_name,
                      company_name:items.company_name,
                      plan_name:items.plan_name,
                      linked_to_user:items.linked_to_user,
                      enrolled_by:items.enrolled_by,
                      created_at:items.created_at,
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
                    enrollee_type:items.enrollee_type,
                    family_size:items.family_size,
                    state:items.state,
                    city:items.city,
                    address:items.address,
                    is_active:items.is_active,
                    company_id:items.company_id,
                    provider_id:items.provider_id,
                    provider_name:items.provider_name,
                    company_name:items.company_name,
                    plan_name:items.plan_name,
                    linked_to_user:items.linked_to_user,
                    enrolled_by:items.enrolled_by,
                    created_at:items.created_at,
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

const usegetSinglePrivateEnrolleeAuth = async (id:string): Promise<{
  message: string,
  data?:PrivateEnrollee,
  status: Status
}> => {

  try {

      const response = await getSinglePrivateEnrolleeService(id);
      // const { provider_name, company_name, ...enrolleeData } = response.data.data;
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
const createPrivateEnrolleeDependantsAuth = async (id: string,data:any): Promise<{
  message: string,
  data?: any,
  status: Status
}> => {
  try {
      const response = await createPrivateEnrolleeDependantsService(id,data)

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

const updatePrivateEnrolleeAuth = async (id: string,data:any): Promise<{
  message: string,
  data?: any,
  status: Status
}> => {
  try {
      const response = await updatePrivateEnrolleeService(id,data)

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
        useCreateCompanyAuth,
        useGetCompanyAuth,
        OnboardPrivateEnrolleesAuth,
        OnboardIndividualPrivateEnrolleesAuth,
        useGetPrivateEnrolleeAuth,
        updateClientAuth,
        updateClientStatusAuth,
        usegetPrivateEnrolleeByCompanyIdAuth,
        usegetPrivateProviderAuth,
        usegetSinglePrivateEnrolleeAuth,
        createPrivateEnrolleeDependantsAuth,
        updatePrivateEnrolleeAuth,
      }
}

export default usePrivates
