import { useNavigate ,Link} from 'react-router-dom'
import type { ColumnDef, OnSortParam, CellContext, Row } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
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

type PrivateEnrollee={
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
}
const ViewPrivateEnrollees = () => {
      const {useGetCompanyAuth,useGetPrivateEnrolleeAuth,usegetPrivateEnrolleeByCompanyIdAuth}=usePrivates()
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

       const [editPrivateEnrollee, setEditPrivateEnrollee] = useState<PrivateEnrollee>({
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
       });
       const [PrivateEnrolleeStatus, setPrivateEnrolleeStatus] = useState<
          {
              id: string;
              is_active: boolean,
              // user_id: string,
              first_name: string,
              last_name: string,
          }>({
              id: "",
              is_active: false,
              // user_id: "",
              first_name: "",
              last_name: "",
          })
        const dropdownItems = [
            { key: 'view', name: 'View' },
            { key: 'edit', name: 'Edit' },
            { key: 'status', name: 'Set Status' },
        ]
        const [editDialog, setEditDialog] = useState(false)
        const [viewDialog, setViewDialog] = useState(false)
        const [statusDialog, setStatusDialog] = useState(false)
        const permissionRole = [ 'user']
        const { getItem,setItem,removeItem } = useLocalStorage()

     const onDropdownItemClick = (eventKey: string, e: SyntheticEvent) => {
                console.log('Dropdown Item Clicked', eventKey, e)
      }
    const handleAction = async (cellProps: CellContext<PrivateEnrollee, unknown>, key: any) => {

        switch (key) {
            case 'view':
                // setCompany(
                //     {
                //         id: cellProps.row.original.id,
                //         company_name: cellProps.row.original.company_name,
                //         business_type: cellProps.row.original.business_type,
                //         company_heaadquaters: cellProps.row.original.company_heaadquaters,
                //         primary_contact_position: cellProps.row.original.primary_contact_position,
                //         primary_contact_email: cellProps.row.original.primary_contact_email,
                //         primary_contact_phonenumber: cellProps.row.original.primary_contact_phonenumber,
                //         user_id: cellProps.row.original.user_id,
                //         enrolled_by: cellProps.row.original.enrolled_by
                //     }
                // )

                setViewDialog(true)
                break;
            case 'edit':

              // setEditPrivateEnrollee(
              //       {
              //           id: cellProps.row.original.id,
              //           company_name: cellProps.row.original.company_name,
              //           enrolled_by: cellProps.row.original.enrolled_by
              //       }
              //   )
                setEditDialog(true)
                break;
            case 'status':
                setPrivateEnrolleeStatus(
                    {
                        id: cellProps.row.original.id,
                        is_active: cellProps.row.original.is_active,
                        first_name: cellProps.row.original.first_name,
                        last_name: cellProps.row.original.last_name,

                    }
                )
                setStatusDialog(true)
                break;
            // ... more cases
            default:
            // Code to execute if expression doesn't match any case
        }
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
     const columns: ColumnDef<PrivateEnrollee>[] = useMemo(() => (
            [
                {
                    header: 'first_name',
                    cell:(props)=> `${props.cell.row.original.first_name} ${props.cell.row.original.first_name}`,
                },

                {
                  header: 'email',
                  accessorKey: 'email',
              },
              {
              header: 'beneficiary_type',
              accessorKey: 'beneficiary_type',
              },
              {
                header: 'family size',
                accessorKey: 'family_size',
                },
                {
                  header: 'company name',
                  accessorKey: 'company_name',
                  },
              {
            header: 'Enrolled by',
            accessorKey: 'enrolled_by',
               },
               {
                header: 'Status',
                cell: (props) => (
                    <div>
                        {
                            props.cell.row.original.is_active ?
                                <Tag className='text-white bg-indigo-600 border-0'>
                                    Active
                                </Tag> :
                                <Tag className='text-white bg-red-700 border-0'>
                                    Inactive
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
                       hbcjccn
                        <Dropdown
                            placement='bottom-end'>

                            {dropdownItems.map((item) => (
                                <Dropdown.Item
                                    key={item.key}
                                    eventKey={item.key}
                                    onSelect={onDropdownItemClick}
                                    onClick={() => handleAction(props, item.key)}
                                >
                                    {item.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
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
             {
                viewDialog && <Dialog
                    isOpen={viewDialog}
                    onClose={() => setViewDialog(false)}
                    onRequestClose={() => setViewDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >
                    <div className="flex flex-col h-full justify-between">


                        <h5 className="mb-4">View Provider</h5>
                        <div className="max-h-96 overflow-y-auto">


                            <div className="prose dark:prose-invert mx-auto">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Field</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td><b>{PrivateEnrollee.first_name}</b></td>
                                        </tr>


                                    </tbody>
                                </table>
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
                editDialog && <Dialog
                    isOpen={editDialog}
                    onClose={() => setEditDialog(false)}
                    onRequestClose={() => setEditDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >
                    <div className="flex flex-col h-full justify-between">


                        <h5 className="mb-4">Edit Provider</h5>
                        <div className="max-h-96 overflow-y-auto">

                            <div className="prose dark:prose-invert mx-auto">
                                <Formik
                                    initialValues={{
                                        id: editPrivateEnrollee.id,
                                        company_name: editPrivateEnrollee.company_name,
                                        email: editPrivateEnrollee.email,
                                        address: editPrivateEnrollee.address,
                                        phone_number: editPrivateEnrollee.phone_number,


                                    }}
                                    onSubmit={(values, { resetForm, setSubmitting }) => {
                                        // updateProvider(values)
                                    }
                                    }

                                >
                                    {({ touched, errors, resetForm }) => (
                                        <Form>
                                            <FormContainer>
                                                {/* Name */}
                                                <FormItem
                                                    label="Name"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="name"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* Email */}
                                                <FormItem
                                                    label="Email"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="email"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* Address */}
                                                <FormItem
                                                    label="Address"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="address"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* phone number */}
                                                <FormItem
                                                    label="Phone Number"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="phone_number"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* Medical Director's Name */}
                                                <FormItem
                                                    label="Medical Director's Name"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="medical_director_name"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/*medical_director_phone_no*/}
                                                <FormItem
                                                    label="Medical Director's Phone No."
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="medical_director_phone_no"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* state */}
                                                <FormItem
                                                    label="State"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="state"
                                                        component={Input}
                                                    />
                                                </FormItem>

                                                <FormItem>
                                                    <Button variant="solid" type="submit">
                                                        SAVE
                                                    </Button>
                                                </FormItem>
                                            </FormContainer>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                            <div className="text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    onClick={() => setEditDialog(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog >
            }
            {
                statusDialog && <Dialog
                    isOpen={statusDialog}
                    onClose={() => setStatusDialog(false)}
                    onRequestClose={() => setStatusDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >

                    <h5 className="mb-4">Set Provider Status</h5>
                    <p>
                        {PrivateEnrolleeStatus.is_active ?
                            `Deactivate ${PrivateEnrolleeStatus.first_name} '' ${PrivateEnrolleeStatus.last_name}` :
                            `Activate ${PrivateEnrolleeStatus.first_name} '' ${PrivateEnrolleeStatus.last_name}`
                        }
                    </p>
                    <div className="text-right mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={() => setStatusDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="solid" >
                            Okay
                        </Button>
                    </div>

                </Dialog >
            }
    </>

  )

}


export default ViewPrivateEnrollees
