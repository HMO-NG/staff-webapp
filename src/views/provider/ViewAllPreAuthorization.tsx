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
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Drawer from '@/components/ui/Drawer'

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
};
type DialogTypeKey = 'info' | 'success' | 'warning' | 'danger'
type dialogContentType='reject_tariff'|'approve_tariff'|undefined

type DialogType = Record<DialogTypeKey, {
    type: 'info' | 'success' | 'warning' | 'danger'
    title: string
    children: string
    cancelText: string
    confirmText: string
    confirmButtonColor: string
}>
const ViewAllPARequest =()=>{
    const {
    usegetAllpreauthorizationRequestAuth,
    usegetSinglePreAuthorizationByIdAuth,
    useUpdatePreAuthorizationAuth,
     } = useProvider()
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
    const [singlePA,setSinglePA]=useState<PAType>()
    const [openPopupDialog, setOpenPopupDialog] = useState(false)
    const [updatePA, setUpdatePA] = useState(false)
    const [selectedPAData, setselectedPAData] = useState<{id:string,tariff:pa_tariffs}>(
      {id:'',
       tariff:defaultTariff})
    const [dialogtitle, setdialogtitle] = useState('')
    const [dialogtype, setdialogtype] = useState<DialogTypeKey>('info')
    const [dialogContentType, setdialogContentType] = useState<dialogContentType>(undefined)



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
        setOpenPopupDialog(false)
    }

    const handleConfirm = () => {

        switch(dialogContentType){
          case 'approve_tariff':
            onUpdatePATariff(selectedPAData.id, 'approved', selectedPAData.tariff);
          case 'reject_tariff':
            onUpdatePATariff(selectedPAData.id, 'denied', selectedPAData.tariff);
            default:  console.log('Confirm')
        }
        setOpenPopupDialog(false)
        setUpdatePA(true)
    }
    const openConfirmDialog =(msg:string,dialogType:'info' | 'success' | 'warning' | 'danger',content_type:dialogContentType)=>{
      setOpenPopupDialog(true)
      setdialogtitle(msg)
      setdialogtype(dialogType)
      setdialogContentType(content_type)
      return true

    }

    const handleView = async(props: CellContext<PAType, unknown>) => {
        const row = props.row.original
        const id = row.id
        const response = await usegetSinglePreAuthorizationByIdAuth(id)
        if (response.data) {
            setSinglePA(response.data)
            setViewDialog(true)
        } else {
          openNotification('Error fetching data', 'danger')

        }
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
              accessorKey: 'provider_name',
            },
            {
                header: 'Enrollee',
                accessorKey: 'enrollee_name',
            },
            {
                header: 'Plan',
                accessorKey: 'enrolee_plan_name',
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
                                <Tag className='text-white bg-red-700 border-0'>
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

    // const onUpdatePA=async()=>{
    //   const response = await  useUpdatePreAuthorizationAuth(id,data)
    //   if (response) {
    //     setTimeout(() => {
    //        if (response.status=="success"){
    //         openNotification(response.message,'success')
    //        }
    //        else if (response.status=="failed"){
    //         openNotification(response.message,"danger")
    //        }
    //     }, 3000)


    // }
    // }
    function determinePAStatus(tariffs: pa_tariffs[]): "pending"|'approved'| 'denied'|'partially approved' {
      const statuses = tariffs.map(t => t.status);

      const hasPending = statuses.includes('pending');
      const hasApproved = statuses.includes('approved');
      const hasDenied = statuses.includes('denied');

      if (hasPending) return 'pending';
      if (hasApproved && hasDenied) return 'partially approved';
      if (hasApproved) return 'approved';
      return 'denied'; // if only denied tariffs
    }
    const onUpdatePATariff=async(PA_ID:any,new_status:"pending" | "approved" | "denied",tariff:pa_tariffs)=>{
      tariff.status=new_status
      const updatedTariffs = (singlePA?.selected_tariffs || []).map((item: pa_tariffs) => {
        if (item.id === tariff.id) {
          return {
            ...item,
            approved_quantity: tariff.quantity,
            approved_price: tariff.item_price,
            status: new_status
          };
        }
        return item;
      });
      const new_PA_status =determinePAStatus(singlePA?.selected_tariffs || [])
      const response = await  useUpdatePreAuthorizationAuth(PA_ID,
        {
          selected_tariffs:JSON.stringify(updatedTariffs),
          status:new_PA_status
        })

      // console.log(tariff)

      if (response) {
        setTimeout(() => {
           if (response.status=="success"){
            openNotification(response.message,'success')
           }
           else if (response.status=="failed"){
            openNotification(response.message,"danger")
           }
        }, 3000)


    };

    }

    useEffect(()=>{

      const fetchData = async () => {
        setLoading(true)
        const response= await usegetAllpreauthorizationRequestAuth()
        if (response.data) {
            setData(response.data)
            setLoading(false)
        }
    }
    fetchData()
    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query])

return(
  <>
              <DataTable<PAType>
                  selectable
                  columns={columns}
                  data={data}
                  loading={loading}
                  pagingData={tableData}
                  // onPaginationChange={handlePaginationChange}
                  // onSelectChange={handleSelectChange}
                  // onSort={handleSort}
                  // onCheckBoxChange={handleRowSelect}
                  // onIndeterminateCheckBoxChange={handleAllRowSelect}
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


                           <h5 className="mb-4">View PA</h5>
                           <div className="overflow-y-auto">

                               <div className="grid grid-cols-2 gap-6 p-4 rounded-xl">
                                 <div className="space-y-2">
                                   <p className="font-light text-gray-700">Enrollee: <span className="font-semibold text-gray-900">{singlePA?.enrollee_name}</span></p>
                                   <p className="font-light text-gray-700">Date Created: <span className="font-semibold text-gray-900">{singlePA?.created_at}</span></p>
                                   <p className="font-light text-gray-700">Plan: <span className="font-semibold text-gray-900">{singlePA?.enrolee_plan_name}</span></p>
                                   <p className="font-light text-gray-700">Diagnosis: <span className="font-semibold text-gray-900">{singlePA?.diagnosis}</span></p>
                                 </div>
                                 <div className="space-y-2">
                                   <p className="font-light text-gray-700">Provider: <span className="font-semibold text-gray-900">{singlePA?.provider_name}</span></p>
                                   <p className="font-light text-gray-700">Provider Code: <span className="font-semibold text-gray-900">{singlePA?.provider_code}</span></p>
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
                                    // { label: "Tariff Price", value: `₦${tariff?.item_price}` },
                                    { label: "Tariff Price", value: `₦${Number(tariff?.item_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                                    { label: "Requested Quantity", value: `x${tariff?.quantity}`},
                                    { label: "Approved Quantity", value: `x${tariff?.approved_quantity}`},
                                    { label: "Approved Price", value:  `₦${Number(tariff?.approved_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    // { label: "comment", value: tariff?.comment},
                                    { label: "Total", value: `₦${Number(tariff?.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`},
                                    ].map((item) => (
                                    <div key={item.label} className="flex justify-between w-full">
                                      <p className="font-light text-gray-500 heading-text ">{item.label}:</p>
                                      <p className="text-right font-semibold text-gray-900">{item.value || "-"}</p>
                                    </div>
                                  ))}
                                    <div className='grid grid-cols-3 gap-4'>
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
                                     {tariff.status ==='pending' &&<>
                                        <Button
                                               variant='twoTone'
                                               size='sm'
                                               color="emerald-600"
                                               className='col-span-1'
                                               icon={<MdCheckCircle />}
                                               onClick={() => {
                                                openConfirmDialog(`Are you sure you want to Approve ${tariff?.item_name}`,'info','approve_tariff')
                                                setselectedPAData({ id: singlePA.id, tariff })
                                               }}
                                               >
                                              Approve
                                        </Button>
                                         <Button
                                                variant='twoTone'
                                                size='sm'
                                                color="red-600"
                                                className='col-span-1'
                                                // icon={<FaTimes />}
                                                icon={<MdCancel />}
                                                onClick={() => {
                                                  openConfirmDialog(`Are you sure you want to Reject ${tariff?.item_name}`,'warning','reject_tariff')
                                                  setselectedPAData({ id: singlePA.id, tariff })
                                                 }}
                                                >
                                               Reject
                                         </Button> </>}
                                     </div>

                                 </div>
                                 </Card>

                               </>

                                 ))}
                                 <Card className='mb-5'>
                                  <div className='grid grid-cols-2 gap-4'>
                                  <div className='col-span-1'>
                                  <p className="font-semibold text-gray-900">
                                  ₦{Number(singlePA?.approved_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                  <p className="font-light text-gray-700">Approved Amount</p>
                                  </div>
                                  <div className='col-span-1'>
                                  <p className="font-semibold text-gray-900">
                                  ₦{Number(singlePA?.requested_total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                  <p className="font-light text-gray-700">Requested Amount</p>
                                  </div>
                                  </div>

                                 </Card>

                               <div className='grid grid-cols-2 gap-4'>
                                    {/* <div className='col-span-1'>

                                     </div> */}
                                        <Button
                                               variant='twoTone'
                                               size='sm'
                                               color="emerald-600"
                                               className='col-span-1'
                                              //  icon={<FaCheck />}
                                               icon={<MdCheckCircle />}
                                               >
                                              Approve
                                           </Button>
                                         <Button
                                                variant='twoTone'
                                                size='sm'
                                                color="red-600"
                                                className='col-span-1'
                                                // icon={<FaTimes />}
                                                icon={<MdCancel />}
                                                >
                                               Reject
                                         </Button>
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
                {openPopupDialog &&<ConfirmDialog
                     isOpen={openPopupDialog}
                     type={dialogtype}
                     title={dialogtitle}
                     //confirmButtonColor={dialogType[selected].confirmButtonColor}
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

export default ViewAllPARequest
