import Card from '@/components/ui/Card'
import { HiCheckCircle, HiCloudUpload } from 'react-icons/hi'
import { FormItem, FormContainer, } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import useNhia from '@/utils/customAuth/useNhisAuth'
import { useLocalStorage } from '@/utils/localStorage'
import { useEffect, useState } from 'react'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { healthPlan } from '@/utils/customAuth/useHealthPlanAuth'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
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

const validationSchema = Yup.object().shape({

    tarrif_type: Yup.string().required('Please specify the type'),
    name: Yup.string().required('tarrif name Required'),
    nhia_code: Yup.string().required('NHIA code required'),
    price: Yup.string().required('tarrif price required'),
    plan_type: Yup.string().required('choose plan associated with this tarrif'),
})

const createServiceTarrif = () => {

    const { useCreateNhiaServiceTarrifAuth } = useNhia()
    const { useGetHealthPlanAuth } = useHealthPlan()

    const [healthPlan, setHealthPlan] = useState<healthPlan[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    function openNotification(msg: string, notificationType: 'success' | 'warning' | 'danger' | 'info') {
        toast.push(
            <Notification
                title ={notificationType.toString()}
                type={notificationType}>

                {msg}
            </Notification>, {
            placement: 'top-center'
        })
    }

    const onCreateNhiaService = async (values: any,
        setSubmitting?: (isSubmitting: boolean) => void,
        resetForm?: () => void
    ) => {

        if (setSubmitting !== undefined) {
            setSubmitting(true)
        }

        const { getItem } = useLocalStorage()

        values.user_id = getItem("user")

        const data = await useCreateNhiaServiceTarrifAuth(values)

        if (data?.status === 'success') {

            if (setSubmitting !== undefined) {
                setSubmitting(false)
            }
            openNotification(data.message, 'success')

            if (resetForm !== undefined) {
                resetForm()
            }

        }

        if (data?.status === 'failed') {
            openNotification(data.message ? data?.message : "Something went wrong, we are working on it 😊", 'success')

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
                        response = await Promise.all(batch.map((item: any) => onCreateNhiaService(item)));

                        openNotification(`uploaded batch ${i / BATCH_SIZE + 1}`, 'success')
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
            const response = await useGetHealthPlanAuth({ sort: { order: 'asc' } })

            if (response.status === 'success' && response.data) {
                setHealthPlan(response.data)
                setIsLoading(false)
            }

            if (response.status === 'failed') {
                openNotification(response.message, 'danger')
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div>
            <div className='mx-5'>
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
                header="Add NHIA Service Tarrif"
            >
                <p>
                    When adding NHIA Services, ensure that all fields are completed with the accurate information. Ensure that the you click on <b>Add NHIA Service</b> when done.
                </p>
            </Card>

            <div
                className='pt-5'>
                <Formik
                    enableReinitialize
                    initialValues={{

                        name: '',
                        tarrif_type: '',
                        service_type: '',
                        nhia_code: '',
                        category: '',
                        sub_category: '',
                        plan_type: '',
                        price: '',
                        user_id: ''

                    }}
                    validationSchema={validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateNhiaService(values, setSubmitting, resetForm)
                    }}
                >
                    {({ values, touched, errors, isSubmitting }) => (
                        <Form>
                            <FormContainer>

                                {/* name */}
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
                                        placeholder="Service Name eg: Oesophagoscopy"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* nhis_code */}
                                <FormItem
                                    asterisk
                                    label="NHIA Code"
                                    invalid={errors.nhia_code && touched.nhia_code}
                                    errorMessage={errors.nhia_code}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="nhia_code"
                                        placeholder="NHIA Code eg: NHIS-010-001"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* service_type */}
                                <FormItem

                                    label="Service Type"
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="service_type"
                                        placeholder="Service Type eg: Primary, Secondary etc."
                                        component={Input}
                                    />
                                </FormItem>

                                {/* tarrif_type */}
                                <FormItem
                                    asterisk
                                    label="Tarrif Type"
                                    invalid={errors.tarrif_type && touched.tarrif_type}
                                    errorMessage={errors.tarrif_type}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="tarrif_type"
                                        placeholder="Tarrif Type eg: Procedures, Investigation etc."
                                        component={Input}
                                    />
                                </FormItem>

                                {/* price */}
                                <FormItem
                                    asterisk
                                    label="Price"
                                    invalid={errors.price && touched.price}
                                    errorMessage={errors.price}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="price"
                                        placeholder="price"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* category */}
                                <FormItem

                                    label="Category"
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="category"
                                        placeholder="Category"
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
                                        placeholder="Sub Category"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* plan_type */}

                                <FormItem
                                    label="Plan Type"
                                    invalid={errors.plan_type && touched.plan_type}
                                    errorMessage={errors.plan_type}>

                                    <Field

                                        name="plan_type">
                                        {({ field, form }: FieldProps<FormModel>) => (

                                            <Select
                                                options={healthPlan}
                                                placeholder={"Select Health Plan Name"}
                                                value={healthPlan.filter((item) =>
                                                    item.value === values.plan_type
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

                                {/* Button */}
                                <FormItem>
                                    <Button variant="solid" type="submit"
                                        loading={isSubmitting}>
                                        {isSubmitting ?
                                            "Saving..."
                                            :
                                            "Add NHIA Service Tarrif"
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

export default createServiceTarrif