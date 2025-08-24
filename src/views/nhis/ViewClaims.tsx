import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

import useProvider from '@/utils/customAuth/useProviderAuth'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef, OnSortParam, CellContext, Row } from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import { FiEye } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import Dialog from '@/components/ui/Dialog'
import Card from '@/components/ui/Card'
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { FaRegCommentDots } from 'react-icons/fa';
import { HiOutlinePencilAlt } from 'react-icons/hi'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FieldArray } from 'formik'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import IconText from '@/components/shared/IconText'
import useNhia from '@/utils/customAuth/useNhisAuth'
import {NHIAClaimType,defaultNhiaClaim} from '@/utils/customAuth/useNhisAuth'
// import {PrivateClaimType,defaultClaim} from '@/utils/customAuth/usePrivateClaimAuth'
import {
  HiPlus,
  HiDocumentAdd,
  HiOutlineDocumentDownload,
} from 'react-icons/hi'
import { useNavigate ,Link} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {tariffType,defaultService,defaultDrug} from '@/utils/customAuth/useNhisAuth';


const defaultTariff: tariffType = {
  id: '',
  status: 'pending',
  comment: null,
  amt_claimed: 0,
  quantity: 0,
  drug_name: '',
  service_name: '',
  price: 0,
  approved_quantity: 0,
  approved_price: 0,
  total_price: 0,
  approved_total: 0,
};

type DialogTypeKey = 'info' | 'success' | 'warning' | 'danger'
type dialogContentType='reject_tariff'|'approve_tariff'|'approve_PA'|undefined

const ViewAllNhiaClaims =()=>{
    const {
    usegetAllpreauthorizationRequestAuth,
    usegetSinglePreAuthorizationByIdAuth,
     } = useProvider()
    const {
        getAllNhiaClaimAuth,
        getNhiaClaimByIdAuth,
        useupdateNhiaClaimByIdAuth,
    } = useNhia()
    const navigate = useNavigate()
    const [data, setData] = useState<NHIAClaimType[]>([])
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState<{
            pageIndex: number
            pageSize: number
            sort: {
                order: '' | 'asc' | 'desc'
                key: string | number;
            };
            query: string
            total: number
    }>({
            total: 0,
            pageIndex: 1,
            pageSize: 10,
            query: '',
            sort: {
                order: 'asc',
                key: '',
            },
    })
    const [viewDialog, setViewDialog] = useState(false)
    const [singleClaim,setSingleClaim]=useState<NHIAClaimType>(defaultNhiaClaim)
    const [openPopupDialog, setOpenPopupDialog] = useState(false)
    const [viewReviewDialog, setReviewDialog] = useState(false)
    const [selectedPAData, setselectedPAData] = useState<{Claim:NHIAClaimType,tariff:tariffType}>(
      {Claim:defaultNhiaClaim,
       tariff:defaultTariff})
    const [dialogtitle, setdialogtitle] = useState('')
    const [dialogtype, setdialogtype] = useState<DialogTypeKey>('info')
    const [dialogContentType, setdialogContentType] = useState<dialogContentType>(undefined)
    const confirmResolver = useRef<(value: boolean) => void>();



    const getAllClaim = async () => {
      setLoading(true)
      const response= await getAllNhiaClaimAuth()
      if (response.data) {
          setData(response.data)
          setLoading(false)
      }
    }
    const getSingleClaim=async (id:string) => {
      const response = await getNhiaClaimByIdAuth(id)
      if (response.data) {
          setSingleClaim(response.data)
      } else {
        openNotification('Error fetching data', 'danger')

      }
    }
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

      const handleClose = () => {
        console.log('Close')
        if (confirmResolver.current) {
          confirmResolver.current(false);
          confirmResolver.current = undefined;
        }
        setOpenPopupDialog(false)
    }

    const handleConfirm = async (): Promise<void> => {
      try{
        if (confirmResolver.current) {
          confirmResolver.current(true);
          confirmResolver.current = undefined;
        }

        switch(dialogContentType){
          case 'approve_tariff':
            onUpdatePATariff(selectedPAData.Claim.id, 'approved', selectedPAData.tariff);

            break;
          case 'reject_tariff':
            onUpdatePATariff(selectedPAData.Claim.id, 'denied', selectedPAData.tariff);

            break;
          case 'approve_PA':
            setselectedPAData({Claim:singleClaim , tariff:defaultTariff})


            break;
           default:
            console.log('Confirm')

        }
        setOpenPopupDialog(false)

        // setUpdatePA(true)
      }catch (error) {
        console.error('Error in handleConfirm:', error);
      }
    }

    const openConfirmDialog = (
      msg: string,
      dialogType: 'info' | 'success' | 'warning' | 'danger',
      content_type?: dialogContentType
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        setdialogtitle(msg);
        setdialogtype(dialogType);
        setdialogContentType(content_type);
        setOpenPopupDialog(true);

        // Store the resolver in a ref or state
        confirmResolver.current = resolve;
      });
    };

    const handleView = async(props: CellContext<NHIAClaimType, unknown>) => {
        const row = props.row.original
        const id = row.id
        getSingleClaim(id)
        setViewDialog(true)
    }
    const FormatDate =(d:any)=>{
      const date = new Date(d);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return formattedDate
    }

    const columns: ColumnDef<NHIAClaimType>[] = useMemo(() => (
        [
            {
              header: 'Referring HCF',
              accessorKey: 'referring_hcf',
            },
            {
              header: 'Recieving HCF',
              accessorKey: 'recieving_hcf',
            },
            {
              header: 'Enrollee',
              accessorKey: 'nhia_enrollee_name',
            },
            {
              header: 'Plan',
              accessorKey: 'enrollee.health_plan_name',
            },
            {
              header: 'PA Code',
              accessorKey: 'pa_code',
            },
            {
              header: 'Created At',
              cell:(props)=> FormatDate(props.cell.row.original.created_at)
            },
            {
                header: 'Status',
                cell: (props) => (
                    <div>
                        {
                          props.cell.row.original.status =='approved'?
                              <Tag className='bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0'>
                                  Active
                              </Tag> :
                              props.cell.row.original.status =='denied'?
                              <Tag className='text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'>
                                  Denied
                              </Tag>:
                               props.cell.row.original.status =='pending'?
                               <Tag className='text-red-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20 border-0'>
                                   Pending
                               </Tag>:
                               props.cell.row.original.status =='partially approved'?
                               <Tag className='text-orange-600 bg-orange-100 dark:text-orange-100 dark:bg-orange-500/20 border-0'>
                                   Partially Approved
                               </Tag>:
                                <Tag className='text-white bg-red-700 border-0'>
                                none
                            </Tag>


                        }
                    </div>
                )
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <div>
                      <Button
                      variant="plain"
                      icon={<AiOutlineEye/>}
                      onClick={() => handleView(props)}
                      >
                        View</Button>
                    </div>
                ),
            },
        ]
    ), [])

    const ChangeStatusOfAllTariff=async(new_status:"pending" | "approved" | "denied",updateType:'all'|'pending')=>{

      let updatedTariffs: tariffType[] = [];
      if (updateType === 'all') {
        updatedTariffs = (singleClaim?.items || []).map((item: tariffType) => ({
          ...item,
          approved_quantity: item.quantity,
          approved_price: item.price,
          status: new_status,
        }));
    }else if (updateType === 'pending') {
      updatedTariffs = (singleClaim?.items || []).map((tariff: tariffType) =>{
        if(tariff.status === 'pending'){
          const approved_quantity = Number(tariff.quantity) || 0;
          const approved_price = Number(tariff.price) || 0;
          const approved_total = parseFloat((approved_quantity * approved_price).toFixed(2));
          return {
            ...tariff,
            approved_quantity: tariff.quantity,
            approved_price: tariff.price,
            status: new_status,
            approved_total: approved_total, // Add the approved total to the item
          };
        }
        return tariff; // Return unmodified tariff if it's not pending
      });
    }

      console.log('updatedTariffs',updatedTariffs)
      return updatedTariffs

    }
    const onUpdatePA=async(Claim_ID:any,new_status:"pending"|'approved'| 'denied'|'partially approved')=>{
      let main_status = new_status === "approved"
      ? "approve"
      : new_status === "denied"
        ? "deny"
        : "none";
      const new_PA_status =determinePAStatus(singleClaim?.items || [])
      let request_data:{
        status: "pending" | "approved" | "denied" | "partially approved";
        items?: string;
        approved_price?: string;
        provider_comment?: string;
      } = {
         status: new_status,
         };
      const mainPopupDialog=await openConfirmDialog(`Are you sure you want to ${main_status} this Request`,'info','approve_PA')


     if (mainPopupDialog){
      if (new_PA_status=='partially approved'){
        const confirmed = await openConfirmDialog('some tariifs in this request have already been approved so by defaault the status will be partially approved',
                          'info',undefined)
         if (!confirmed) {
           return; // User cancelled
         }
         request_data.status=new_PA_status
      }
      else if (new_PA_status==='pending'){
          const confirmed = await openConfirmDialog(`some tariifs in this request are still pending it will automatically ${new_status} those that are pending`,
                          'danger',undefined)
         if (!confirmed) {
           return; // User cancelled
         }
         let new_tariff_status:any = new_status ==='approved' ? "approved":new_status ==='denied' ? "denied":'none'
         const items=await ChangeStatusOfAllTariff(new_tariff_status,'pending')
         const totalTariffAmount = (items || []).reduce((total:number, tariff:tariffType) => {
          const price: number = Number(tariff.approved_price) ||0;
          const quantity: number = Number(tariff.approved_quantity) ||0;
          const totalprice=total + (price * quantity);
          request_data.approved_price=(totalprice).toFixed(2);
          // newammm=totalprice
          return totalprice
          // return total + (price * quantity);
        }, 0);
         request_data.items=JSON.stringify(items)
        //  request_data.approved_price=totalTariffAmount
      }
    }
    let newammm

     const response = await  useupdateNhiaClaimByIdAuth(Claim_ID,request_data)

      if (response) {
        setTimeout(() => {
           if (response.status=="success"){
            getAllClaim()
            getSingleClaim(Claim_ID)
            setViewDialog(false)
            setLoading(false)
            openNotification(response.message,'success')
           }
           else if (response.status=="failed"){
            openNotification(response.message,"danger")
           }
        }, 3000)
    }

    }
    function determinePAStatus(tariffs: tariffType[]): "pending"|'approved'| 'denied'|'partially approved'|'only denied' {
      const statuses = tariffs.map(t => t.status);

      const hasPending = statuses.includes('pending');
      const hasApproved = statuses.includes('approved');
      const hasDenied = statuses.includes('denied');

      const onlyPending = statuses.every(s => s === 'pending');
      const onlyApproved = statuses.every(s => s === 'approved');
      const onlyDenied = statuses.every(s => s === 'denied');

      if (onlyDenied) return 'only denied';

      if (hasPending) return 'pending';
      if (hasApproved && hasDenied) return 'partially approved';
      if (hasApproved) return 'approved';
      return 'denied'; // if only denied tariffs
    }

    const onUpdatePATariff=async(PA_ID:any,new_status:"pending" | "approved" | "denied",tariff:tariffType)=>{
      const updatedTariffs = (singleClaim?.items || []).map((item: tariffType) => {
        if (item.id === tariff.id) {
          const approved_quantity = Number(tariff.approved_quantity) || 0;
          const approved_price = Number(tariff.approved_price) || 0;
          const approved_total = parseFloat((approved_quantity * approved_price).toFixed(2))
          return {
            ...item,
            approved_quantity: tariff.quantity,
            approved_price: tariff.price,
            status: new_status,
            approved_total:approved_total,
          };
        }
        return item;
      });
      const response = await  useupdateNhiaClaimByIdAuth(PA_ID,{
          items:JSON.stringify(updatedTariffs),
      })


      if (response) {
        setTimeout(() => {
           if (response.status=="success"){
            getSingleClaim(PA_ID)
            openNotification(response.message,'success')
           }
           else if (response.status=="failed"){
            openNotification(response.message,"danger")
           }
        }, 3000)


      };

    }
    const onReviewPATariff=async(PA_ID:any,data:any)=>{
      let tariff=selectedPAData.tariff
      const updatedTariffs = (singleClaim?.items || []).map((item: tariffType) => {
        if (item.id === tariff.id) {
          const approved_quantity = Number(data.approved_quantity) || 0;
          const approved_price = Number(data.approved_price) || 0;
          const approved_total = parseFloat((approved_quantity * approved_price).toFixed(2))
          return {
            ...item,
            approved_quantity: data.approved_quantity,
            approved_price: data.approved_price,
            comment:data.comment,
            approved_total,
          };
        }
        return item;
      });
      const response = await  useupdateNhiaClaimByIdAuth(PA_ID,{
          items:JSON.stringify(updatedTariffs),
      })
      if (response) {
        setTimeout(() => {
           if (response.status=="success"){
            openNotification(response.message,'success')
            setReviewDialog(false)
            getSingleClaim(PA_ID)
           }
           else if (response.status=="failed"){
            openNotification(response.message,"danger")
           }
        }, 3000)


    }}

    const statusTag=(status:"pending" | "approved" | "denied")=>{
      return(

           status ==='approved'?
             <Tag className='p-0 text-sm text-emerald-600 dark:text-emerald-100 border-0'>
                 Approved
             </Tag> :
           status ==='denied'?
             <Tag className='p-0 text-sm text-red-600 border-0'>
                 Denied
             </Tag>:
           status ==='pending'?
             <Tag className='p-0 text-sm text-amber-600 dark:text-red-100 border-0'>
                 Pending
             </Tag>:
             <Tag className='p-0 text-sm text-red-700  border-0'>
                 None
             </Tag>
      )
    }

    const {isLoading:claimsLoading}= useQuery({
              queryKey:['nhia_claim'],
              queryFn: ()=> getAllClaim(),

    })

    // useEffect(()=>{
    // getAllClaim()
    // }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query,])

return(
  <>
  <h5 className='mb-5'>View All Claims</h5>
   <div className="  flex justify-end mb-5">
                  <Button
                      className="mr-2"
                      variant="solid"
                      onClick={() => navigate('/privates/claim/create')}
                      icon={<HiPlus />}
                  >
                      <span>Create New Claim</span>
                  </Button>

              </div>
              <DataTable<NHIAClaimType>
                  selectable
                  columns={columns}
                  data={data}
                  loading={loading}
                  pagingData={tableData}
              />
                {
                    viewDialog && <Dialog
                       isOpen={viewDialog}
                       onClose={() => setViewDialog(false)}
                       onRequestClose={() => setViewDialog(false)}
                       width={450}
                       height={800}
                       shouldCloseOnOverlayClick={false}
                       shouldCloseOnEsc={false}
                   >
                       <div className="flex flex-col h-full justify-between">


                           <h5 className="mb-0">View Claims</h5>
                           <div className="overflow-y-auto">

                               <div className="grid grid-cols-2 gap-6 p-4 rounded-xl">
                                 <div className="space-y-2">
                                   <p className="font-light text-gray-700">Enrollee: <span className="font-semibold text-gray-900">{singleClaim?.nhia_enrollee_name}</span></p>
                                   <p className="font-light text-gray-700">Date Created: <span className="font-semibold text-gray-900">{singleClaim?.created_at}</span></p>
                                   {/* <p className="font-light text-gray-700">Plan: <span className="font-semibold text-gray-900">{singleClaim?.enrollee.health_plan_name}</span></p> */}
                                   <p className="font-light text-gray-700">Diagnosis: <span className="font-semibold text-gray-900">{singleClaim?.diagnosis}</span></p>
                                 </div>
                                <div className="space-y-2">
                                   <p className="font-light text-gray-700">Referring HCF: <span className="font-semibold text-gray-900">{singleClaim?.referring_hcf}</span></p>
                                   <p className="font-light text-gray-700">Recieving HCF: <span className="font-semibold text-gray-900">{singleClaim?.recieving_hcf}</span></p>
                                 </div>
                               </div>
                               {Array.isArray(singleClaim?.items) &&

                               singleClaim?.items?.map((tariff:tariffType, index) => (
                                <>
                                <Card
                                className='mb-5'
                                header={tariff?.service_name || tariff?.drug_name}
                                >
                               <div className="space-y-2 mb-4">
                                    {[
                                    { label: "Tariff Price", value: `₦${Number(tariff?.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                                    { label: "Requested Quantity", value: `x${tariff?.quantity}`},
                                    { label: "Approved Quantity", value: `x${Number(tariff?.approved_quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    // { label: "Approved Quantity", value: `x${tariff?.approved_quantity}`},
                                    { label: "Approved Price", value:  `₦${Number(tariff?.approved_price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    { label: "Total", value: `₦${Number(tariff?.total_price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    { label: "Approved Total", value: `₦${Number(tariff?.approved_total ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    ].map((item) => (
                                    <div key={item.label} className="flex justify-between w-full">
                                      <p className="font-light text-gray-500 heading-text ">{item.label}:</p>
                                      <p className="text-right font-semibold text-gray-900">{item.value || "-"}</p>
                                    </div>
                                  ))}
                                    <div className='grid grid-cols-4 gap-4'>
                                    <div className='col-span-1'>
                                        {statusTag(tariff?.status)}

                                     <p className="font-medium heading-text">Status</p>
                                     </div>
                                     {tariff.status ==='pending' &&
                                     <>
                                        <Button
                                               variant='twoTone'
                                               size='xs'
                                               color="emerald-600"
                                               className='col-span-1'
                                               icon={<MdCheckCircle />}
                                               onClick={() => {
                                                openConfirmDialog(`Are you sure you want to Approve ${tariff?.service_name || tariff?.drug_name}`,'info','approve_tariff')
                                                setselectedPAData({Claim:singleClaim, tariff })
                                               }}
                                               >
                                              Approve
                                        </Button>
                                         <Button
                                                variant='twoTone'
                                                size='xs'
                                                color="red-600"
                                                className='col-span-1'
                                                icon={<MdCancel />}
                                                onClick={() => {
                                                  openConfirmDialog(`Are you sure you want to Reject ${tariff?.service_name || tariff?.drug_name}`,'warning','reject_tariff')
                                                  setselectedPAData({Claim:singleClaim, tariff})
                                                 }}
                                                >
                                               Reject
                                         </Button>

                                         <Button
                                                variant='twoTone'
                                                size='xs'
                                                className='col-span-1'
                                                icon={< HiOutlinePencilAlt/>}
                                                onClick={() => {
                                                  setReviewDialog(true)
                                                  setselectedPAData({Claim:singleClaim, tariff})
                                                 }}
                                                >
                                               Review
                                         </Button>

                                          </>
                                          }
                                     </div>
                                     <IconText
                                         className="font-light text-gray-500 heading-text"
                                         icon={<FaRegCommentDots className="text-lg" />}
                                     >
                                        Comment
                                    </IconText>
                                    <p>{tariff?.comment}</p>

                                 </div>
                                 </Card>

                               </>

                                 ))}
                                 <Card className='mb-5'>
                                  <div className='grid grid-cols-2  gap-4'>
                                  <div className='relative col-span-1'>
                                  {/* PA Status */}
                                  <div className=''>
                                    {
                                    singleClaim?.status ==='approved'?
                                      <Tag className='p-0 text-sm font-semibold text-emerald-600 dark:text-emerald-100 border-0'>
                                          Active
                                      </Tag> :
                                    singleClaim?.status ==='denied'?
                                      <Tag className='p-0 text-sm font-semibold text-red-600 border-0'>
                                          Denied
                                      </Tag>:
                                    singleClaim?.status ==='pending'?
                                      <Tag className='p-0 text-sm font-semibold text-amber-600 dark:text-red-100 border-0'>
                                          Pending
                                      </Tag>:
                                    singleClaim?.status ==='partially approved'?
                                      <Tag className='p-0 text-sm font-semibold text-orange-600 dark:text-orange-100 border-0'>
                                          Partially Approved
                                      </Tag>:
                                      <Tag className='text-white bg-red-700 border-0'>
                                          none
                                      </Tag>
                                     }
                                     <p className="font-light heading-text mb-[45px]">Status</p>
                                  </div>
                                  {/* PA Status */}
                                  {/* Approved Amount */}
                                  <p className="absolute bottom-0 left-0 w-full mb-5 font-semibold text-gray-900">
                                  ₦{Number(singleClaim?.approved_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                  <p className="absolute bottom-0 left-0 w-full  font-light text-gray-700">Approved Amount</p>
                                  {/* Approved Amount */}
                                  </div>

                                  <div className='relative col-span-1'>
                                  {singleClaim?.referral_code &&<>
                                  {/* PA Code */}
                                  <p className="font-semibold text-xs text-gray-900">
                                    {singleClaim?.referral_code}
                                  </p>
                                  <p className="font-light text-gray-700 mb-[45px]">PA Code</p>
                                  {/* PA Code */}
                                  </>}

                                  {/* Requested Amount */}
                                  <p className="absolute bottom-0 left-0 w-full mb-5  font-semibold text-gray-900">
                                  ₦{Number(singleClaim?.requested_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                  <p className="absolute bottom-0 left-0 w-full font-light text-gray-700">Requested Amount</p>
                                  {/* Requested Amount */}
                                  </div>
                                  </div>
                                 </Card>

                               <div className='grid grid-cols-2 gap-4'>
                               {singleClaim.status ==='pending' &&<>
                                         <Button
                                               variant='twoTone'
                                               size='sm'
                                               color="emerald-600"
                                               className='col-span-1'
                                               icon={<MdCheckCircle />}
                                               onClick={() => {
                                                onUpdatePA(singleClaim?.id, 'approved');
                                               }}
                                               >
                                              Approve
                                         </Button>
                                         <Button
                                                variant='twoTone'
                                                size='sm'
                                                color="red-600"
                                                className='col-span-1'
                                                icon={<MdCancel />}
                                                onClick={() => {
                                                  onUpdatePA(singleClaim?.id, 'denied');
                                                 }}
                                                >
                                               Reject
                                         </Button></>}
                                 </div>
                               <div className="text-right mt-6">
                                   <Button
                                       className="ltr:mr-2 rtl:ml-2"
                                       variant="plain"
                                       onClick={() => setViewDialog(false)}
                                   >
                                       Cancel
                                   </Button>
                               </div>
                           </div>
                       </div>
                    </Dialog>
                }
               {
                    viewReviewDialog && <Dialog
                       isOpen={viewReviewDialog}
                       onClose={() => setReviewDialog(false)}
                       onRequestClose={() => setReviewDialog(false)}
                       width={450}
                       height={250}
                       style={{
                        content: {
                            marginTop: 250,
                        },
                       }}
                       shouldCloseOnOverlayClick={false}
                       shouldCloseOnEsc={false}
                   >
                        <div className="flex flex-col h-full justify-between">
                            <h5 className="mb-2">Review</h5>
                            <div className="overflow-y-auto">
                                <Formik
                                    initialValues={{
                                        comment: selectedPAData.tariff.comment || null,
                                        approved_price: selectedPAData.tariff.approved_price || '',
                                        approved_quantity: selectedPAData.tariff.approved_quantity || 0,
                                    }}
                                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                                        console.log('Form values:', values);
                                        // setReviewDialog(false)
                                        onReviewPATariff(selectedPAData.Claim.id,values)
                                    }}
                                >
                                    {({ isSubmitting, errors, touched, values }) => (
                                        <Form>
                                          <FormContainer>
                                            <div className='grid grid-cols-2 gap-4 mb-5'>
                                             <Field
                                                  type="number"
                                                  autoComplete="off"
                                                  name="approved_price"
                                                  placeholder="Enter Price"
                                                  component={Input}
                                                  // min="0"
                                                  // step="1"
                                             />
                                             <Field
                                                  type="number"
                                                  autoComplete="off"
                                                  name="approved_quantity"
                                                  placeholder="Enter Quantity"
                                                  component={Input}
                                                  // min="0"
                                                  // step="any"
                                             />
                                             </div>
                                            <Field
                                                  type="txt"
                                                  autoComplete="off"
                                                  name="comment"
                                                  placeholder="Enter Comment"
                                                  component={Input}
                                             />

                                          </FormContainer>
                                            <div className="mt-5 'w-full flex justify-center">
                                                <Button
                                                   type="submit"
                                                   variant="solid"
                                                   size='sm'
                                                   loading={isSubmitting}
                                                   >
                                                {isSubmitting
                                                    ? 'Saving...'
                                                    : 'Review Tariff'}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </Dialog>
                }
                {openPopupDialog &&<ConfirmDialog
                     isOpen={openPopupDialog}
                     type={dialogtype}
                     title={dialogtitle}
                     onClose={handleClose}
                     onRequestClose={handleClose}
                     onCancel={handleClose}
                     onConfirm={handleConfirm}
                   >
                    <p>{dialogtitle}</p>
              </ConfirmDialog>}


  </>
)
}

export default ViewAllNhiaClaims
