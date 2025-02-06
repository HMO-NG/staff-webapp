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

const sex = [
    { value: 'M', label: 'Male', color: '#5243AA' },
    { value: 'F', label: 'Female', color: '#0052CC' },
]

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
    const { useGetCompanyAuth, useCreateCompanyAuth } = usePrivates()
    const { useCreateNhiaEnrolleeAuth, OnboardNhiaCompanyEnrolleesAuth } =
        useEnrollee()
    const { useHealthCheckAuth } = useHealthCheck()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [companieslist, setCompaniesList] = useState<{
       label: string; value: string }[]
    >([])
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
                        OnboardNhiaCompanyEnrolleesAuth({company_info:company,enrolled_by:enrolled_by,data}),
                    ),
                )
                console.log(response)
                // console.log(response);
            }
        } catch (error) {
            console.error('File upload error:', error)
        }
    }
    // const getCompanies = async ()=>{
    //   const response = await useGetCompanyAuth();
    //   console.log('response',response);
    //   const formattedCompanies = response.data.map((company) => ({

    //     company_name: company.company_name,
    //     company_id: company.id,
    //   }));
    //   setCompanies(formattedCompanies);

    // }
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
        console.log('Updated companies:', companieslist) // This will log after state change
    }, [companieslist])

    return (
        <div>
            <Card header="Company Employee Onboarding">
                <p>
                    When adding NHIA Enrollee, ensure that all fields are
                    completed with the accurate information. Ensure that the you
                    click on <b>Add NHIA Enrollee</b> when done.
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
                        // alert(JSON.stringify(values, null, 2))
                    }}
                >
                    {({ values, touched, errors, isSubmitting }) => (
                        <Form>
                            <FormContainer>
                                {/* Policy ID */}
                                <FormItem
                                    asterisk
                                    label="Select Company"
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
                                                field={field}
                                                form={form}

                                                options={companieslist} // Now contains { label, value }
                                                value={
                                                  companieslist.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value,
                                                    ) || null
                                                }

                                                onChange={(option) =>{
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value);
                                                    setCompany({ company_name: option?.label, company_id: option?.value });
                                                }}

                                            />
                                        )}
                                    </Field>
                                    {/* <p>{company}</p> */}
                                </FormItem>
                                {/* <p>this is the company {company}</p> */}
                                {/* <p>This is the company: {company.company_name} (ID: {company.company_id})</p> */}
                               {!company.company_id ?(  <p>select company</p> ):(
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


                                {/* <FormItem>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Saving...'
                                            : 'send emails'}
                                    </Button>
                                </FormItem> */}
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default Onboarding
