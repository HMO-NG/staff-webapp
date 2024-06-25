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