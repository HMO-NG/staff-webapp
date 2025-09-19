import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any,
    count:number
}


export async function createBandService(data: any) {
  return ApiService.fetchData<Response>({
      url: '/band/create',
      method: 'post',
      data
  })
}

export async function getBandService() {
  return ApiService.fetchData<Response>({
      url: '/band/fetch',
      method: 'get',
  })
}

export async function getBandByIdService(id: string) {
  return ApiService.fetchData<Response>({
      url: `/band/get/${id}`,
      method: 'get',
  })
}

export async function updateBandService(data:any,id:string) {
  return ApiService.fetchData<Response>({
      url: `/band/update/${id}`,
      method: 'patch',
      data
  })
}
