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
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { Field, Form, Formik } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'
import type {PrivateEnrollee,PrivateCompany} from '@/utils/customAuth/usePrivatesAuth'



const ViewClients = () => {
      const {useGetCompanyAuth,
             updateClientStatusAuth,
             updateClientAuth,
             usegetPrivateEnrolleeByCompanyIdAuth,
             useGetCompanyByIdAuth,
            }=usePrivates()
      const navigate = useNavigate()
      const [data, setData] = useState<PrivateCompany[]>([])
      const [data2, setData2] = useState<PrivateEnrollee[]>([])
      const [singleClientData, setSingleClientData] = useState<PrivateCompany>()
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
      const [company, setCompany] = useState<
          {
            id: string
            company_name: string
            business_type: string
            company_heaadquaters: string
            primary_contact_position: string
            primary_contact_email: string
            primary_contact_phonenumber:string
            user_id:string
            enrolled_by:string
          }>({
              id: "",
              company_name: "",
              business_type: "",
              company_heaadquaters: "",
              primary_contact_position: "",
              primary_contact_email: "",
              primary_contact_phonenumber: "",
              user_id: "",
              enrolled_by: "",
          })

       const [editCompany, setEditCompany] = useState<
          {
            id: string
            company_name: string
            business_type: string
            company_headquarters: string
            primary_contact_position: string
            primary_contact_email: string
            primary_contact_phonenumber:string
            user_id:string
            enrolled_by:string
          }>({
            id: "",
            company_name: "",
            business_type: "",
            company_headquarters: "",
            primary_contact_position: "",
            primary_contact_email: "",
            primary_contact_phonenumber: "",
            user_id: "",
            enrolled_by: "",
          })
       const [CompanyStatus, setCompanyStatus] = useState<
          {
              id: string;
              is_active: boolean,
              user_id: string,
              company_name: string,
          }>({
              id: "",
              is_active: false,
              user_id: "",
              company_name: "",
          })
          const [ClientEnrolleeCount, setClientEnrolleeCount] = useState<number | undefined>(undefined)

        const dropdownItems = [
            { key: 'view', name: 'View' },
            { key: 'view_enrollees', name: 'View Enrollees' },
            { key: 'edit', name: 'Edit' },
            { key: 'status', name: 'Set Status' },
        ]
        const [editDialog, setEditDialog] = useState(false)
        const [viewEnrolleesDialog, setViewEnrolleesDialog] = useState(false)
        const [viewDialog, setViewDialog] = useState(false)
        const [statusDialog, setStatusDialog] = useState(false)
     const onDropdownItemClick = (eventKey: string, e: SyntheticEvent) => {
                console.log('Dropdown Item Clicked', eventKey, e)
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
    const handleAction = async (cellProps: CellContext<PrivateCompany, unknown>,key: any) => {

        switch (key) {
            case 'view_enrollees':
              const response = await usegetPrivateEnrolleeByCompanyIdAuth(cellProps.row.original.id)
                setClientEnrolleeCount(response.count)
                if (response.data){
                  setData2(response.data)
                }


                setViewEnrolleesDialog(true)
                break;
            case 'view':
              const clientData = await useGetCompanyByIdAuth(cellProps.row.original.id)
                if (clientData.status === 'success'){
                  setSingleClientData(clientData.data)
                }else if (clientData.status === 'failed'){
                  openNotification(clientData.message,'danger')
                }


                setViewDialog(true)
                break;
            case 'edit':

                setEditCompany(
                    {
                        id: cellProps.row.original.id,
                        company_name: cellProps.row.original.company_name,
                        business_type: cellProps.row.original.business_type,
                        company_headquarters: cellProps.row.original.company_headquarters,
                        primary_contact_position: cellProps.row.original.primary_contact_position,
                        primary_contact_email: cellProps.row.original.primary_contact_email,
                        primary_contact_phonenumber: cellProps.row.original.primary_contact_phonenumber,
                        user_id: cellProps.row.original.user_id,
                        enrolled_by: cellProps.row.original.enrolled_by
                    }
                )
                setEditDialog(true)
                break;
            case 'status':
                setCompanyStatus(
                    {
                        id: cellProps.row.original.id,
                        is_active: cellProps.row.original.is_active,
                        company_name: cellProps.row.original.company_name,
                        user_id: cellProps.row.original.user_id,

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
    const handleRowSelect = (checked: boolean, row: PrivateCompany) => {
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
    const handleAllRowSelect = (checked: boolean, rows: Row<PrivateCompany>[]) => {
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
      const handleRowSelect2 = (checked: boolean, row: PrivateEnrollee) => {
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
      const handleAllRowSelect2 = (checked: boolean, rows: Row<PrivateEnrollee>[]) => {
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
     const columns: ColumnDef<PrivateCompany>[] = useMemo(() => (
            [
                {
                    header: 'Company Name',
                    accessorKey: 'company_name',
                },
                {
                    header: 'Business Type',
                    accessorKey: 'business_type',
                },
                {
                    header: 'Company Address',
                    accessorKey: 'company_headquarters',
                },

                {
                  header: 'Primary Contact Position',
                  accessorKey: 'primary_contact_position',
              },
              {
                header: 'Primary Contact Email',
                accessorKey: 'primary_contact_email',
              },
              {
              header: 'Primary Contact Phonenumber',
              accessorKey: 'primary_contact_phonenumber',
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
     const enrollee_columns: ColumnDef<PrivateEnrollee>[] = useMemo(() => (
          [
              {
                  header: 'first_name',
                  accessorKey: 'first_name',
              },
              {
                  header: 'last_name',
                  accessorKey: 'last_name',
              },
              {
                  header: 'beneficiary_type',
                  accessorKey: 'beneficiary_type',
              },

              {
                header: 'family_size',
                accessorKey: 'family_size',
              },

              {
                 header: 'Enrolled by',
                 accessorKey: 'enrolled_by',
              },

             {
              header: '',
              id: 'action',
              cell: (props) => (
                  <div>
                 { (props.cell.row.original.is_active == false && props.cell.row.original.linked_to_user==null)?
               ( <Button size="xs" variant="twoTone" color="red-600" >
                 no Profile
                </Button>):
                ( <Button size="xs" variant="solid"
                   onClick={() => navigate(`/privates/enrollee/${props.cell.row.original.id}`)}
                  >
                 Go to Profile
                </Button>)}
                  </div>
              ),
          },


          ]
      ), [])
        const toastNotification = (
          <Notification title="Message">
              {message}
          </Notification>
      )

      function openNotification2() {
          toast.push(toastNotification)
      }
        const updateClient = async (data: any,id:string) => {
          const result = await updateClientAuth(data,id)

          setMessage(result.message)
          setEditDialog(false)

          if (result.message) {
              setTimeout(() => {
                  openNotification(result.message,'success')
              },
                  3000
              )

          }



      }
        async function updateClientStatus(data: any,clientId: string) {

          let status;

          if (data.is_active) {
              status = false
          } else {
              status = true
          }

          data.is_active = status;

          const response = await updateClientStatusAuth({is_active:data.is_active},clientId)

          if (response) {
              setStatusDialog(false)
              window.location.reload()
          }

      }
       useEffect(() => {
            const fetchData = async () => {
                setLoading(true)
                const response = await useGetCompanyAuth()
                if (response.data) {
                    setData(response.data)
                    setLoading(false)

                }
            }
            fetchData()

        }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query])

  return(

    <>

                <div className="  flex justify-end pb-10">
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/privates/enrollee/companyinfo')}
                    icon={<HiPlus />}
                >
                    <span>Add Client</span>
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
               <DataTable<PrivateCompany>
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
                viewEnrolleesDialog && <Dialog
                    isOpen={viewEnrolleesDialog}
                    onClose={() => setViewEnrolleesDialog(false)}
                    onRequestClose={() => setViewEnrolleesDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >
                    <div className="flex flex-col h-full justify-between">


                        <h5 className="mb-4">View Enrollee Under Client </h5>
                        <div className="max-h-96 overflow-y-auto">
           {(ClientEnrolleeCount===0)?(<p>no enrollees</p>):(
                        <DataTable<PrivateEnrollee>
                            columns={enrollee_columns}
                            data={data2}
                            loading={loading}
                            // pagingData={tableData}
                            onPaginationChange={handlePaginationChange}
                            onSelectChange={handleSelectChange}
                            onSort={handleSort}
                            onCheckBoxChange={handleRowSelect2}
                            onIndeterminateCheckBoxChange={handleAllRowSelect2}
                           />)}

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
                viewDialog && <Dialog
                    isOpen={viewDialog}
                    onClose={() => setViewDialog(false)}
                    onRequestClose={() => setViewDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >
                    <div className="flex flex-col h-full justify-between">


                        <h5 className="mb-4">View Client Data </h5>
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
                                {[
                                  { label: "Company Name", value: singleClientData?.company_name },
                                  { label: "Business Type", value: singleClientData?.business_type },
                                  { label: "Company Headquarters", value: singleClientData?.company_headquarters },
                                  { label: "Primary Contact Position", value: singleClientData?.primary_contact_position },
                                  { label: "Primary Contact Email", value: singleClientData?.primary_contact_email },
                                  { label: "Primary Contact Phonenumber", value: singleClientData?.primary_contact_phonenumber },
                                  { label: "Number of Allowed Enrollees", value: singleClientData?.number_of_enrollees },
                                  { label: "Enrolled By", value: singleClientData?.enrolled_by },
                                  { label: "Status", value: singleClientData?.is_active ? "Active" : "Inactive" },
                                  { label: "Number of Registered Enrolless", value: singleClientData?.count },
                                  { label: "Linked Plans", value: singleClientData?.linked_plans ? singleClientData.linked_plans.map((plan) => plan.plan_name).join(', ') : '-' },
                                ].map((item) => (
                                  <tr key={item.label}>
                                    <td className="font-light text-gray-700 min-w-[150px]">{item.label}</td>
                                    <td className="font-semibold text-gray-900 flex-1 truncate">
                                      <b>{item.value || "-"}</b>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                          </table>


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


                        <h5 className="mb-4">Edit Client</h5>
                        <div className="max-h-96 overflow-y-auto">

                            <div className="prose dark:prose-invert mx-auto">
                                <Formik

                                    initialValues={{
                                        id: editCompany.id,
                                        company_name: editCompany.company_name,
                                        business_type: editCompany.business_type,
                                        company_headquarters: editCompany.company_headquarters,
                                        primary_contact_position: editCompany.primary_contact_position,
                                        primary_contact_email: editCompany.primary_contact_email,
                                        primary_contact_phonenumber: editCompany.primary_contact_phonenumber,
                                        user_id: editCompany.user_id

                                    }}
                                    onSubmit={(values, { resetForm, setSubmitting }) => {
                                      updateClient(values,editCompany.id)
                                    }
                                    }

                                >
                                    {({ touched, errors, resetForm }) => (
                                        <Form>
                                            <FormContainer>
                                                {/* company Name */}
                                                <FormItem
                                                    label="company Name"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="company_name"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* business type */}
                                                <FormItem
                                                    label="business type"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="business_type"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* company heaadquaters */}
                                                <FormItem
                                                    label="company heaadquaters"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="company_heaadquaters"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* primary_contact_position */}
                                                <FormItem
                                                    label="primary contact position"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="primary_contact_position"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* primary_contact_email */}
                                                <FormItem
                                                    label="primary_contact_email"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="primary_contact_email"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/*primary_contact_phonenumber*/}
                                                <FormItem
                                                    label="primary_contact_phonenumber."
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="primary_contact_phonenumber"
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

                    <h5 className="mb-4">Set Client Status</h5>
                    <p>
                        {CompanyStatus.is_active ?
                            `Deactivate ${CompanyStatus.company_name}` :
                            `Activate ${CompanyStatus.company_name}`
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
                        <Button variant="solid" onClick={() => updateClientStatus(CompanyStatus,CompanyStatus.id )}>
                            Okay
                        </Button>
                    </div>

                </Dialog >
            }
    </>

  )

}


export default ViewClients
