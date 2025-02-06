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

export async function createHealthPlanCategoryService(data: any) {
    return ApiService.fetchData<Response>({
        url: '/healthplan/category/create',
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

export async function GetSingleHealthPlanCategoryService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: '/healthplan/category/get',
        method: 'post',
        data
    })
}

// get all benefits
export async function GetAllBenefitListService() {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: '/healthplan/benefit/get',
        method: 'get',

    })
}

// create/save the attached benefits
export async function CreateAttachedBenefitService(data:any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: '/healthplan/benefit/attach',
        method: 'post',
        data

    })
}

export async function GetAttachedBenefitServiceByHealthPlanID(data:any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: '/healthplan/benefit/attach/get',
        method: 'post',
        data

    })
}

export async function UpdateAttachedBenefitService(data:any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: '/healthplan/benefit/attach/update',
        method: 'post',
        data

    })
}

export async function DeleteAttachedBenefitService(data:any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: `/healthplan/benefit/attach/delete/${data}`,
        method: 'delete',
        data
    })
}

export async function UpdateHealthPlanService(id:any,data:any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/healthplan/update/${id}`,
      method: 'put',
      data,
  })
}

export async function UpdateHealthPlanStatusService(id:any,data:any) {
  return ApiService.fetchData<{
      message: string,
      data:any,
  }>({
      url: `/healthplan/change-status/${id}`,
      method: 'put',
      data: typeof data === "boolean" ? { disabled_plan: data } : data,
  })
}
