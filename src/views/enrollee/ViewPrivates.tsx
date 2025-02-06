import { useNavigate ,Link} from 'react-router-dom'
import type { ColumnDef, OnSortParam, CellContext, Row } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import Button from '@/components/ui/Button'
import {
  HiPlus,
  HiDocumentAdd,
  HiOutlineDocumentDownload,
} from 'react-icons/hi'

type PrivateCompany={
  id: string
  company_name: string
  business_type: string
  company_heaadquaters: string
  primary_contact_position: string
  primary_contact_email: string
  primary_contact_phonenumber:string
  user_id:string
  enrolled_by:string
}
const ViewPrivates = () => {
      const {useGetCompanyAuth}=usePrivates()
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

      const [editProvider, setEditProvider] = useState<
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
          const columns: ColumnDef<PrivateCompany>[] = useMemo(() => (
            [
                {
                    header: 'Company_name',
                    accessorKey: 'company_name',
                },
                {
                    header: 'Business_type',
                    accessorKey: 'business_type',
                },
                {
                    header: 'Company_heaadquaters',
                    accessorKey: 'company_heaadquaters',
                },

                {
                  header: 'Primary_contact_position',
                  accessorKey: 'primary_contact_position',
              },
              {
                header: 'Primary_contact_email',
                accessorKey: 'primary_contact_email',
              },
              {
              header: 'Primary_contact_phonenumber',
              accessorKey: 'primary_contact_phonenumber',
              },
              {
            header: 'Enrolled_bys',
            accessorKey: 'enrolled_by',
               },


            ]
        ), [])
          useEffect(() => {
            const fetchData = async () => {
                setLoading(true)
                const response = await useGetCompanyAuth()
                if (response.data) {
                    setData(response.data)
                    setLoading(false)
                    // setTableData((prevData) => ({
                    //     ...prevData,
                    //     ...{ total: response.total[0]['count(*)'] },
                    // }))
                }
            }
            fetchData()
            // eslint-disable-next-line react-hooks/exhaustive-deps

        }, [tableData.pageIndex, tableData.sort, tableData.pageSize, tableData.query])
  const customId : number = 99;
  return(

    <>
                <div className=" flex  justify-evenly pb-10">
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/privates/enrollee/companyinfo')}
                    icon={<HiPlus />}
                >
                    <span>Create Company</span>
                </Button>
                <Button
                    className="mr-2"
                    variant="solid"
                    onClick={() => navigate('/privates/enrollee/onboard')}
                    icon={<HiPlus />}
                >
                    <span>Onboard Employees</span>
                </Button>

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
        <p>hello</p>
        <Link to={`/nhia/enrollee/onboard/${customId}`}>Go to Custom Page</Link>
    </>

  )

}


export default ViewPrivates
