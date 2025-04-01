import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any
}

export async function createNhiaEnrolleeService(data: any) {
    return ApiService.fetchData<Response>({
        url: '/nhia/enrollee/create',
        method: 'post',
        data
    })
}

export async function getAllAndSearchNhiaEnrolleeService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
        total: number
    }>({
        url: '/nhis/enrollee/search',
        method: 'post',
        data
    })
}

export async function getAllNhiaEnrolleeService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
        total: number
    }>({
        url: '/nhis/enrollee/search',
        method: 'post',
        data
    })
}

export async function OnboardNhiaCompanyEnrolleesService(data: any) {
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

