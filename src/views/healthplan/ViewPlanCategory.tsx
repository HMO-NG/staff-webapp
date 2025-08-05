import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef, OnSortParam, CellContext, Row } from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import Dropdown from '@/components/ui/Dropdown'
import type { SyntheticEvent } from 'react'
import Dialog from '@/components/ui/Dialog'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Tag from '@/components/ui/Tag'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { HiPlus } from "react-icons/hi";

type PlanCategory = {
    id: '',
    name: '',
    description: '',
    band: '',
    is_active: boolean,
    user_id: '',
    entered_by: ''
}

const ViewPlanCategory = () => {

    const { useViewHealthPlanCategoryAuth,
            useUpdateHealthPlanCategoryAuth,
          } = useHealthPlan()
    const navigate = useNavigate()
    const [data, setData] = useState([])
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
    const [editCategory,setEditCategory] = useState<{
      id:string,
      name:string,
      description:string,
      band:string,
      user_id:string
    }>({
      id:'',
      name:'',
      description:'',
      band:'',
      user_id:''
      })
    const [categoryStatus, setCategoryStatus] = useState<{
        id: string,
        name: string,
        is_active: boolean
    }>({
        id: '',
        name: '',
        is_active: false
    })

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    const dropdownItems = [
        { key: 'view', name: 'View' },
        { key: 'edit', name: 'Edit' },
        { key: 'status', name: 'Update Status' },
    ]

    const [editDialog, setEditDialog] = useState(false)
    const [statusDialog, setStatusDialog] = useState(false)

    const fetchData = async () => {
            setLoading(true)
            const response = await useViewHealthPlanCategoryAuth(tableData)
            if (response?.status === 'success') {
                setData(response.data)
                setLoading(false)
                setTableData((prevData) => ({
                    ...prevData,
                    ...{ total: response.total[0]['count(*)'] },
                }))
            }
        }

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

    // when you click on the actions eg. view, edit, delete.
    const handleAction = async (cellProps: CellContext<PlanCategory, unknown>, key: any) => {

        switch (key) {
            case 'view':
                const id = cellProps.row.original.id;
                navigate('/healthplan/category/singleview', { state: { id } })
                break;
            case 'edit':
               setEditCategory({
                              id:cellProps.row.original.id,
                              name:cellProps.row.original.name,
                              description:cellProps.row.original.description,
                              band:cellProps.row.original.band,
                              user_id:cellProps.row.original.user_id,})
                setEditDialog(true)
                break;
            case 'status':
                setCategoryStatus({
                              id:cellProps.row.original.id,
                              name:cellProps.row.original.name,
                              is_active:cellProps.row.original.is_active,
                })

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

    const columns: ColumnDef<PlanCategory>[] = useMemo(() => (
        [
            {
                header: 'Name',
                accessorKey: 'name',
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
                header: 'Entered by',
                accessorKey: 'entered_by',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <div>
                        <Dropdown
                            placement='bottom-start'>
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

    const handleRowSelect = (checked: boolean, row: PlanCategory) => {
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

    const handleAllRowSelect = (checked: boolean, rows: Row<PlanCategory>[]) => {
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

    const updateCategory = async (data: any) => {
        const result = await useUpdateHealthPlanCategoryAuth(data.id,data)

        if (result.message) {
                if (result.status === 'success') {
                fetchData()
                setEditDialog(false)
                setTimeout(() => {
                  openNotification(result.message,'success')
                }, 1000);
                }else{
                openNotification(result.message,'danger')
                }

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

    async function updateCategoryStatus(id: string, data: any) {

        let status;

        if (data.is_active) {
            status = false
        } else {
            status = true
        }

        const response = await useUpdateHealthPlanCategoryAuth(id, {is_active:status})

        if (response) {
            if (response.status === 'success'){
               openNotification('sucessfully updated Health plan category status','success')
               setStatusDialog(false)
               fetchData()
            }else{
              openNotification(response.message,'danger')

            }


        }

    }

    useEffect(() => {

        fetchData()

    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query, tableData.total])

    return (
        <>
            {selectedRows.length > 0 && (
                <div className="flex justify-end mb-4">
                    <Button
                        size="sm"
                        variant="solid"
                        onClick={handleBatchAction}
                    >
                        Batch Action
                    </Button>
                </div>
            )}

            {/* Add health plan category btn */}
            <div>
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/healthplan/category/create')}
                    icon={<HiPlus />}
                >
                    <span>Add Health Plan Category</span>
                </Button>
            </div>
            <div className="flex justify-end mb-4">
                <Input
                    ref={inputRef}
                    placeholder="Search..."
                    size="sm"
                    className="lg:w-52"
                    onChange={handleChange}
                />
            </div>

            <DataTable<PlanCategory>
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
                editDialog && <Dialog
                    isOpen={editDialog}
                    onClose={() => setEditDialog(false)}
                    onRequestClose={() => setEditDialog(false)}
                    width={1000}
                    shouldCloseOnOverlayClick={false}
                    shouldCloseOnEsc={false}
                >
                    <div className="flex flex-col h-full justify-between">


                        <h5 className="mb-4">Edit Provider Category</h5>
                        <div className="max-h-96 overflow-y-auto">

                            <div className="prose dark:prose-invert mx-auto">
                                <Formik

                                    initialValues={{
                                        id: editCategory?.id,
                                        name: editCategory?.name,
                                        description: editCategory?.description,
                                        band: editCategory?.band,
                                        user_id: editCategory?.user_id

                                    }}
                                    onSubmit={(values, { resetForm, setSubmitting }) => {
                                        updateCategory(values)
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
                                                {/* Band */}
                                                <FormItem
                                                    label="Band"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="band"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* Description */}
                                                <FormItem
                                                    label="Description"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="description"
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
                </Dialog>
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

                    <h5 className="mb-4">Set Category Status</h5>
                    <p>
                        {categoryStatus.is_active ?
                            `Deactivate ${categoryStatus.name}` :
                            `Activate ${categoryStatus.name}`
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
                        <Button variant="solid" onClick={() => updateCategoryStatus(categoryStatus.id, categoryStatus)}>
                            Okay
                        </Button>
                    </div>

                </Dialog>
            }

        </>
    )
}

export default ViewPlanCategory
