import Card from '@/components/ui/Card'
import { HiCheckCircle, HiCloudUpload } from 'react-icons/hi'
import { NigerianState } from '@/data/NigerianStates'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import useProvider from '@/utils/customAuth/useProviderAuth'
import { useLocalStorage } from '@/utils/localStorage'
import Upload from '@/components/ui/Upload'
import * as XLSX from 'xlsx'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

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

const validationSchema = Yup.object().shape({

    state: Yup.string().required('Please providers state!'),
    name: Yup.string().required('provider name Required'),
    email: Yup.string().email('Invalid email').required('Email Required'),
    address: Yup.string().required('address name Required'),
    phone_number: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 11 digits and contain only numbers')
        .required('Provider Phone number is required'),
    medical_director_name: Yup.string()
        .min(3, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Medical Director Name Required'),
    medical_director_phone_no: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 11 digits and contain only numbers')
        .required('Medical Director Phone number is required'),

})

const CreateProvider = () => {

    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()

    const { useCreateProvider, useCreateNHIAProviderAuth } = useProvider()

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

    const onCreateProvider = async (values: any,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: () => void
    ) => {

        setSubmitting(true)

        const { getItem } = useLocalStorage()

        values.user_id = getItem("user")

        const data = await useCreateProvider(values)

        if (data?.data) {

            setTimeout(() => {
                setSuccessMessage(data.message)
                setSubmitting(false)
                resetForm()
            }, 3000)

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
                        response = await Promise.all(batch.map((item: any) => useCreateNHIAProviderAuth(item)));
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

    return (
        <div>
            {errorMessage && (
                <Alert showIcon className="mb-4" type="danger">
                    {errorMessage}
                </Alert>
            )}
            {
                successMessage && (
                    <Alert closable
                        showIcon
                        type="success"
                        customIcon={<HiCheckCircle />}
                        title='Successfully'
                        duration={10000}>
                        {successMessage}
                    </Alert>
                )
            }
            <div className='my-5'>
                <Upload
                    beforeUpload={beforeUpload}
                    onChange={handleFileUpload}
                >
                    <Button variant="solid" icon={<HiCloudUpload />}>
                        Bulk Upload for NHIA Providers
                    </Button>
                </Upload>
            </div>
            <Card
                header="Add Providers"
            >
                <p>
                    When adding providers, ensure that all fields are completed with the accurate information. Ensure that the you click on save when done.
                </p>
            </Card>

            <div>
                <Formik
                    enableReinitialize
                    initialValues={{

                        name: '',
                        email: '',
                        address: '',
                        phone_number: '',
                        medical_director_name: '',
                        state: '',
                        code: '',
                        user_id: '',
                        medical_director_phone_no: ''

                    }}
                    validationSchema={validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateProvider(values, setSubmitting, resetForm)


                    }}
                >
                    {({ values, touched, errors, isSubmitting }) => (
                        <Form>
                            <FormContainer>

                                <FormItem
                                    asterisk
                                    label="Name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Provider Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Email"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Provider Email"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Address"
                                    invalid={errors.address && touched.address}
                                    errorMessage={errors.address}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="address"
                                        placeholder="Provider Address"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Provider Phone number"
                                    invalid={errors.phone_number && touched.phone_number}
                                    errorMessage={errors.phone_number}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="phone_number"
                                        placeholder="Phone Number"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem

                                    asterisk
                                    label="Medical Director Name"
                                    invalid={errors.medical_director_name && touched.medical_director_name}
                                    errorMessage={errors.medical_director_name}
                                >
                                    <Field

                                        type="text"
                                        autoComplete="off"
                                        name="medical_director_name"
                                        placeholder="Medical Director Name"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="State"
                                    invalid={errors.state && touched.state}
                                    errorMessage={errors.state}
                                >
                                    <Field name="state">
                                        {({ field, form }: FieldProps<FormModel>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={NigerianState}
                                                value={NigerianState.filter(
                                                    (option) =>
                                                        option.label ===
                                                        values.state
                                                )}
                                                onChange={(option) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.label
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>

                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Medical Director Phone number"
                                    invalid={errors.medical_director_phone_no && touched.medical_director_phone_no}
                                    errorMessage={errors.medical_director_phone_no}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="medical_director_phone_no"
                                        placeholder="Phone Number"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem>
                                    <Button variant="solid" type="submit"
                                        loading={isSubmitting}>
                                        {isSubmitting ?
                                            "Generating Provider Code"
                                            :
                                            "Add Provider"
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

export default CreateProvider