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
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { HiPlus } from "react-icons/hi";

type Benefits = {
    id: string;
    benefit_name: string;
    sub_category: string,
    category: string,
    created_at: string,
    user_id: string,
    entered_by: string
}

const ViewBenefit = () => {

    const { useViewBenefitAuth } = useHealthPlan()
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
    const [benefit_list, setBenefit_list] = useState<{
      id: string;
      benefit_name: string;
      sub_category: string,
      category: string,
      entered_by: string
    }>({
      id: "",
      benefit_name: "",
      sub_category: "",
      category: "",
      entered_by: ""

  })

    const [editbenefit, setEditBenefit] = useState<
        {
          id: string;
          benefit_name: string;
          sub_category: string,
          category: string,
        }>({
            id: "",
            benefit_name: "",
            sub_category: "",
            category: "",

        })
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

    const handleAction = async (cellProps: CellContext<Benefits, unknown>, key: any) => {

        switch (key) {
            case 'view':
               setBenefit_list(
                    {
                        id: cellProps.row.original.id,
                        benefit_name: cellProps.row.original.benefit_name,
                        sub_category: cellProps.row.original.sub_category,
                        category: cellProps.row.original.category,
                        entered_by: cellProps.row.original.entered_by
                    }
                )

                setViewDialog(true)
                break;
            case 'edit':

            setEditBenefit(
                    {
                      id: cellProps.row.original.id,
                      benefit_name: cellProps.row.original.benefit_name,
                      sub_category: cellProps.row.original.sub_category,
                      category: cellProps.row.original.category,

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

    const columns: ColumnDef<Benefits>[] = useMemo(() => (
        [
            {
                header: 'Benefit Name',
                accessorKey: 'benefit_name',
            },
            {
                header: 'Category',
                accessorKey: 'category',
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
    const handleRowSelect = (checked: boolean, row: Benefits) => {
      console.log('row', row)
      if (checked) {
          setSelectedRows((prevData) => {
              if (!prevData.includes(row.id)) {
                  return [...prevData, ...[row.id]]
              }
              return prevData
          })
      } else {
          setSelectedRows((prevData) => {
              if (prevData.includes(row.id)) {
                  return prevData.filter((id) => id !== row.id)
              }
              return prevData
          })
      }
  }


    const handleAllRowSelect = (checked: boolean, rows: Row<Benefits>[]) => {
        console.log('rows', rows)
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            const selectedIds: string[] = []
            originalRows.forEach((row) => {
                selectedIds.push(row.benefit_name)
            })
            setSelectedRows(selectedIds)
        } else {
            setSelectedRows([])
        }
    }

    const updatebenefit = async (data: any) => {
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
            const response = await useViewBenefitAuth(tableData)
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
            <div>
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/healthplan/benefits/create')}
                    icon={<HiPlus />}
                >
                    <span>Add Benefits</span>
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

            <DataTable<Benefits>
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


                        <h5 className="mb-4">View Benefit</h5>
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
                                            <td>Benefit Name</td>
                                            <td><b>{benefit_list.benefit_name}</b></td>
                                        </tr>
                                        <tr>
                                            <td>Sub Category</td>
                                            <td><b>{benefit_list.sub_category}</b></td>

                                        </tr>
                                        <tr>
                                            <td>Category</td>
                                            <td><b>{benefit_list.category}</b></td>
                                        </tr>
                                        <tr>
                                            <td>Entered By</td>
                                            <td><b>{benefit_list.entered_by}</b></td>
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


                        <h5 className="mb-4">Edit Benefit</h5>
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
                                        id: editbenefit.id,
                                        benefit_name: editbenefit.benefit_name,
                                        sub_category: editbenefit.sub_category,
                                        category: editbenefit.category,

                                    }}
                                    onSubmit={(values, { resetForm, setSubmitting }) => {
                                        updatebenefit(values)
                                    }
                                    }

                                >
                                    {({ touched, errors, resetForm }) => (
                                        <Form>
                                            <FormContainer>
                                                {/* benefit_name */}
                                                <FormItem
                                                    label="Benefit Name"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="benefit_name"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* sub_category */}
                                                <FormItem
                                                    label="Sub Category"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="sub_category"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                                {/* category */}
                                                <FormItem
                                                    label="category"
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="category"
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

                </Dialog >
            }

        </>
    )
}

export default ViewBenefit
