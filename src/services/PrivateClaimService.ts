import ApiService from "./ApiService"


export async function createPrivateClaimService(data:any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/privates/claim/create`,
      method: 'post',
      data
  })
}

export async function getAllPrivateClaimService() {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/privates/claim/getall`,
      method: 'get',
  })
}

export async function getPrivateClaimByIdService(id:string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/privates/claim/get/${id}`,
      method: 'get',
  })
}
export async function updatePrivateClaimByIdService(id:string,data:any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/privates/claim/update/${id}`,
      method: 'put',
      data
  })
}

