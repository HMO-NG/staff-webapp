import {
    createPrivateClaimService,
    getAllPrivateClaimService,
    getPrivateClaimByIdService,
    updatePrivateClaimByIdService,
} from "@/services/PrivateClaimService";

type Status = 'success' | 'failed'

export type PrivateClaimType = {
  id: string;
  claim_type: string;
  diagnosis: string;
  claimed_services: [{}];
  encounter_date: string;
  admitted_date: string | null;
  discharged_date: string | null;
  requested_amount: number;
  approved_amount: number;
  review_comment: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  pa_code: string;
  status: 'pending' | 'approved' | 'denied' | 'partially approved';
  created_at: string;
  created_by: string;

  enrollee: {
    id: string;
    name: string;
    health_plan_id: string;
    health_plan_name: string;
  };

  provider: {
    name: string;
    code: string;
  };
};

export const defaultClaim: PrivateClaimType = {
  id: '',
  claim_type: '',
  diagnosis: '',
  claimed_services: [{}],
  encounter_date: '',
  admitted_date: null,
  discharged_date: null,
  requested_amount: 0,
  approved_amount: 0,
  review_comment: null,
  reviewed_at: null,
  reviewed_by: null,
  pa_code: '',
  status: 'pending',
  created_at: '',
  created_by: '',

  enrollee: {
    id: '',
    name: '',
    health_plan_id: '',
    health_plan_name: '',
  },

  provider: {
    name: '',
    code: '',
  },
};

function usePrivateClaims() {

    const usecreatePrivateClaimAuth = async (data: any): Promise<{
        message: string,
        data?: any,
        status: Status
    }> => {
        try {
            const response = await createPrivateClaimService(data)

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

    const usegetAllPrivateClaimAuth = async (): Promise<{
      message: string,
      data?: PrivateClaimType[],
      status: Status
    }> => {

      try {

          const response = await getAllPrivateClaimService();
          return {
              message: response.data.message,
              data: response.data.data.map((claim: any) => {
                  return {

                        id: claim.id,
                        claim_type: claim.claim_type,
                        diagnosis: claim.diagnosis,
                        claimed_services: claim.claimed_services,
                        encounter_date: claim.encounter_date,
                        admitted_date: claim.admitted_date,
                        discharged_date: claim.discharged_date,
                        requested_amount: claim.requested_amount,
                        approved_amount: claim.approved_amount,
                        review_comment: claim.review_comment,
                        reviewed_at: claim.reviewed_at,
                        reviewed_by: claim.reviewed_by,
                        pa_code: claim.pa_code,
                        status: claim.status,
                        created_at: claim.created_at,
                        created_by: claim.created_by,

                        enrollee: {
                          id: claim.enrollee.id,
                          name: claim.enrollee.name,
                          health_plan_id: claim.health_plan_id,
                          health_plan_name: claim.enrollee.health_plan_name,
                        },

                        provider: {
                          name: claim.provider.name,
                          code: claim.provider.code,
                        },
                      }



              }),
              status: 'success'

          }
      }
      catch (error: any) {

          return {
              status: 'failed',
              message: error?.response?.data?.message || error.toString(),
          }
      }

    }

    const usegetPrivateClaimByIdAuth = async (id:string): Promise<{
      message: string,
      data?: PrivateClaimType,
      status: Status
    }> => {

      try {

          const response = await getPrivateClaimByIdService(id);
          return {
              message: response.data.message,
              data: response.data.data,
              status: 'success'

          }
      }
      catch (error: any) {

          return {
              status: 'failed',
              message: error?.response?.data?.message || error.toString(),
          }
      }

    }

    const useupdatePrivateClaimByIdAuth = async (id:string,data: any): Promise<{
        message: string,
        data?: any,
        status: Status
    }> => {
        try {
            const response = await updatePrivateClaimByIdService(id,data)

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
        usecreatePrivateClaimAuth,
        usegetAllPrivateClaimAuth,
        usegetPrivateClaimByIdAuth,
        useupdatePrivateClaimByIdAuth,

      }
}

export default usePrivateClaims
