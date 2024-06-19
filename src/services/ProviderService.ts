import ApiService from "./ApiService"

type CreateProviderResponse = {
    message: string,
    data: string
}

type GenericProviderResponse = {
    message: string,
    data: any,
}

type ProviderResponse = {
    message: string,
    data: [],
    total: any
}

/*
Returns the provider id, name, state, code, and user id, first name and last name as full name */
export async function getAllProvider(data: any) {

    return ApiService.fetchData<ProviderResponse>({
        url: '/provider/get',
        method: 'post',
        data
    })
}

export async function createProvider(data: any) {
    return ApiService.fetchData<CreateProviderResponse>({
        url: '/provider/create',
        method: 'post',
        data
    })
}

// returns a single provider by id
export async function getProviderByID(data: any) {
    return ApiService.fetchData<GenericProviderResponse>({
        url: '/provider/get/id',
        method: 'post',
        data
    })
}