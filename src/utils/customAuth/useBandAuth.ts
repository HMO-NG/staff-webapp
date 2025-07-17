import {createBandService,
        getBandService,
        getBandByIdService,
        updateBandService,
}from "@/services/BandService";

type Status = 'success' | 'failed'

export type Band={
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
}

function useBandAuth() {

   const useCreateBandAuth = async (data: any):Promise<{
    message: string,
    data?:any,
    status: Status
   }> => {
    try{
      const response = await createBandService(data);
      return {
        message: response.data.message,
        data: response.data.data,
        status: 'success'
      };

    }catch(error:any){
      return {
            status: 'failed',
            message: error?.response?.data?.message || error.toString(),
            }

    }

   }

   const useGetBandAuth = async ():Promise<{
    message: string,
    data?: Band[],
    status: Status
   }> => {
    try{
      const response = await getBandService();
      return {
        message: response.data.message,
        data: response.data.data,
        status: 'success'
      };
    }catch(error:any){
      return {
            status: 'failed',
            message: error?.response?.data?.message || error.toString(),
            }
    }
   }

   const useGetBandByIdAuth = async (id: string):Promise<{
    message: string,
    data?: Band,
    status:Status
    }> => {
      try{
        const response = await getBandByIdService(id);
        return {
            message: response.data.message,
            data: response.data.data,
            status: 'success'
        };


      }catch(error:any){
        return {
            status: 'failed',
            message: error?.response?.data?.message || error.toString(),
            }
      }
    }

    const useUpdateBandAuth = async (data:any,id:string):Promise<{
      message: string,
      data?: any,
      status: Status
    }> =>{
      try{
        const response = await updateBandService(data,id);
        return {
            message: response.data.message,
            data: response.data.data,
            status: 'success'
        };
      }catch(error:any){
        return {
            status: 'failed',
            message: error?.response?.data?.message || error.toString(),
            }
      }

    }



   return{
    useCreateBandAuth,
    useGetBandAuth,
    useGetBandByIdAuth,
    useUpdateBandAuth,
   }



}

export default useBandAuth;
