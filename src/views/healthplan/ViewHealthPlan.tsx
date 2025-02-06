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
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import {
    HiPlus,
    HiDocumentAdd,
    HiOutlineDocumentDownload,
} from 'react-icons/hi'
import Tag from '@/components/ui/Tag'
// import useUpdateHealthPlanAuth from '@/utils/customAuth/useHealthPlanAuth'
type HealthPlan = {
    id: string
    plan_name: string
    health_plan_category_name: string
    plan_type: string
    allow_dependent: string
    max_dependant: string
    plan_age_limit: string
    plan_cost: string
    created_at: string
    user_id: string
    entered_by: string
    disabled_plan: boolean
}

const ViewHealthPlan = () => {
    const {
        useViewHealthPlanAuth,
        useCreateHealthPlanAuth,
        useUpdateHealthPlanAuth,
        useUpdateHealthPlanStatusAuth,
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
    const [healthplan, setHealthPlan] = useState<{

        id: string
        plan_name: string
        health_plan_category_name: string
        plan_type: string
        allow_dependent: string
        max_dependant: string
        plan_age_limit: string
        plan_cost: string
        created_at: string
        entered_by: string
        //  disabled_plan:string;
    }>({
        id: '',
        plan_name: '',
        health_plan_category_name: '',
        plan_type: '',
        allow_dependent: '',
        max_dependant: '',
        plan_age_limit: '',
        plan_cost: '',
        created_at: '',
        entered_by: '',
        // disabled_plan:"",
    })

    const [edithealthplan, setEditHealthPlan] = useState<{

        id: string
        plan_name: string
        health_plan_category_name: string
        plan_type: string
        allow_dependent: string
        max_dependant: string
        plan_age_limit: string
        plan_cost: string
        created_at: string
        entered_by: string
    }>({
        // id: "",
        id: '',
        plan_name: '',
        health_plan_category_name: '',
        plan_type: '',
        allow_dependent: '',
        max_dependant: '',
        plan_age_limit: '',
        plan_cost: '',
        created_at: '',
        entered_by: '',
    })
    const [healthplanStatus, setHealthPlanStatus] = useState<{
        id: string
        disabled_plan: boolean
        // user_id: string
        plan_name: string;
    }>({
        id: '',
        disabled_plan: false,
        // user_id: '',
        plan_name: '',
    })

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    const dropdownItems = [
        { key: 'view', name: 'View' },
        { key: 'edit', name: 'Edit' },
        { key: 'status', name: 'deactive' },
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
        cellProps: CellContext<HealthPlan, unknown>,
        key: any,
    ) => {
        switch (key) {
            case 'view':
                setHealthPlan({
                    id: cellProps.row.original.id,
                    plan_name: cellProps.row.original.plan_name,
                    health_plan_category_name:cellProps.row.original.health_plan_category_name,
                    plan_type: cellProps.row.original.plan_type,
                    allow_dependent: cellProps.row.original.allow_dependent,
                    max_dependant: cellProps.row.original.max_dependant,
                    plan_age_limit: cellProps.row.original.plan_age_limit,
                    plan_cost: cellProps.row.original.plan_cost,
                    created_at: cellProps.row.original.created_at,
                    entered_by: cellProps.row.original.entered_by,
                })

                setViewDialog(true)
                break
            case 'edit':
                setEditHealthPlan({
                    id: cellProps.row.original.id,
                    plan_name: cellProps.row.original.plan_name,
                    health_plan_category_name:cellProps.row.original.health_plan_category_name,
                    plan_type: cellProps.row.original.plan_type,
                    allow_dependent: cellProps.row.original.allow_dependent,
                    max_dependant: cellProps.row.original.max_dependant,
                    plan_age_limit: cellProps.row.original.plan_age_limit,
                    plan_cost: cellProps.row.original.plan_cost,
                    created_at: cellProps.row.original.created_at,
                    entered_by: cellProps.row.original.entered_by,
                })
                setEditDialog(true)
                break
            case 'status':
                setHealthPlanStatus({
                    id: cellProps.row.original.id,
                    disabled_plan: cellProps.row.original.disabled_plan,
                    plan_name: cellProps.row.original.plan_name,
                    // user_id: cellProps.row.original.user_id,
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

    const columns: ColumnDef<HealthPlan>[] = useMemo(
        () => [
            {
                header: 'Plan Name',
                accessorKey: 'plan_name',
            },
            {
                header: 'Plan Category',
                accessorKey: 'health_plan_category_name',
            },
            {
                header: 'Plan Type',
                accessorKey: 'plan_type',
            },
            {
                header: 'Allow Dependent',
                cell: (props) => (
                    <div>
                        {props.cell.row.original.allow_dependent ? (
                            <Tag className="text-white bg-indigo-600 border-0">
                                Yes
                            </Tag>
                        ) : (
                            <Tag className="text-white bg-red-700 border-0">
                                No
                            </Tag>
                        )}
                    </div>
                ),
            },
            {
                header: 'Age Limit',
                accessorKey: 'plan_age_limit',
            },
            {
                header: 'Annual Cost',
                accessorKey: 'plan_cost',
            },
            {
                header: 'Max. Dependent',
                accessorKey: 'max_dependant',
            },
            {
                header: 'Entered by',
                accessorKey: 'entered_by',
            },
            {
              header: 'is active',
              accessorKey: 'disabled_plan',
          },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <div>
                        <Dropdown placement="bottom-start">
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

    const handleRowSelect = (checked: boolean, row: HealthPlan) => {
        console.log('row', row)
        if (checked) {
            setSelectedRows((prevData) => {
                if (!prevData.includes(row.plan_name)) {
                    return [...prevData, ...[row.plan_name]]
                }
                return prevData
            })
        } else {
            setSelectedRows((prevData) => {
                if (prevData.includes(row.plan_name)) {
                    return prevData.filter((id) => id !== row.plan_name)
                }
                return prevData
            })
        }
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<HealthPlan>[]) => {
        console.log('rows', rows)
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            const selectedIds: string[] = []
            originalRows.forEach((row) => {
                selectedIds.push(row.plan_name)
            })
            setSelectedRows(selectedIds)
        } else {
            setSelectedRows([])
        }
    }

    const updateHealthPlan = async (data: any) => {
        const id = edithealthplan.id
        console.log(id)
        console.log('ID:', id)
        const result = await useUpdateHealthPlanAuth(id, data)

        setMessage(result.message)

        if (result.message) {
            setTimeout(() => {
                openNotification()
            }, 3000)
        }
    }

    const toastNotification = (
        <Notification title="Message">{message}</Notification>
    )

    function openNotification() {
        toast.push(toastNotification)
    }

    async function updateProviderStatus(healthplanId: string, disabled_plan: boolean) {
        let status;

        if (disabled_plan) {
            status = false
        } else {
            status = true
        }
        // let status: boolean = !disabled_plan;

        disabled_plan = status;

        const response = await useUpdateHealthPlanStatusAuth(healthplanId, disabled_plan)

        if (response) {
            setStatusDialog(false)
            window.location.reload();
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await useViewHealthPlanAuth(tableData)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        tableData.pageIndex,
        tableData.sort,
        tableData.pageSize,
        tableData.query,
        tableData.total,
    ])

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

            {/* Add benefit btn */}
            {/* grid-row-{1} */}
            <div className=" flex  justify-evenly pb-10">
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/healthplan/create')}
                    icon={<HiPlus />}
                >
                    <span>Create HealthPlan</span>
                </Button>
                {/* attach benefit btn */}
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/healthplan/benefits/attach')}
                    icon={<HiOutlineDocumentDownload />}
                >
                    <span>Attach Benefit to Health Plan</span>
                </Button>
                {/* Edit benefit btn */}
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/healthplan/benefits/attach/edit')}
                    icon={<HiDocumentAdd />}
                >
                    <span>Edit Attached Benefit</span>
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

            <DataTable<HealthPlan>
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
                        <h5 className="mb-4">View HealthPlan</h5>
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
                                                <b>{healthplan.plan_name}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>plan_category</td>
                                            <td>
                                                <b>
                                                    {
                                                        healthplan.health_plan_category_name
                                                    }
                                                </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>plan_type</td>
                                            <td>
                                                <b>{healthplan.plan_type}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>allow_dependent</td>
                                            <td>
                                                <b>
                                                    {healthplan.allow_dependent
                                                        ? 'True'
                                                        : 'False'}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>max_dependant</td>
                                            <td>
                                                <b>
                                                    {healthplan.max_dependant}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>plan_age_limit</td>
                                            <td>
                                                <b>
                                                    {healthplan.plan_age_limit}
                                                </b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>plan_cos</td>
                                            <td>
                                                <b>{healthplan.plan_cost}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>entered_by</td>
                                            <td>
                                                <b>{healthplan.entered_by}</b>
                                            </td>
                                        </tr>
                                        {/* <tr>
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
                                        </tr> */}
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
                        <h5 className="mb-4">Edit plan</h5>
                        <div className="max-h-96 overflow-y-auto">
                            <div className="prose dark:prose-invert mx-auto">
                                <Formik
                                    /*  id: string;
        created_at: string,
        modified_at: string,
        code: string;
        user_id: string,
        entered_by: string */
                                    initialValues={{
                                        // id: edithealthplan.id,
                                        plan_name: edithealthplan.plan_name,
                                        health_plan_category_name:
                                            edithealthplan.health_plan_category_name,
                                        plan_type: edithealthplan.plan_type,
                                        allow_dependent:
                                            edithealthplan.allow_dependent,
                                        max_dependant:
                                            edithealthplan.max_dependant,
                                        plan_age_limit:
                                            edithealthplan.plan_age_limit,
                                        plan_cost: edithealthplan.plan_cost,
                                        entered_by: edithealthplan.entered_by,
                                    }}
                                    onSubmit={(
                                        values,
                                        { resetForm, setSubmitting },
                                    ) => {
                                        updateHealthPlan(values)
                                    }}
                                >
                                    {({ touched, errors, resetForm }) => (
                                        <Form>
                                            <FormContainer>
                                                {/* Name */}
                                                <FormItem label="plan_name">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="plan_name"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* Email */}
                                                <FormItem label="health_plan_category_name">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="health_plan_category_name"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* Address */}
                                                <FormItem label="plan_type">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="plan_type"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* phone number */}
                                                <FormItem label="allow_dependent">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="allow_dependent"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* Medical Director's Name */}
                                                <FormItem label="max_dependant">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="max_dependant"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/*medical_director_phone_no*/}
                                                <FormItem label="plan_age_limit">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="plan_age_limit"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* state */}
                                                <FormItem label="plan_cost">
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="plan_cost"
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
                    <h5 className="mb-4">Deactivate Health Plan</h5>
                    <p>
                        {healthplanStatus.disabled_plan
                            ? `Deactivate ${healthplanStatus.plan_name}`
                            : `Activate ${healthplanStatus.plan_name}`}
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
                                updateProviderStatus(
                                    healthplanStatus.id,
                                    healthplanStatus.disabled_plan
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

export default ViewHealthPlan
