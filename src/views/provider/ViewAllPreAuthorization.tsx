import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {PAType} from '@/utils/customAuth/useProviderAuth'
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
import { FaRegCommentDots,FaMoneyCheckAlt,FaNotesMedical ,FaFileMedical} from 'react-icons/fa';

import { useNavigate,useParams } from 'react-router-dom'
import { HiOutlinePencilAlt } from 'react-icons/hi'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FieldArray } from 'formik'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import IconText from '@/components/shared/IconText'

type pa_tariffs={
  id?:string
  quantity?:number
  approved_quantity?:number
  item_name?:string
  item_price?:string
  approved_price?:string
  status?:"pending" | "approved" | "denied"
  comment?:string| null;
  total_price?:number
  approved_total?:number
}
const defaultTariff: pa_tariffs = {
  id: '',
  quantity: 1,
  approved_quantity:0,
  item_name: "",
  item_price: "",
  approved_price: "",
  status: "pending",
  comment: null,
  total_price:0,
  approved_total:0
};
const defaultPA: PAType = {
             id: '',
             diagnosis: '',
             selected_tariffs: [{}],
             approved_price: '',
             requested_total_price: '',
             provider_comment: '',
             pa_code: '',
             status: 'pending',
             is_claimed: false,
             created_at: '',
             created_by: '',

             enrollee: {
               id: '',
               name: '',
               plan_name: '',
             },

             provider: {
               id: '',
               name: '',
               code: '',
             },
};
type DialogTypeKey = 'info' | 'success' | 'warning' | 'danger'
type dialogContentType='reject_tariff'|'approve_tariff'|'approve_PA'|undefined

const ViewAllPARequest =()=>{
    const {
    usegetAllpreauthorizationRequestAuth,
    usegetSinglePreAuthorizationByIdAuth,
    useUpdatePreAuthorizationAuth,
     } = useProvider()
    const navigate = useNavigate()
    const {pa_id}=useParams();
    const [data, setData] = useState<PAType[]>([])
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
    const [singlePA,setSinglePA]=useState<PAType>(defaultPA)
    const [openPopupDialog, setOpenPopupDialog] = useState(false)
    const [viewReviewDialog, setReviewDialog] = useState(false)
    const [commentDialog, setCommentDialog] = useState(false)
    const [selectedPAData, setselectedPAData] = useState<{PA:PAType,tariff:pa_tariffs}>(
      {PA:defaultPA,
       tariff:defaultTariff})
    const [dialogtitle, setdialogtitle] = useState('')
    const [dialogtype, setdialogtype] = useState<DialogTypeKey>('info')
    const [dialogContentType, setdialogContentType] = useState<dialogContentType>(undefined)
    const confirmResolver = useRef<(value: boolean) => void>();



    const getAllPa = async () => {
      setLoading(true)
      const response= await usegetAllpreauthorizationRequestAuth()
      if (response.data) {
          setData(response.data)
          setLoading(false)
      }
    }
    const getSinglePA=async (id:string) => {
      const response = await usegetSinglePreAuthorizationByIdAuth(id)
      if (response.data) {
          setSinglePA(response.data)
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
            onUpdatePATariff(selectedPAData.PA.id, 'approved', selectedPAData.tariff);

            break;
          case 'reject_tariff':
            onUpdatePATariff(selectedPAData.PA.id, 'denied', selectedPAData.tariff);

            break;
          case 'approve_PA':
            setselectedPAData({PA:singlePA , tariff:defaultTariff})


            break;
           default:
            console.log('Confirm')

        }
        setOpenPopupDialog(false)

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

    const handleView = async(props: CellContext<PAType, unknown>) => {
        const row = props.row.original
        const id = row.id
        getSinglePA(id)
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

    const columns: ColumnDef<PAType>[] = useMemo(() => (
        [
            {
              header: 'Provider',
              accessorKey: 'provider.name',
            },
            {
                header: 'Enrollee',
                accessorKey: 'enrollee.name',
            },
            {
                header: 'Plan',
                accessorKey: 'enrollee.plan_name',
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
                    <div>{
                      props.cell.row.original.is_claimed === true ?(
                      <Button
                      variant="plain"
                      icon={<FaFileMedical/>}
                      >
                        Claimed</Button>):props.cell.row.original.is_claimed ===false ?(
                          <Button
                             variant="plain"
                             icon={<FaFileMedical/>}
                             onClick={() => navigate(`/privates/claim/create/${props.cell.row.original.id}`) }
                             >
                        Convert to claim</Button>):(<p>none</p>)

                        }


                    </div>
                ),
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

      let updatedTariffs: pa_tariffs[] = [];
      if (updateType === 'all') {
        updatedTariffs = (singlePA?.selected_tariffs || []).map((item: pa_tariffs) => ({
          ...item,
          approved_quantity: item.quantity,
          approved_price: item.item_price,
          status: new_status,
        }));
    }else if (updateType === 'pending') {
      updatedTariffs = (singlePA?.selected_tariffs || []).map((tariff: pa_tariffs) =>{
        if(tariff.status === 'pending'){
          const approved_quantity = Number(tariff.quantity) || 0;
          const approved_price = Number(tariff.item_price) || 0;
          const approved_total = parseFloat((approved_quantity * approved_price).toFixed(2));
          return {
            ...tariff,
            approved_quantity: tariff.quantity,
            approved_price: tariff.item_price,
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
    const onUpdatePA=async(PA_ID:any,new_status:"pending"|'approved'| 'denied'|'partially approved')=>{
      let main_status = new_status === "approved"
      ? "approve"
      : new_status === "denied"
        ? "deny"
        : "none";
      const new_PA_status =determinePAStatus(singlePA?.selected_tariffs || [])
      const PACode = CreatePACode(singlePA)
      let request_data:{
        status: "pending" | "approved" | "denied" | "partially approved";
        pa_code: string;
        selected_tariffs?: string;
        approved_price?: string;
        provider_comment?: string;
      } = {
         status: new_status,
         pa_code:PACode,
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
         const selected_tariffs=await ChangeStatusOfAllTariff(new_tariff_status,'pending')
         const totalTariffAmount = (selected_tariffs || []).reduce((total:number, tariff:pa_tariffs) => {
          const price: number = Number(tariff.approved_price) ||0;
          const quantity: number = Number(tariff.approved_quantity) ||0;
          const totalprice=total + (price * quantity);
          request_data.approved_price=(totalprice).toFixed(2);
          // newammm=totalprice
          return totalprice
          // return total + (price * quantity);
        }, 0);
         request_data.selected_tariffs=JSON.stringify(selected_tariffs)
        //  request_data.approved_price=totalTariffAmount
      }
    }
    let newammm
    // if (new_PA_status === 'approved' || new_PA_status === 'partially approved') {
    //   const totalTariffAmount = (singlePA?.selected_tariffs || []).reduce((total:number, tariff:pa_tariffs) => {
    //     const price: number = Number(tariff.approved_price) ||0;
    //     const quantity: number = Number(tariff.approved_quantity) ||0;
    //     const totalprice=total + (price * quantity);
    //     request_data.approved_price=(totalprice).toFixed(2);
    //     newammm=totalprice
    //     return totalprice
    //     // return total + (price * quantity);
    //   }, 0);
      // if (!isNaN(totalTariffAmount)) {
      //   request_data.approved_price = totalTariffAmount.toFixed(2);
      // }
    // }
    // console.log('hjj',newammm)
    // console.log(PA_ID,request_data)

     const response = await  useUpdatePreAuthorizationAuth(PA_ID,request_data)

      if (response) {
        setTimeout(() => {
           if (response.status=="success"){
            getAllPa()
            getSinglePA(PA_ID)
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
    function determinePAStatus(tariffs: pa_tariffs[]): "pending"|'approved'| 'denied'|'partially approved'|'only denied' {
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
    const CreatePACode=(pa_data:PAType)=>{
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month and pad with leading zero
      const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero

        const initials= pa_data.created_by
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');


      return `PA4LG/${day}/${month}/${year}/${initials}/${pa_data.id}`;
    }
    const onUpdatePATariff=async(PA_ID:any,new_status:"pending" | "approved" | "denied",tariff:pa_tariffs)=>{
      const updatedTariffs = (singlePA?.selected_tariffs || []).map((item: pa_tariffs) => {
        if (item.id === tariff.id) {
          const approved_quantity = Number(tariff.approved_quantity) || 0;
          const approved_price = Number(tariff.approved_price) || 0;
          const approved_total = parseFloat((approved_quantity * approved_price).toFixed(2))
          return {
            ...item,
            approved_quantity: tariff.quantity,
            approved_price: tariff.item_price,
            status: new_status,
            approved_total:approved_total,
          };
        }
        return item;
      });
      const response = await  useUpdatePreAuthorizationAuth(PA_ID,{
          selected_tariffs:JSON.stringify(updatedTariffs),
      })


      if (response) {
        setTimeout(() => {
           if (response.status=="success"){
            getSinglePA(PA_ID)
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
      const updatedTariffs = (singlePA?.selected_tariffs || []).map((item: pa_tariffs) => {
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
      const response = await  useUpdatePreAuthorizationAuth(PA_ID,{
          selected_tariffs:JSON.stringify(updatedTariffs),
      })
      if (response) {
        setTimeout(() => {
           if (response.status=="success"){
            openNotification(response.message,'success')
            setReviewDialog(false)
            // getAllPa()
            getSinglePA(PA_ID)
           }
           else if (response.status=="failed"){
            openNotification(response.message,"danger")
           }
        }, 3000)


    }}
        const onAddComment=async(PA_ID:any,data:any)=>{
      

      const response = await  useUpdatePreAuthorizationAuth(PA_ID,data)
      if (response) {
        setTimeout(() => {
           if (response.status=="success"){
            openNotification(response.message,'success')
            setCommentDialog(false)
            getSinglePA(PA_ID)
           }
           else if (response.status=="failed"){
            openNotification(response.message,"danger")
           }
        }, 3000)


    }}

    useEffect(()=>{
    getAllPa()
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query])

return(
  <>
  <h5 className='mb-10'>View All PA</h5>
              <DataTable<PAType>
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


                           <h5 className="mb-0">View PA</h5>
                           <div className="overflow-y-auto">

                               <div className="grid grid-cols-2 gap-6 p-4 rounded-xl">
                                 <div className="space-y-2">
                                   <p className="font-light text-gray-700">Enrollee: <span className="font-semibold text-gray-900">{singlePA?.enrollee.name}</span></p>
                                   <p className="font-light text-gray-700">Date Created: <span className="font-semibold text-gray-900">{singlePA?.created_at}</span></p>
                                   <p className="font-light text-gray-700">Plan: <span className="font-semibold text-gray-900">{singlePA?.enrollee.plan_name}</span></p>
                                   <p className="font-light text-gray-700">Diagnosis: <span className="font-semibold text-gray-900">{singlePA?.diagnosis}</span></p>
                                 </div>
                                 <div className="space-y-2">
                                   <p className="font-light text-gray-700">Provider: <span className="font-semibold text-gray-900">{singlePA?.provider.name}</span></p>
                                   <p className="font-light text-gray-700">Provider Code: <span className="font-semibold text-gray-900">{singlePA?.provider.code}</span></p>
                                 </div>
                               </div>
                               {Array.isArray(singlePA?.selected_tariffs) &&

                               singlePA?.selected_tariffs?.map((tariff:pa_tariffs, index) => (
                                <>
                                <Card
                                className='mb-5'
                                header={tariff?.item_name}
                                >
                               <div className="space-y-2 mb-4">
                                    {[
                                    { label: "Tariff Price", value: `₦${Number(tariff?.item_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                                    { label: "Requested Quantity", value: `x${tariff?.quantity}`},
                                    { label: "Approved Quantity", value: `x${tariff?.approved_quantity}`},
                                    { label: "Approved Price", value:  `₦${Number(tariff?.approved_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    { label: "Total", value: `₦${Number(tariff?.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    { label: "Approved Total", value: `₦${Number(tariff?.approved_total ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    ].map((item) => (
                                    <div key={item.label} className="flex justify-between w-full">
                                      <p className="font-light text-gray-500 heading-text ">{item.label}:</p>
                                      <p className="text-right font-semibold text-gray-900">{item.value || "-"}</p>
                                    </div>
                                  ))}
                                    <div className='grid grid-cols-4 gap-4'>
                                    <div className='col-span-1'>
                                    {
                                    tariff.status ==='approved'?
                                      <Tag className='p-0 text-sm text-emerald-600 dark:text-emerald-100 border-0'>
                                          Active
                                      </Tag> :
                                    tariff.status ==='denied'?
                                      <Tag className='p-0 text-sm text-red-600 border-0'>
                                          Denied
                                      </Tag>:
                                    tariff.status ==='pending'?
                                      <Tag className='p-0 text-sm text-amber-600 dark:text-red-100 border-0'>
                                          Pending
                                      </Tag>:
                                      <Tag className='text-white bg-red-700 border-0'>
                                          none
                                      </Tag>
                                     }
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
                                                openConfirmDialog(`Are you sure you want to Approve ${tariff?.item_name}`,'info','approve_tariff')
                                                setselectedPAData({PA:singlePA, tariff })
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
                                                  openConfirmDialog(`Are you sure you want to Reject ${tariff?.item_name}`,'warning','reject_tariff')
                                                  setselectedPAData({PA:singlePA, tariff})
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
                                                  setselectedPAData({PA:singlePA, tariff})
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
                                    singlePA?.status ==='approved'?
                                      <Tag className='p-0 text-sm font-semibold text-emerald-600 dark:text-emerald-100 border-0'>
                                          Active
                                      </Tag> :
                                    singlePA?.status ==='denied'?
                                      <Tag className='p-0 text-sm font-semibold text-red-600 border-0'>
                                          Denied
                                      </Tag>:
                                    singlePA?.status ==='pending'?
                                      <Tag className='p-0 text-sm font-semibold text-amber-600 dark:text-red-100 border-0'>
                                          Pending
                                      </Tag>:
                                    singlePA?.status ==='partially approved'?
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
                                  ₦{Number(singlePA?.approved_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                  <p className="absolute bottom-0 left-0 w-full  font-light text-gray-700">Approved Amount</p>
                                  {/* Approved Amount */}
                                  </div>

                                  <div className='relative col-span-1'>
                                  {singlePA?.pa_code &&<>
                                  {/* PA Code */}
                                  <p className="font-semibold text-xs text-gray-900">
                                    {singlePA?.pa_code}
                                  </p>
                                  <p className="font-light text-gray-700 mb-[45px]">PA Code</p>
                                  {/* PA Code */}
                                  </>}

                                  {/* Requested Amount */}
                                  <p className="absolute bottom-0 left-0 w-full mb-5  font-semibold text-gray-900">
                                  ₦{Number(singlePA?.requested_total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                  <p className="absolute bottom-0 left-0 w-full font-light text-gray-700">Requested Amount</p>
                                  {/* Requested Amount */}
                                  </div>
                                  </div>
                                 </Card>

                               <div className='grid grid-cols-2 gap-4'>
                               {singlePA.status ==='pending' &&<>
                                         <Button
                                               variant='twoTone'
                                               size='sm'
                                               color="emerald-600"
                                               className='col-span-1'
                                               icon={<MdCheckCircle />}
                                               onClick={() => {
                                                onUpdatePA(singlePA?.id, 'approved');
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
                                                  onUpdatePA(singlePA?.id, 'denied');
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
                                        onReviewPATariff(selectedPAData.PA.id,values)
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

              {
                    commentDialog && <Dialog
                       isOpen={commentDialog}
                       onClose={() => setCommentDialog(false)}
                       onRequestClose={() => setCommentDialog(false)}
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
                            <h5 className="mb-2">Add Comment</h5>
                            <div className="overflow-y-auto">
                                <Formik
                                    initialValues={{
                                        comment: selectedPAData.PA.provider_comment || null,
                                    }}
                                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                                        console.log('Form values:', values);
                                        // setReviewDialog(false)
                                        onAddComment(selectedPAData.PA.id,values)
                                    }}
                                >
                                    {({ isSubmitting, errors, touched, values }) => (
                                        <Form>
                                          <FormContainer>
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


  </>
)
}

export default ViewAllPARequest
