import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any,
    count:number
}

export async function createCompanyService(data: any) {
  return ApiService.fetchData<Response>({
      url: '/privates/company/create',
      method: 'post',
      data
  })
}
export async function getCompanyService() {
  return ApiService.fetchData<Response>({
      url: '/privates/company/get',
      method: 'get',
  })
}
export async function OnboardCompanyEnrolleesService(data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
      total: number
  }>({
      url: '/privates/enrollee/company-masterlist',
      method: 'post',
      data
  })
}
export async function OnboardIndividualEnrolleesService(data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
      total: number
  }>({
      url: '/privates/enrollee/onboarding',
      method: 'post',
      data
  })
}

export async function updateClientStatusService(data:any,id:string) {
  return ApiService.fetchData<Response>({
      url: `/privates/company/update/status/${id}`,
      method: 'put',
      data
  })
}
export async function updateClientService(data:any,id:string) {
  return ApiService.fetchData<Response>({
      url: `/privates/company/update/${id}`,
      method: 'put',
      data
  })
}


export async function getPrivateEnrolleeService() {
  return ApiService.fetchData<Response>({
      url: '/privates/enrollee/getall',
      method: 'get',
  })
}
export async function getPrivateEnrolleeByCompanyIdService(id:string) {
  return ApiService.fetchData<Response>({
      url: `/privates/enrollee/get/by/client/${id}`,
      method: 'get',
  })
}
export async function getPrivateProviderService() {
  return ApiService.fetchData<Response>({
      url: `/privates/provider/get`,
      method: 'get',
  })
}




