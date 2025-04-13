import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any,
    count:number
}

export async function addDocumentService(data:any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
      total: number
  }>({
      url: `/doc/add`,
      method: 'post',
      data
  })
}
