import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import DataTable from '@/components/shared/DataTable'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef, OnSortParam, CellContext, Row } from '@/components/shared/DataTable'
import useProvider from '@/utils/customAuth/useProviderAuth'
import debounce from 'lodash/debounce'
import Dropdown from '@/components/ui/Dropdown'
import type { SyntheticEvent } from 'react'
import Dialog from '@/components/ui/Dialog'

type Customer = {
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
    created_by: string

}

const ViewAllProvider = () => {

    const { useGetAllProvider } = useProvider()
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedRows, setSelectedRows] = useState<string[]>([])
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
            created_by: string
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
            created_by: "",
        })

    const inputRef = useRef(null)

    const debounceFn = debounce(handleDebounceFn, 500)

    const dropdownItems = [
        { key: 'view', name: 'view' },
        { key: 'edit', name: 'Edit' },
        { key: 'deactive', name: 'Deactive' },
    ]

    const [dialogIsOpen, setIsOpen] = useState(false)
    const [viewDialog, setViewDialog] = useState(false)

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

    const handleAction = async (cellProps: CellContext<Customer, unknown>, key: any) => {
        console.log('Action clicked', cellProps)

        switch (key) {
            case 'view':
                // const providerResponse = await useGetProviderByID(cellProps.row.original.id)
                // console.log("provider Response", providerResponse)
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
                        created_by: cellProps.row.original.created_by
                    }
                )

                setViewDialog(true)
                break;
            case 'edit':
                navigate('/provider/edit')
                break;
            case 'deactive':
                // Code to execute if expression === value2
                break;
            // ... more cases
            default:
            // Code to execute if expression doesn't match any case
        }
    }

    const handleBatchAction = () => {
        console.log('selectedRows', selectedRows)
    }

    const columns: ColumnDef<Customer>[] = useMemo(() => (
        [
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'State',
                accessorKey: 'state',
            },
            {
                header: 'Code',
                accessorKey: 'code',
            },
            {
                header: 'Entered by',
                accessorKey: 'entered by',
            },
            {
                header: 'Address',
                accessorKey: 'email',
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <div>
                        <Dropdown>
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

    const handleRowSelect = (checked: boolean, row: Customer) => {
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

    const handleAllRowSelect = (checked: boolean, rows: Row<Customer>[]) => {
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await useGetAllProvider(tableData)
            console.log("data",response.data)
            if (response.data) {
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

    }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query])

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

            <div className="flex justify-end mb-4">
                <Input
                    ref={inputRef}
                    placeholder="Search..."
                    size="sm"
                    className="lg:w-52"
                    onChange={handleChange}
                />
            </div>

            <DataTable<Customer>
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
                    <h5 className="mb-4">View Provider</h5>
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
                                    <td>Provider Name</td>
                                    <td>{provider.name}</td>
                                </tr>
                                <tr>
                                    <td>Provider Email</td>
                                    <td>{provider.email}</td>

                                </tr>
                                <tr>
                                    <td>Provider Address</td>
                                    <td>{provider.address}</td>
                                    <td>{data[0].Address}</td>
                                </tr>
                                <tr>
                                    <td>Vader</td>
                                    <td>Boulder, CO</td>
                                    <td>Vader Bomb</td>
                                </tr>
                                <tr>
                                    <td>Razor Ramon</td>
                                    <td>Chuluota, FL</td>
                                    <td>Razor's Edge</td>
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
                        <Button variant="solid" onClick={() => setViewDialog(false)}>
                            Okay
                        </Button>
                    </div>
                </Dialog>
            }

        </>
    )
}

export default ViewAllProvider