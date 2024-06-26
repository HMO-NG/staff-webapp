import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any
}

export async function createNhiaService(data: any) {
    return ApiService.fetchData<Response>({
        url: '/nhis/services/create',
        method: 'post',
        data
    })
}