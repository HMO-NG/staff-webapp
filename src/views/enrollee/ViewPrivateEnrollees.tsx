import { useNavigate ,Link} from 'react-router-dom'
import type { ColumnDef, OnSortParam, CellContext, Row } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
import type {PrivateEnrollee} from '@/utils/customAuth/usePrivatesAuth'
import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import type { SyntheticEvent } from 'react'
import {
  HiPlus,
  HiDocumentAdd,
  HiOutlineDocumentDownload,
} from 'react-icons/hi'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import useAuthority from '@/utils/hooks/useAuthority'
import { useLocalStorage } from '@/utils/localStorage'
import { Field, Form, Formik,FieldArray } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { AiOutlineEye } from 'react-icons/ai';

// type PrivateEnrollee={
//   id:string
//   first_name:string
//   last_name:string
//   middle_name:string
//   email:string
//   phone_number:string
//   passport_url:string
//   sex:string
//   department:string
//   position:string
//   dob:string
//   beneficiary_type:string
//   family_size:string
//   state:string
//   city:string
//   address:string
//   is_active:boolean
//   company_id:string
//   provider_id:string
//   provider_name:string
//   company_name:string
//   linked_to_user:string
//   enrolled_by:string
// }
const ViewPrivateEnrollees = () => {
      const {useGetCompanyAuth,
             useGetPrivateEnrolleeAuth,
             usegetPrivateEnrolleeByCompanyIdAuth,
             usegetSinglePrivateEnrolleeAuth,
             }=usePrivates()
      const navigate = useNavigate()
      const [data, setData] = useState<PrivateEnrollee[]>([])
      const [loading, setLoading] = useState(false)
      const [selectedRows, setSelectedRows] = useState<string[]>([])
      const [message, setMessage] = useState('')
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
      const [PrivateEnrollee, setPrivateEnrollee] = useState<
          {
            id:string
            first_name:string
            last_name:string
            middle_name:string
            email:string
            phone_number:string
            passport_url:string
            sex:string
            department:string
            position:string
            dob:string
            beneficiary_type:string
            family_size:string
            state:string
            city:string
            address:string
            is_active:boolean
            company_id:string
            provider_id:string
            provider_name:string
            company_name:string
            linked_to_user:string
            enrolled_by:string
          }>({
              id: "",
              first_name: "",
              last_name: "",
              middle_name: "",
              email: "",
              phone_number: "",
              passport_url: "",
              sex: "",
              department: "",
              position: "",
              dob: "",
              beneficiary_type: "",
              family_size: "",
              state: "",
              city: "",
              address: "",
              is_active: false,
              company_id: "",
              provider_id: "",
              provider_name: "",
              company_name: "",
              linked_to_user:"",
              enrolled_by: "",
          })


        const permissionRole = [ 'user']
        const { getItem,setItem,removeItem } = useLocalStorage()

     const onDropdownItemClick = (eventKey: string, e: SyntheticEvent) => {
                console.log('Dropdown Item Clicked', eventKey, e)
      }

    const handleBatchAction = () => {
        console.log('selectedRows', selectedRows)
    }
    const handlePaginationChange = (pageIndex: number) => {
            setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
      }
    const handleSelectChange = (pageSize: number) => {
          setTableData((prevData) => ({ ...prevData, ...{ pageSize } }))
      }
    const handleSort = ({ order, key }: OnSortParam) => {
        setTableData((prevData) => ({
            ...prevData,
            ...{ sort: { order, key } },
        }))
      }
    const handleRowSelect = (checked: boolean, row: PrivateEnrollee) => {
      console.log('row', row)
      if (checked) {
          setSelectedRows((prevData) => {
              if (!prevData.includes(row.company_name)) {
                  return [...prevData, ...[row.company_name]]
              }
              return prevData
          })
      } else {
          setSelectedRows((prevData) => {
              if (prevData.includes(row.company_name)) {
                  return prevData.filter((id) => id !== row.company_name)
              }
              return prevData
          })
      }
      }
    const handleAllRowSelect = (checked: boolean, rows: Row<PrivateEnrollee>[]) => {
          console.log('rows', rows)
          if (checked) {
              const originalRows = rows.map((row) => row.original)
              const selectedIds: string[] = []
              originalRows.forEach((row) => {
                  selectedIds.push(row.company_name)
              })
              setSelectedRows(selectedIds)
          } else {
              setSelectedRows([])
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
     const columns: ColumnDef<PrivateEnrollee>[] = useMemo(() => (
            [
                {
                  header: 'Name',
                  cell:(props)=> `${props.cell.row.original.first_name} ${props.cell.row.original.first_name}`,
                },

                {
                  header: 'email',
                  accessorKey: 'email',
                },
                {
                  header: 'type',
                  accessorKey: 'enrollee_type',
                },

                {
                  header: 'Plan',
                  accessorKey: 'plan_name',
                },
               {
                header: 'Status',
                cell: (props) => (
                    <div>
                        {
                            props.cell.row.original.is_active ?
                                <Tag className='bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0'>
                                    Active
                                </Tag> :
                                <Tag className='text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'>
                                    Inactive
                                </Tag>

                        }
                    </div>
                )
               },

               {
                  header: 'Created At',
                  cell:(props)=> FormatDate(props.cell.row.original.created_at)
              },

               {
                   header: '',
                   id: 'action',
                   cell: (props) => (
                       <div>
                         <Button
                         variant="plain"
                         icon={<AiOutlineEye/>}
                         onClick={() => navigate(`/privates/enrollee/${props.cell.row.original.id}`)}
                         >
                           View Profile</Button>
                       </div>
                   ),
               },


            ]
        ), [])
       useEffect(() => {
            const fetchData = async () => {
                setLoading(true)
                const response = await useGetPrivateEnrolleeAuth()
                if (response.data) {
                    setData(response.data)
                    setLoading(false)
                }
            }
            const fetchData2 = async () => {
              setLoading(true)
              const client_id = getItem('client_id');
              const response = await usegetPrivateEnrolleeByCompanyIdAuth(client_id)
              if (response.data) {
                  setData(response.data)
                  setLoading(false)
              }
          }

            const cid = getItem('admin');
            const authData =JSON.parse(cid.auth);
            console.log('User authoritttty:', authData.user.authority);

               if(authData.user.authority=='client'){
                fetchData2()

               }else if(authData.user.authority=='user'){
                fetchData()
               }
            // fetchData()

        }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query])

  return(

    <>
                <div className="  flex justify-end pb-10">
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/privates/enrollee/add')}
                    icon={<HiPlus />}
                >
                    <span>Create New enrollee</span>
                </Button>
                {selectedRows.length > 0 && (
                <div className="flex justify-end mb-4">
                    <Button
                        size="md"
                        variant="solid"
                        onClick={handleBatchAction}
                    >
                        View registered enrollees
                    </Button>
                </div>
              )}

            </div>
                <DataTable<PrivateEnrollee>
                selectable
                columns={columns}
                data={data}
                loading={loading}
                pagingData={tableData}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />

    </>

  )

}


export default ViewPrivateEnrollees
