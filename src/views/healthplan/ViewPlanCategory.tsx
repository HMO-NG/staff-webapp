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
    is_active: '',
    user_id: '',
    entered_by: ''
}

const ViewPlanCategory = () => {

    const { useViewHealthPlanCategoryAuth } = useHealthPlan()
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

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    const dropdownItems = [
        { key: 'view', name: 'View' },
        { key: 'edit', name: 'Edit' },
        { key: 'delete', name: 'Delete' },
    ]

    const [editDialog, setEditDialog] = useState(false)
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

    // when you click on the actions eg. view, edit, delete.
    const handleAction = async (cellProps: CellContext<PlanCategory, unknown>, key: any) => {

        switch (key) {
            case 'view':
                const id = cellProps.row.original.id;
                navigate('/healthplan/category/singleview', { state: { id } })
                break;
            case 'edit':
                setEditDialog(true)
                break;
            case 'status':
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
                header: 'Code',
                accessorKey: 'health_plan_code',
            },
            {
                header: 'Band',
                accessorKey: 'band',
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

    const updateProvider = async (data: any) => {
        const result = await useViewHealthPlanCategoryAuth(data)

        setMessage(result.message)

        if (result.message) {
            setTimeout(() => {
                openNotification()
            },
                3000
            )

        }


    }

    const toastNotification = (
        <Notification title="Message">
            {message}
        </Notification>
    )

    function openNotification() {
        toast.push(toastNotification)
    }

    async function updateProviderStatus(providerId: string, data: any) {

        let status;

        if (data.is_active) {
            status = false
        } else {
            status = true
        }

        data.is_active = status;

        const response = await useUpdateProviderActivationStatus(providerId, data)

        if (response) {
            setStatusDialog(false)
            window.location.reload();
        }

    }

    useEffect(() => {
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


                        <h5 className="mb-4">Edit Provider</h5>
                        <div className="max-h-96 overflow-y-auto">

                            <div className="prose dark:prose-invert mx-auto">
                                <Formik

                                    initialValues={{
                                        id: editProvider.id,
                                        name: editProvider.name,
                                        email: editProvider.email,
                                        address: editProvider.address,
                                        phone_number: editProvider.phone_number,
                                        medical_director_name: editProvider.medical_director_name,
                                        medical_director_phone_no: editProvider.medical_director_phone_no,
                                        state: editProvider.state,
                                        user_id: editProvider.user_id

                                    }}
                                    onSubmit={(values, { resetForm, setSubmitting }) => {
                                        updateProvider(values)
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

                    <h5 className="mb-4">Set Provider Status</h5>
                    <p>
                        {providerStatus.is_active ?
                            `Deactivate ${providerStatus.name}` :
                            `Activate ${providerStatus.name}`
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
                        <Button variant="solid" onClick={() => updateProviderStatus(providerStatus.id, providerStatus)}>
                            Okay
                        </Button>
                    </div>

                </Dialog>
            }

        </>
    )
}

export default ViewPlanCategory