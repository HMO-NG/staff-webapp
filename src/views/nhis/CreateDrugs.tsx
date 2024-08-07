import Card from '@/components/ui/Card'
import { HiCheckCircle, HiCloudUpload } from 'react-icons/hi'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import useHealthPlan, { healthPlan } from '@/utils/customAuth/useHealthPlanAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import { useLocalStorage } from '@/utils/localStorage'
import useNhia from '@/utils/customAuth/useNhisAuth'
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

const validationSchema = Yup.object().shape({
    name_of_drug: Yup.string().required('service name Required'),
    nhia_code: Yup.string().required('NHIA service code required'),
    dosage_form: Yup.string().required('Please specify the type'),
    strength: Yup.string().required('Please specify the type'),
    presentation: Yup.string().required('Please specify the type'),
    category: Yup.string().required('Please specify the type'),
    plan_type: Yup.string().required('Please specify the type'),
    price: Yup.string().required('service price required'),
})

const createDrugs = () => {

    const [healthPlan, setHealthPlan] = useState<healthPlan[]>([])

    const { useCreateNhiaDrugTarrifAuth } = useNhia()

    const { useGetHealthPlanAuth } = useHealthPlan()

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
        setSubmitting?: (isSubmitting: boolean) => void,
        resetForm?: () => void
    ) => {

        if (setSubmitting !== undefined) {
            setSubmitting(true)
        }

        const { getItem } = useLocalStorage()

        values.user_id = getItem("user")

        const data = await useCreateNhiaDrugTarrifAuth(values)

        if (data?.status === 'success') {

            openNotification(data.message, 'success')

            if (setSubmitting !== undefined) {
                setSubmitting(true)
            }

            if (resetForm !== undefined) {
                resetForm()
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
                        response = await Promise.all(batch.map((item: any) => useCreateNhiaDrugTarrifAuth(item)));
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
            const response = await useGetHealthPlanAuth({ sort: { order: 'asc' } })

            if (response.status === 'success' && response.data) {
                setHealthPlan(response.data)
            }

            if (response.status === 'failed') {
                openNotification(response.message, 'danger')
            }
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
                header="Add NHIA Drugs"
            >
                <p>
                    When adding NHIA Drugs, ensure that all fields are completed with the accurate information. Ensure that the you click on <b>Add NHIA Drugs</b> when done.
                </p>
            </Card>

            <div
                className='pt-5'>
                <Formik
                    enableReinitialize
                    initialValues={{

                        name_of_drug: '',
                        nhia_code: '',
                        dosage_form: '',
                        strength: '',
                        presentation: '',
                        category: '',
                        plan_type: '',
                        price: '',

                    }}
                    validationSchema={validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateProvider(values, setSubmitting, resetForm)
                    }}
                >
                    {({ values, touched, errors, isSubmitting }) => (
                        <Form>
                            <FormContainer>

                                {/* Name of drug */}
                                <FormItem
                                    asterisk
                                    label="Name"
                                    invalid={errors.name_of_drug && touched.name_of_drug}
                                    errorMessage={errors.name_of_drug}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name_of_drug"
                                        placeholder="Drug Name eg: Morphine"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* nhia code */}
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
                                        placeholder="Drug Code eg: NHIS-01-03-01"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* dosage_form */}
                                <FormItem

                                    asterisk
                                    label="Dosage"
                                    invalid={errors.dosage_form && touched.dosage_form}
                                    errorMessage={errors.dosage_form}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="dosage_form"
                                        placeholder="Dosage eg: Injection, Tablets etc."
                                        component={Input}
                                    />
                                </FormItem>

                                {/* strength */}
                                <FormItem

                                    asterisk
                                    label="Drug Strength"
                                    invalid={errors.strength && touched.strength}
                                    errorMessage={errors.strength}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="strength"
                                        placeholder="Drug Strengths eg: 0.5mg/amp, 5mg/ml in 2 ml etc."
                                        component={Input}
                                    />
                                </FormItem>

                                {/* presentation */}
                                <FormItem
                                    asterisk
                                    label="presentation"
                                    invalid={errors.presentation && touched.presentation}
                                    errorMessage={errors.presentation}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="presentation"
                                        placeholder="Drug Presentation eg:Amp., Capsule, Tablet etc."
                                        component={Input}
                                    />
                                </FormItem>

                                {/* category */}
                                <FormItem
                                    asterisk
                                    label="category"
                                    invalid={errors.category && touched.category}
                                    errorMessage={errors.category}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="category"
                                        placeholder="Drug Category eg: Pain relieve"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* plan_type */}
                                <FormItem
                                    asterisk
                                    label="Plan Type"
                                    invalid={errors.plan_type && touched.plan_type}
                                    errorMessage={errors.plan_type}
                                >
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

                                <FormItem>
                                    <Button variant="solid" type="submit"
                                        loading={isSubmitting}>
                                        {isSubmitting ?
                                            "Saving..."
                                            :
                                            "Add NHIA Drug Tarrif"
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

export default createDrugs