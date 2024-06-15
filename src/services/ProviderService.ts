import ApiService from "./ApiService"

type CreateProviderResponse = {
    message: string,
    data: string
}

export async function generateProviderCode<ProviderResponse, TRequest>() {

    return ApiService.fetchData<ProviderResponse, TRequest>({
        url: '/provider/get',
        method: 'get',

    })
}

export async function createProvider(data: any) {
    return ApiService.fetchData<CreateProviderResponse>({
        url: '/provider/create',
        method: 'post',
        data
    })
}