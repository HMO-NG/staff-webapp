import Card from '@/components/ui/Card'
import { HiCheckCircle, HiCloudUpload } from 'react-icons/hi'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import { useLocalStorage } from '@/utils/localStorage'
import useEnrollee from '@/utils/customAuth/useEnrolleeAuth'
import useHealthCheck from '@/utils/customAuth/useHealthCheckerAuth'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useState, useEffect } from 'react'
import Upload from '@/components/ui/Upload'
import * as XLSX from 'xlsx'


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
    segment: string[];
    upload: File[];
}

const sex = [
    { value: "M", label: "Male", color: '#5243AA' },
    { value: "F", label: "Female", color: '#0052CC' },
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

const CreateNHIAEnrollee = () => {

    const { useCreateNhiaEnrolleeAuth } = useEnrollee()
    const { useHealthCheckAuth } = useHealthCheck()

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

    const onCreateEnrollee = async (values: any,
        setSubmitting?: (isSubmitting: boolean) => void,
        resetForm?: () => void
    ) => {

        if (setSubmitting !== undefined) {
            setSubmitting(true)
        }

        const { getItem } = useLocalStorage()

        values.user_id = getItem("user")

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

        const allowedFileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']

        if (files) {
            for (const f of files) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a .xlsx or .xls file!'
                }
            }
        }
        return valid
    }

    const handleFileUpload = async (file: File[], fileList: File[]) => {
        try {

            if (!file[0]) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = e.target?.result;
                if (data) {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);

                    const BATCH_SIZE = 10;
                    let response;

                    for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
                        const batch = jsonData.slice(i, i + BATCH_SIZE);
                        response = await Promise.all(batch.map((item: any) => useCreateNhiaEnrolleeAuth(item)));
                        console.log(response)
                        openNotification(`uploading batch ${i / BATCH_SIZE + 1}`, 'info')
                    }

                }
            };
            reader.readAsBinaryString(file[0]);

        } catch (error: any) {

            openNotification(error?.response?.data?.message || error.toString(), 'danger')
        }

    };

    useEffect(() => {
        const fetchData = async () => {

            await useHealthCheckAuth()

        }
        fetchData()
    }, [])

    return (
        <div>
            <div className='my-5'>
                <Upload
                    beforeUpload={beforeUpload}
                    onChange={handleFileUpload}
                >
                    <Button variant="solid" icon={<HiCloudUpload />}>
                        Upload your file
                    </Button>
                </Upload>
            </div>

            <Card
                header="Add NHIA Enrollee"
            >
                <p>
                    When adding NHIA Enrollee, ensure that all fields are completed with the accurate information. Ensure that the you click on <b>Add NHIA Enrollee</b> when done.
                </p>
            </Card>

            <div
                className='pt-5'>
                <Formik
                    enableReinitialize
                    initialValues={{

                        policy_id: '',
                        surname: '',
                        other_names: '',
                        relationship: '',
                        dob: null,
                        company_id: '',
                        sex: '',
                        provider_Address: '',
                        provider_id: '',
                        provider_name: ''

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
                                    label="Policy ID"
                                    invalid={errors.policy_id && touched.policy_id}
                                    errorMessage={errors.policy_id}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="policy_id"
                                        placeholder="Policy ID eg: 123456"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* Surname */}
                                <FormItem
                                    asterisk
                                    label="Surname"
                                    invalid={errors.surname && touched.surname}
                                    errorMessage={errors.surname}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="surname"
                                        placeholder="surname"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* other_names */}
                                <FormItem
                                    asterisk
                                    label="Other Names"
                                    invalid={errors.other_names && touched.other_names}
                                    errorMessage={errors.other_names}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="other_names"
                                        placeholder="Other Names"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* relationship */}
                                <FormItem
                                    label="relationship"
                                    invalid={errors.relationship && touched.relationship}
                                    errorMessage={errors.relationship}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="relationship"
                                        placeholder="Relationship eg: Principal, Spouse etc."
                                        component={Input}
                                    />
                                </FormItem>

                                {/* dob */}
                                <FormItem
                                    asterisk
                                    label="Date of Birth"
                                    invalid={errors.dob && touched.dob}
                                    errorMessage={errors.dob}
                                >
                                    <Field

                                        name="dob">
                                        {({ field, form }: FieldProps<FormModel>) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={values.dob}
                                                placeholder="Pick a date"
                                                onChange={(date) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        date
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* company_id */}
                                <FormItem
                                    label="Company ID"
                                    invalid={errors.company_id && touched.company_id}
                                    errorMessage={errors.company_id}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="company_id"
                                        placeholder="Company ID eg: KN/0082/P"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* sex */}
                                <FormItem
                                    asterisk
                                    label="sex"
                                    invalid={errors.sex && touched.sex}
                                    errorMessage={errors.sex}
                                >
                                    <Field
                                        name="sex">
                                        {({ field, form }: FieldProps<FormModel>) => (

                                            <Select
                                                options={sex}
                                                placeholder={"Select Enrollee Sex"}
                                                value={sex.filter((item) =>
                                                    item.value === values.sex
                                                )}
                                                onChange={(data) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        data?.value
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* provider_Address */}
                                <FormItem
                                    label="Provider Address"
                                    invalid={errors.provider_Address && touched.provider_Address}
                                    errorMessage={errors.provider_Address}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="provider_Address"
                                        placeholder="Provider Address"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* provider_id */}
                                <FormItem
                                    asterisk
                                    label="Provider ID"
                                    invalid={errors.provider_id && touched.provider_id}
                                    errorMessage={errors.provider_id}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="provider_id"
                                        placeholder="Provider ID eg. KN/0199/P"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* provider_name */}
                                <FormItem
                                    asterisk
                                    label="Provider Name"
                                    invalid={errors.provider_name && touched.provider_name}
                                    errorMessage={errors.provider_name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="provider_name"
                                        placeholder="Provider Name"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem>
                                    <Button variant="solid" type="submit"
                                        loading={isSubmitting}>
                                        {isSubmitting ?
                                            "Saving..."
                                            :
                                            "Add NHIA Enrollee"
                                        }

                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>

    )
}

export default CreateNHIAEnrollee