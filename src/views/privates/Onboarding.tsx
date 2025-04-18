import * as Yup from 'yup'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { Field, Form, Formik } from 'formik'
import Upload from '@/components/ui/Upload'
import useHealthCheck from '@/utils/customAuth/useHealthCheckerAuth'
import useEnrollee from '@/utils/customAuth/useEnrolleeAuth'
import Notification from '@/components/ui/Notification'
import Card from '@/components/ui/Card'
import { HiCheckCircle, HiCloudUpload } from 'react-icons/hi'
import { useState, useEffect } from 'react'
import toast from '@/components/ui/toast'
import { useLocalStorage } from '@/utils/localStorage'
import * as XLSX from 'xlsx'
import type { FieldProps } from 'formik'
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
import { SingleValue } from "react-select";

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
type Select_Type={
  label: string
   value: string
}



const validationSchema = Yup.object().shape({
    policy_id: Yup.string().required('Policy ID Required'),
    surname: Yup.string().required('Enrollee Surname Required'),
    other_names: Yup.string().required('Enrollee Other Names Required'),
    dob: Yup.date().required('Date of Birth Reqired'),
    sex: Yup.string().required('Sex of Enrollee Required'),
    provider_id: Yup.string().required('Please specify the provider ID'),
    provider_name: Yup.string().required('Please specify the provider Name'),
})

const Onboarding = () => {
    const { useGetCompanyAuth, useCreateCompanyAuth,OnboardPrivateEnrolleesAuth } = usePrivates()
    const { useCreateNhiaEnrolleeAuth } =
        useEnrollee()
    const { useHealthCheckAuth } = useHealthCheck()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [companieslist, setCompaniesList] = useState<{
       label: string; value: string }[]
    >([])
      const [selectedCompany, setselectedCompany] = useState<Select_Type | null>(companieslist[0])
    const [company, setCompany] = useState<{
       company_name: string,
       company_id: string
      }>({
            company_name:'',
            company_id:''
      })
    function openNotification(
        msg: string,
        notificationType: 'success' | 'warning' | 'danger' | 'info',
    ) {
        toast.push(
            <Notification
                title={notificationType.toString()}
                type={notificationType}
            >
                {msg}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    const onCreateEnrollee = async (
        values: any,
        setSubmitting?: (isSubmitting: boolean) => void,
        resetForm?: () => void,
    ) => {
        if (setSubmitting !== undefined) {
            setSubmitting(true)
        }

        const { getItem } = useLocalStorage()

        values.user_id = getItem('user')

        const data = await useCreateNhiaEnrolleeAuth(values)

        if (data?.status === 'success') {
            openNotification(data.message, 'success')

            if (setSubmitting !== undefined) {
                setSubmitting(true)
            }

            if (resetForm !== undefined) {
                resetForm()
            }
        }

        if (data?.status === 'failed') {
            openNotification(data.message, 'danger')

            if (setSubmitting !== undefined) {
                setSubmitting(false)
            }
        }
    }

    const beforeUpload = (files: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
        ]

        if (files) {
            for (const f of files) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a .xlsx or .xls file!'
                }
            }
        }
        return valid
    }

    const handleFileUpload = async (files: File[], fileList: File[]) => {
        try {
            if (!files.length) return

            const BATCH_SIZE = 100 // Adjust this for performance
            const file = files[0]

            // Convert File to ArrayBuffer using FileReader (React-friendly)
            const arrayBuffer = await file.arrayBuffer()

            // Parse the Excel file
            const workbook = XLSX.read(arrayBuffer, { type: 'array' })

            // Extract data from the first sheet
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(sheet)
            const { getItem } = useLocalStorage()

            const enrolled_by = getItem("user")
            console.log('jsonData:',jsonData)
            let response
            for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
                const batch = jsonData.slice(i, i + BATCH_SIZE)
                response = await Promise.all(
                    batch.map((data: any) =>
                      OnboardPrivateEnrolleesAuth({company_info:company,enrolled_by:enrolled_by,data}),
                    ),
                )
            // openNotification(`uploading batch ${i / BATCH_SIZE + 1}`, 'info')

                console.log(response)
            }
        } catch (error) {
            console.error('File upload error:', error)
        }
    }

    const getCompanies = async () => {
        try {
            const response = await useGetCompanyAuth() // Fetch API data

            if (
                response?.status === 'success' &&
                Array.isArray(response.data)
            ) {
                // Extract only 'id' and 'company_name'
                const formattedCompanies = response.data.map((company) => ({
                    value: company.id,
                    label: company.company_name,
                }))

                setCompaniesList(formattedCompanies) // Update state with filtered data
            } else {
                console.error('Invalid response format')
            }
        } catch (error) {
            console.error('Failed to fetch companies', error)
        }
    }

    useEffect(() => {
        getCompanies()
        console.log('co', companieslist)
        console.log(companieslist)
    }, [])
    useEffect(() => {
        console.log('Updated companies:', companieslist)
    }, [companieslist])

    return (
        <div>
            <Card header="Client Employee Onboarding">
                <p>
                    make sure to select the company name of the enrollees you would like
                    to onboard click <b>Upload your file</b> then paste your master list.
                </p>
            </Card>

            <div className="pt-5">
                <Formik
                    enableReinitialize
                    initialValues={{
                        company_name: '',
                        company_id: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateEnrollee(values, setSubmitting, resetForm)
                    }}
                >
                    {({ values, touched, errors, isSubmitting }) => (
                        <Form>
                            <FormContainer>
                                {/* Policy ID */}
                                <FormItem
                                    asterisk
                                    label="Select Client"
                                    invalid={
                                        errors.company_name &&
                                        touched.company_name
                                    }
                                    errorMessage={errors.company_name}
                                >
                                    <Field name="company_id">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <Select
                                                options={companieslist}
                                                value={selectedCompany}

                                                onChange={(option:SingleValue<Select_Type>) =>{
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value);
                                                    setCompany({ company_name: `${option?.label}`, company_id: `${option?.value}` });
                                                    setselectedCompany(option)
                                                }}
                                                placeholder={"Select Client"}

                                            />
                                        )}
                                    </Field>

                                </FormItem>
                               {!company.company_id ?(  <p className="font-normal heading-text">Client not selected !!</p> ):(
                                 <div className="my-5">
                                 <Upload
                                     beforeUpload={beforeUpload}
                                     onChange={handleFileUpload}
                                 >
                                     <Button
                                         variant="solid"
                                         icon={<HiCloudUpload />}
                                     >
                                         Upload your file
                                     </Button>
                                 </Upload>
                             </div>

                                  )}

                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default Onboarding
