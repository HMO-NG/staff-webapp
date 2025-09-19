import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router-dom'
import type {
    ColumnDef,
    OnSortParam,
    CellContext,
    Row,
} from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import Dropdown from '@/components/ui/Dropdown'
import type { SyntheticEvent } from 'react'
import Dialog from '@/components/ui/Dialog'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useBandAuth from '@/utils/customAuth/useBandAuth'
import type {Band}from '@/utils/customAuth/useBandAuth'
import {
    HiPlus,
    HiDocumentAdd,
    HiOutlineDocumentDownload,
} from 'react-icons/hi'
import Tag from '@/components/ui/Tag'
import Select from '@/components/ui/Select'
import type { FieldProps } from 'formik'
import { useQuery } from '@tanstack/react-query'

type FormModel = {
  input: string
  select: string
  multipleSelect: string[]
  date: Date | null
  time: Date | null
  singleCheckbox: boolean
  multipleCheckbox: Array<string | number>
  radio: string
  switcher: boolean
  segment: string[]
  upload: File[]
}

const allowDependent = [
    { value: true, label: "Yes", color: '#5243AA' },
    { value: false, label: "No", color: '#0052CC' },
]

const ViewBands = () => {
    const {
          useGetBandAuth,
          useUpdateBandAuth
    } = useBandAuth()

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [message, setMessage] = useState('')
    const [tableData, setTableData] = useState<{
        pageIndex: number
        pageSize: number
        sort: {
            order: '' | 'asc' | 'desc'
            key: string | number
        }
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
    const [band, setBand] = useState<{

        id: string
        name: string
        desciption:string
        created_at: string
        created_by: string
    }>({
        id: '',
        name: '',
        desciption:'',
        created_at: '',
        created_by: '',
    })

    const [editBand, setEditBand] = useState<{
        id: string
        name: string
        desciption:string
        created_at: string
        created_by: string
    }>({
        id: '',
        name: '',
        desciption:'',
        created_at: '',
        created_by: '',
    })
    const [BandStatus, setBandStatus] = useState<{
        id: string
        is_active: boolean
        name: string;
    }>({
        id: '',
        is_active: false,
        name: '',
    })


    const [attachedBenefits, setAttachedBenefits] = useState([])

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    const dropdownItems = [
        { key: 'view', name: 'View' },
        { key: 'edit', name: 'Edit' },
        { key: 'status', name: 'Set Status' },
    ]

    const [editDialog, setEditDialog] = useState(false)
    const [viewDialog, setViewDialog] = useState(false)
    const [statusDialog, setStatusDialog] = useState(false)

    const onDropdownClick = (e: SyntheticEvent) => {
        console.log('Dropdown Clicked', e)
    }

    const onDropdownItemClick = (eventKey: string, e: SyntheticEvent) => {
        console.log('Dropdown Item Clicked', eventKey, e)
    }

    function handleDebounceFn(val: string) {
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setTableData((prevData) => ({
                ...prevData,
                ...{ query: val, pageIndex: 1 },
            }))
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const handleAction = async (
        cellProps: CellContext<Band, unknown>,
        key: any,
    ) => {
        switch (key) {
            case 'view':
                // setBand({
                //     id: cellProps.row.original.id,
                //     name: cellProps.row.original.name,
                //     desciption:cellProps.row.original.description,
                //     created_at: cellProps.row.original.created_at,
                //     created_by: cellProps.row.original.created_by,
                // })

                // setViewDialog(true)
                navigate(`/band/view/${cellProps.row.original.id}`)
                break
            case 'edit':
                setEditBand({
                    id: cellProps.row.original.id,
                    name: cellProps.row.original.name,
                    desciption:cellProps.row.original.description,
                    created_at: cellProps.row.original.created_at,
                    created_by: cellProps.row.original.created_by,
                })
                setEditDialog(true)
                break
            case 'status':
                setBandStatus({
                    id: cellProps.row.original.id,
                    is_active: cellProps.row.original.is_active,
                    name: cellProps.row.original.name,
                })
                setStatusDialog(true)
                break

            // ... more cases
            default:
            // Code to execute if expression doesn't match any case
        }
    }

    const handleBatchAction = () => {
        console.log('selectedRows', selectedRows)
    }

    const columns: ColumnDef<Band>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Description',
                accessorKey: 'Description',
            },

            {
                header: 'Created By',
                accessorKey: 'created_by',
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
            },
            {
              header: 'Status',
              cell: (props) => (
                  <div>
                      {props.cell.row.original.is_active ? (
                          <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0">
                              Active
                          </Tag>
                      ) : (
                          <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
                              Deactivated
                          </Tag>
                      )}
                  </div>
              ),
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <div>
                        <Dropdown placement="bottom-end">
                            {dropdownItems.map((item) => (
                                <Dropdown.Item
                                    key={item.key}
                                    eventKey={item.key}
                                    onSelect={onDropdownItemClick}
                                    onClick={() =>
                                        handleAction(props, item.key)
                                    }
                                >
                                    {item.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </div>
                ),
            },
        ],
        [],
    )

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

    const handleRowSelect = (checked: boolean, row: Band) => {
        console.log('row', row)
        if (checked) {
            setSelectedRows((prevData) => {
                if (!prevData.includes(row.name)) {
                    return [...prevData, ...[row.name]]
                }
                return prevData
            })
        } else {
            setSelectedRows((prevData) => {
                if (prevData.includes(row.name)) {
                    return prevData.filter((id) => id !== row.name)
                }
                return prevData
            })
        }
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Band>[]) => {
        console.log('rows', rows)
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            const selectedIds: string[] = []
            originalRows.forEach((row) => {
                selectedIds.push(row.name)
            })
            setSelectedRows(selectedIds)
        } else {
            setSelectedRows([])
        }
    }

    const updateBand = async (data: any) => {
        const id = editBand.id
        const result = await useUpdateBandAuth(data,id)

        setMessage(result.message)
        let notif_type:any
        if (result.status === 'success'){
           notif_type='success'
        }
        else if(result.status === 'failed'){
          notif_type='warning'
        }
        setEditDialog(false)
        refetch()
        if (result.message) {
            setTimeout(() => {
                openNotification(result.message,notif_type)
            }, 2000)
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

    async function updateBandStatus(bandId: string, disabled_plan: boolean) {
        let status;

        if (disabled_plan) {
            status = false
        } else {
            status = true
        }

        disabled_plan = status;

        const response = await useUpdateBandAuth({'is_active': disabled_plan},bandId)

        if (response.status === 'success'){
            setStatusDialog(false)
            refetch()
            openNotification(response.message,'success')
        }
        else if(response.status === 'failed'){
               setStatusDialog(false)
               refetch()
               openNotification(response.message,'warning')
        }
        if (response) {
            setStatusDialog(false)

        }
    }

    const {data,refetch,isLoading}= useQuery({
        queryKey: ['band'],
        queryFn: async()=>{
          const res =await useGetBandAuth()
          return res.data
        },
        // select: (data) => data?.data || null
      });


    return (
        <>
            {selectedRows.length > 0 && (
                <div className="flex justify-end mb-4">
                    <Button
                        size="sm"
                        variant="solid"
                        onClick={handleBatchAction}
                    >
                        View
                    </Button>
                </div>
            )}

            <div className="flex justify-end mb-4">
                <Input
                    ref={inputRef}
                    placeholder="Search..."
                    size="sm"
                    className="lg:w-52"
                    onChange={handleChange}
                />
            </div>

            <DataTable<Band>
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

            {viewDialog && (
                <Dialog
                    isOpen={viewDialog}
                    onClose={() => setViewDialog(false)}
                    onRequestClose={() => setViewDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >
                    <div className="flex flex-col h-full justify-between">
                        <h5 className="mb-4">View Band</h5>
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
                                            <td>
                                                <b>{band.name}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Description</td>
                                            <td>
                                                <b>{band.desciption}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Created At</td>
                                            <td>
                                                <b>{band.created_at}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Created_by</td>
                                            <td>
                                                <b>{band.created_by}</b>
                                            </td>
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
            )}
            {editDialog && (
                <Dialog
                    isOpen={editDialog}
                    onClose={() => setEditDialog(false)}
                    onRequestClose={() => setEditDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >
                    <div className="flex flex-col h-full justify-between">
                        <h5 className="mb-4">Edit Band</h5>
                        <div className="max-h-96 overflow-y-auto">
                            <div className="prose dark:prose-invert mx-auto">
                                <Formik
                                    initialValues={{

                                        name: editBand.name,
                                        desciption:editBand.desciption || null
                                    }}
                                    onSubmit={(values,{ resetForm, setSubmitting },) => {
                                        updateBand(values)
                                    }}
                                >
                                    {({ values,touched, errors, resetForm, }) => (
                                        <Form>
                                            <FormContainer>
                                                {/* Name */}
                                                <FormItem label="Name">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="name"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* Email */}
                                                <FormItem label="Description">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="description"
                                                        component={Input}
                                                    />
                                                </FormItem>

                                                <FormItem>
                                                    <Button
                                                        variant="solid"
                                                        type="submit"
                                                    >
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
                </Dialog>
            )}
            {statusDialog && (
                <Dialog
                    isOpen={statusDialog}
                    onClose={() => setStatusDialog(false)}
                    onRequestClose={() => setStatusDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >
                    <h5 className="mb-4">Update Bnad Status</h5>
                    <p>
                        {BandStatus.is_active
                            ? `Deactivate ${BandStatus.name}`
                            : `Activate ${BandStatus.name}`}
                    </p>
                    <div className="text-right mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={() => setStatusDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={() =>
                                updateBandStatus(
                                    BandStatus.id,
                                    BandStatus.is_active
                                )
                            }

                        >
                            Okay
                        </Button>
                    </div>
                </Dialog>
            )}

        </>
    )
}

export default ViewBands
