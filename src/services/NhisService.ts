import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any
}

export async function createNhiaServiceTarrifService(data: any) {
    return ApiService.fetchData<Response>({
        url: '/nhis/service/tarrif/create',
        method: 'post',
        data
    })
}

export async function getAllAndSearchNhiaService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
        total: number
    }>({
        url: '/nhis/services/search/get',
        method: 'post',
        data
    })
}