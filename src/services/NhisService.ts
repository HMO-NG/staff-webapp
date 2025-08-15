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

export async function createNhiaDrugTarrifService(data: any) {
    return ApiService.fetchData<Response>({
        url: '/nhis/drug/tarrif/create',
        method: 'post',
        data
    })
}

export async function getAllAndSearchNhiaDrugTarrifService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
        total: number
    }>({
        url: '/nhis/drug/tarrif/search',
        method: 'post',
        data
    })
}

export async function createNhiaClaimService(data: any) {
    return ApiService.fetchData<{
        message: string,
    }>({
        url: '/nhis/claim/create',
        method: 'post',
        data
    })
}

export async function getAllNhiaClaimService() {
    return ApiService.fetchData<{
        message: string,
        data: any,
        total: number,
    }>({
        url: '/nhis/claim/getall',
        method: 'get',
    })
}

export async function getNhiaClaimByIDService(id:string) {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: `/nhis/claim/${id}`,
        method: 'get',
    })
}

export async function updateNhiaClaimByIDService(id: string,data: any) {
    return ApiService.fetchData<{
        message: string,
    }>({
        url: `/nhis/claim/${id}`,
        method: 'post',
        data
    })
}
