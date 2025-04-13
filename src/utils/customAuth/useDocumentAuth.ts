import {
  addDocumentService,

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



  return {

    addDocumentAuth,
  }
}
export default useDouments
