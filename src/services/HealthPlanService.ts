import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any
}

export async function createHealthPlanService(data: any) {
    return ApiService.fetchData<Response>({
        url: '/healthplan/create',
        method: 'post',
        data
    })
}

export async function getAllHealthPlanCategoryService() {
    return ApiService.fetchData<Response>({
        url: '/healthplan/category/get',
        method: 'get',
    })
}

export async function createBenefits(data: any) {
    return ApiService.fetchData<Response>({
        url: '/healthplan/benefit/create',
        method: 'post',
        data
    })
}

export async function ViewBenefits(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
        total: any
    }>({
        url: '/healthplan/benefit/view',
        method: 'post',
        data
    })

}

export async function ViewHealthPlanCategoryService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
        total: any
    }>({
        url: '/healthplan/category/view',
        method: 'post',
        data
    })
}

export async function ViewHealthPlanService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
        total: any
    }>({
        url: '/healthplan/view',
        method: 'post',
        data
    })
}