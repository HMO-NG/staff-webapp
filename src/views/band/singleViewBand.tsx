import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import useBandAuth from '@/utils/customAuth/useBandAuth'
import type {Band}from '@/utils/customAuth/useBandAuth'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const SingleViewBand = () => {

  const [bandData2, setBandData] = useState<Band | null>(null)
  const {
            useGetBandAuth,
            useGetBandByIdAuth ,
  } = useBandAuth()
  const {id}=useParams()

  function openNotification(msg: string, notificationType: 'success' | 'warning' | 'danger' | 'info') {
      toast.push(
          <Notification
              title={notificationType.toString()}
              type={notificationType}>

              {msg}
          </Notification>, {
          placement: 'top-center'
      })
  }

  const {data:bandData,isLoading}= useQuery({
    queryKey: ['band'],
    queryFn: ()=>useGetBandByIdAuth(id as string),
    select: (data) => data?.data || null
  });


  return (

    <>

      <Card
                className='m-7'
                header="Registered Enrollee Details">
                <div>

                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                         {[
                         { label: "Last Name", value: bandData?.name },
                         { label: "Middle Name", value: bandData?.description },
                         //{ label: "Phone Number", value: RegisteredEnrollee?.phone_number },

                         ].map((item) => (
                         <div key={item.label} className="flex items-center">
                           <p className="font-medium heading-text min-w-[150px]">{item.label}:</p>
                           <p className="flex-1 truncate">{item.value || "-"}</p>
                         </div>
                       ))}
                     </div>
                     <div className="space-y-2">
                         {[
                         { label: "Sex", value: bandData?.created_at },
                         { label: "Company", value: bandData?.created_by },
                         ].map((item) => (
                         <div key={item.label} className="flex items-center">
                           <p className="font-medium heading-text min-w-[150px]">{item.label}:</p>
                           <p className="flex-1 truncate">{item.value || "-"}</p>
                         </div>
                       ))}
                     </div>



                        </div>




                    </div>
                </div>
       </Card>

    </>
  )
}

export default SingleViewBand
