import ApiService from "./ApiService"
import axios from 'axios';

type Response = {
    message: string,
    data: any,
    count:number
}

export async function addDocumentService(data:any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/doc/add`,
      method: 'post',
      data
  })
}
export async function uploadRawFilesTocloudinaryService(data:any,cloud_name:string) {
  return axios.post<{
      message: string,
      data: any,
  }>(
      `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,
      data
  )
}
export async function uploadImagesTocloudinaryService(data:any,cloud_name:string) {
  return axios.post<{
      message: string,
      data: any,
  }>(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      data
  )
}
