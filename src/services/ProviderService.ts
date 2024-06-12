import ApiService from "./ApiService"

type ProviderResponse = {
    message: string,
    data: []
}

type GenerateProviderRequest = {

}

export async function generateProviderCode<ProviderResponse, TRequest>() {

    return ApiService.fetchData<ProviderResponse, TRequest>({
        url: '/provider/get',
        method: 'get',

    })
}

export async function createProvider<TResponse, TRequest>(data: any) {
    return ApiService.fetchData<TResponse, TRequest>({
        url: '/provider/create',
        method: 'post',
        data
    })
}