import {useState, useEffect, useMemo, useRef, ChangeEvent} from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import {useNavigate} from 'react-router-dom'
import type {ColumnDef, OnSortParam, CellContext, Row} from '@/components/shared/DataTable'
import debounce from 'lodash/debounce'
import Dropdown from '@/components/ui/Dropdown'
import type {SyntheticEvent} from 'react'
import Dialog from '@/components/ui/Dialog'
import {FormItem, FormContainer} from '@/components/ui/Form'
import {Field, Form, Formik} from 'formik'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import Tag from '@/components/ui/Tag'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import {HiPlus} from "react-icons/hi";

type PlanCategory = {
    id: '',
    name: '',
    description: '',
    band: '',
    user_id: '',
    entered_by: ''
}

const ViewPlanCategory = () => {

    const {useViewHealthPlanCategoryAuth} = useHealthPlan()
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
    // TODO DELETE IF NOT USED
    const [provider, setProvider] = useState<
        {
            id: string;
            email: string,
            address: string,
            phone_number: string,
            medical_director_name: string,
            medical_director_phone_no: string,
            modified_by: string,
            created_at: string,
            modified_at: string,
            name: string;
            state: string,
            code: string;
            user_id: string,
            entered_by: string
        }>({
        id: "",
        email: "",
        address: "",
        phone_number: "",
        medical_director_name: "",
        medical_director_phone_no: "",
        modified_by: "",
        created_at: "",
        modified_at: "",
        name: "",
        state: "",
        code: "",
        user_id: "",
        entered_by: "",
    })

    // TODO MAKE USE OF
    const [editProvider, setEditProvider] = useState<
        {
            id: string;
            email: string,
            address: string,
            phone_number: string,
            medical_director_name: string,
            medical_director_phone_no: string,
            modified_by: string,
            created_at: string,
            modified_at: string,
            name: string;
            state: string,
            code: string;
            user_id: string,
            entered_by: string
        }>({
        id: "",
        email: "",
        address: "",
        phone_number: "",
        medical_director_name: "",
        medical_director_phone_no: "",
        modified_by: "",
        created_at: "",
        modified_at: "",
        name: "",
        state: "",
        code: "",
        user_id: "",
        entered_by: "",
    })
    // TODO DELETE.
    const [providerStatus, setProviderStatus] = useState<
        {
            id: string;
            is_active: boolean,
            user_id: string,
            name: string,
        }>({
        id: "",
        is_active: false,
        user_id: "",
        name: "",
    })

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    const dropdownItems = [
        {key: 'view', name: 'View'},
        {key: 'edit', name: 'Edit'},
        {key: 'delete', name: 'Delete'},
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
                ...{query: val, pageIndex: 1},
            }))
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    const handleAction = async (cellProps: CellContext<ViewPlanCategory, unknown>, key: any) => {

        switch (key) {
            case 'view':
                setProvider(
                    {
                        id: cellProps.row.original.id,
                        email: cellProps.row.original.email,
                        address: cellProps.row.original.address,
                        phone_number: cellProps.row.original.phone_number,
                        medical_director_name: cellProps.row.original.medical_director_name,
                        medical_director_phone_no: cellProps.row.original.medical_director_phone_no,
                        modified_by: cellProps.row.original.modified_by,
                        created_at: cellProps.row.original.created_at,
                        modified_at: cellProps.row.original.modified_at,
                        name: cellProps.row.original.name,
                        state: cellProps.row.original.state,
                        code: cellProps.row.original.code,
                        user_id: cellProps.row.original.user_id,
                        entered_by: cellProps.row.original.entered_by
                    }
                )

                setViewDialog(true)
                break;
            case 'edit':

                setEditProvider(
                    {
                        id: cellProps.row.original.id,
                        email: cellProps.row.original.email,
                        address: cellProps.row.original.address,
                        phone_number: cellProps.row.original.phone_number,
                        medical_director_name: cellProps.row.original.medical_director_name,
                        medical_director_phone_no: cellProps.row.original.medical_director_phone_no,
                        modified_by: cellProps.row.original.modified_by,
                        created_at: cellProps.row.original.created_at,
                        modified_at: cellProps.row.original.modified_at,
                        name: cellProps.row.original.name,
                        state: cellProps.row.original.state,
                        code: cellProps.row.original.code,
                        user_id: cellProps.row.original.user_id,
                        entered_by: cellProps.row.original.entered_by
                    }
                )
                setEditDialog(true)
                break;
            case 'status':
                setProviderStatus(
                    {
                        id: cellProps.row.original.id,
                        is_active: cellProps.row.original.is_active,
                        name: cellProps.row.original.name,
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

    const columns: ColumnDef<PlanCategory>[] = useMemo(() => (
        [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
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
        setTableData((prevData) => ({...prevData, ...{pageIndex}}))
    }

    const handleSelectChange = (pageSize: number) => {
        setTableData((prevData) => ({...prevData, ...{pageSize}}))
    }

    const handleSort = ({order, key}: OnSortParam) => {
        setTableData((prevData) => ({
            ...prevData,
            ...{sort: {order, key}},
        }))
    }

    const handleRowSelect = (checked: boolean, row: ViewPlanCategory) => {
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

    const handleAllRowSelect = (checked: boolean, rows: Row<ViewPlanCategory>[]) => {
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
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const response = await useViewHealthPlanCategoryAuth(tableData)
            if (response?.status === 'success') {
                setData(response.data)
                setLoading(false)
                setTableData((prevData) => ({
                    ...prevData,
                    ...{total: response.total[0]['count(*)']},
                }))
            }
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps

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
                    icon={<HiPlus/>}
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
                                        <td><b>{provider.name}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td><b>{provider.email}</b></td>

                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td><b>{provider.address}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Phone Number</td>
                                        <td><b>{provider.phone_number}</b></td>
                                    </tr>
                                    <tr>
                                        <td>State</td>
                                        <td><b>{provider.state}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Provider Code</td>
                                        <td><b>{provider.code}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Medical Director Name</td>
                                        <td><b>{provider.medical_director_name}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Medical Director Phone No.</td>
                                        <td><b>{provider.medical_director_phone_no}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Entered By</td>
                                        <td><b>{provider.entered_by}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Modified By</td>
                                        <td><b>{provider.modified_by}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Modified At</td>
                                        <td><b>{provider.modified_at}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Created At</td>
                                        <td><b>{provider.created_at}</b></td>
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
                                    onSubmit={(values, {resetForm, setSubmitting}) => {
                                        updateProvider(values)
                                    }
                                    }

                                >
                                    {({touched, errors, resetForm}) => (
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