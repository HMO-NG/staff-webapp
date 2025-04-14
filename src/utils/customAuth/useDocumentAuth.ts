import {
  addDocumentService,uploadRawFilesTocloudinaryService,
  uploadImagesTocloudinaryService,

}from "@/services/DoumentService";


type Status = 'success' | 'failed'


function useDouments(){
  const addDocumentAuth = async (data:any): Promise<{
    message: string,
    data?: any,
    status: Status
  }> => {
    try {
        const response = await addDocumentService(data)

        return {
            message: response.data.message,
            data: response.data.data,
            status: "success"
        }

    } catch (error: any) {

        return {
            status: 'failed',
            message: error?.response?.data?.message || error.toString(),
        }

    }
  }
  const uploadRawFilesTocloudinaryAuth = async (data:any,cloud_name:string): Promise<{
    message: string,
    data?: any,
    status: Status
  }> => {
    try {
        const response = await uploadRawFilesTocloudinaryService(data,cloud_name)

        return {
            message: response.data.message,
            data: response.data,
            status: "success"
        }

    } catch (error: any) {

        return {
            status: 'failed',
            message: error?.response?.data?.message || error.toString(),
        }

    }
  }
  const uploadImagesTocloudinaryAuth = async (data:any,cloud_name:string): Promise<{
    message: string,
    data?: any,
    status: Status
  }> => {
    try {
        const response = await uploadImagesTocloudinaryService(data,cloud_name)

        return {
            message: response.data.message,
            data: response.data,
            status: "success"
        }

    } catch (error: any) {

        return {
            status: 'failed',
            message: error?.response?.data?.message || error.toString(),
        }

    }
  }



  return {

    addDocumentAuth,
    uploadRawFilesTocloudinaryAuth,
    uploadImagesTocloudinaryAuth,
  }
}
export default useDouments
