import {createCompanyService,
  getCompanyService,
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
  user_id:string
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

      return {
        useCreateCompanyAuth,
        useGetCompanyAuth
      }
}

export default usePrivates
