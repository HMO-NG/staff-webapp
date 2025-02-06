import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any
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
      // data
  })
}

