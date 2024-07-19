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
import useThemeClass from '@/utils/hooks/useThemeClass'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { HiOutlineSearch } from 'react-icons/hi'
import useNhia from '@/utils/customAuth/useNhisAuth'
import { HiPlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi"

type NhiaServiceTarrif = {
    id: string;
    name_of_drug: string,
    dosage_form: string,
    strength: string,
    nhia_code: string;
    presentation: string,
    category: string,
    price: number,
    plan_type: string,
    entered_by: string
    tarrif_type: string,
    created_at: string,
}

const CreateNHIAEnrollee = () => {

    const { getAllAndSearchNhiaDrugTarrifAuth } = useNhia()
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

    const handleAction = async (cellProps: CellContext<NhiaServiceTarrif, unknown>, key: any) => {

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

    const ActionColumn = ({ row }: { row: NhiaServiceTarrif }) => {
        // const dispatch = useAppDispatch()
        const { textTheme } = useThemeClass()
        const navigate = useNavigate()

        const onEdit = () => {
            navigate(`/app/sales/product-edit/${row.id}`)
        }

        const onDelete = () => {
            // dispatch(toggleDeleteConfirmation(true))
            // dispatch(setSelectedProduct(row.id))
        }

        return (
            <div className="flex justify-end text-lg">
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onEdit}
                >
                    <HiOutlinePencil />
                </span>
                <span
                    className="cursor-pointer p-2 hover:text-red-500"
                    onClick={onDelete}
                >
                    <HiOutlineTrash />
                </span>
            </div>
        )
    }

    const columns: ColumnDef<NhiaServiceTarrif>[] = useMemo(() => (
        [
            {
                header: 'Name',
                accessorKey: 'name_of_drug',
            },
            {
                header: 'Dosage Form',
                accessorKey: 'dosage_form',
            },
            {
                header: 'Code',
                accessorKey: 'nhia_code',
            },
            {
                header: 'Drug Strength',
                accessorKey: 'strength',
            },
            {
                header: 'Drug Presentation',
                accessorKey: 'presentation',
            },
            {
                header: 'Price',
                accessorKey: 'price',
            },
            {
                header: 'Entered by',
                accessorKey: 'entered_by',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <>
                    <ActionColumn row={props.row.original} />
                </>
            }

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

    const handleRowSelect = (checked: boolean, row: NhiaServiceTarrif) => {
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

    const handleAllRowSelect = (checked: boolean, rows: Row<NhiaServiceTarrif>[]) => {
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
        const result = await useEditProviderById(data)

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
            const response = await getAllAndSearchNhiaDrugTarrifAuth(tableData)

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

    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query, tableData.total])




    return (
        <>

            <div className="lg:flex items-center justify-between mb-4 flex flex-col lg:flex-row lg:items-center">
                <h3 className="mb-4 lg:mb-0">NHIA Drug Tarrif</h3>

                <div className="flex justify-end mb-4 items-center">
                    {/* search */}
                    <Input
                        ref={inputRef}
                        placeholder="Search..."
                        size="sm"
                        prefix={<HiOutlineSearch className="text-lg" />}
                        className="lg:w-52 mx-3"
                        onChange={handleChange}
                    />

                    {/* Add Nhia drug tarrif btn */}
                    <div>
                        <Button
                            className="mr-2"
                            variant="solid"
                            onClick={() => navigate('/nhia/tarrif/drugs/create')}
                            icon={<HiPlus />}
                        >
                            <span>Add NHIA Drug Tarrif</span>
                        </Button>
                    </div>

                    {/* batch action */}
                    {selectedRows.length > 0 && (
                        <Button
                            size="sm"
                            variant="solid"
                            onClick={handleBatchAction}
                        >
                            Batch Action
                        </Button>
                    )}
                </div>
            </div>

            <DataTable<NhiaServiceTarrif>
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
export default CreateNHIAEnrollee