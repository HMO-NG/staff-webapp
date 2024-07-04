import Card from '@/components/ui/Card'
import { HiCheckCircle } from 'react-icons/hi'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { useLocalStorage } from '@/utils/localStorage'
import { useNavigate } from 'react-router-dom'
import { HiCloudUpload, HiOutlinePlusCircle } from "react-icons/hi";
import { useEffect, useState } from 'react'
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

    benefit_name: Yup.string().required('Benefit name required'),
    category: Yup.string().required('benefit category required'),
    sub_category: Yup.string().required('benefit sub-category required'),

})

const CreateBenefit = () => {

    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()

    const [file, setFile] = useState<File | null>(null);
    const [showBtn, setShowBtn] = useState<Boolean>(false);

    const navigate = useNavigate()

    const { useCreateBenefitAuth, useBenefitBulkUploadAuth } = useHealthPlan()
    const { getItem } = useLocalStorage()

    const onCreateBenefit = async (values: any,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: () => void
    ) => {

        setSubmitting(true)

        values.user_id = getItem("user")

        const data = await useCreateBenefitAuth(values)

        if (data.status === 'success') {

            setTimeout(() => {
                setSuccessMessage(data.message)
                setSubmitting(false)
                resetForm()
            }, 2000)

        }

        if (data.status === 'failed') {
            setErrorMessage(data.message)
            setSubmitting(false)
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

        if (!file[0]) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target?.result;
            if (data) {
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);


                const result = await useBenefitBulkUploadAuth(jsonData)

                if (result.status === 'success') {
                    setSuccessMessage(result.data)
                }

                if (result.status === 'failed') {
                    setErrorMessage(result.data)
                }

                console.log(result)

            }
        };
        reader.readAsBinaryString(file[0]);
    };


    useEffect(() => {
        console.log("use effect ran")
    })

    return (
        <div>

            {
                errorMessage && (
                    <Alert showIcon className="mb-4" type="danger">
                        {errorMessage}
                    </Alert>
                )
            }
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
            <div className='pb-10'>
                {/* <input type="file" accept=".xlsx, .xls" onChange={onClickOpenFile} />
                <button onClick={handleFileUpload}>Upload</button> */}

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
                header="Health Benefit"
            >
                <p>
                    Add Health Benefit
                </p>
            </Card>

            <div className='pt-10'>
                <Formik
                    enableReinitialize
                    initialValues={{

                        benefit_name: '',
                        category: '',
                        sub_category: '',
                        user_id: ''

                    }}
                    validationSchema={validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateBenefit(values, setSubmitting, resetForm)
                    }}
                >
                    {({ values, touched, errors, isSubmitting }) => (
                        <Form>
                            <FormContainer>

                                <FormItem
                                    asterisk
                                    label="Benefit Name"
                                    invalid={errors.benefit_name && touched.benefit_name}
                                    errorMessage={errors.benefit_name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="benefit_name"
                                        placeholder="Health Benefit Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Benefit Category"
                                    invalid={errors.category && touched.category}
                                    errorMessage={errors.category}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="category"
                                        placeholder="Health Benefit Category"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem

                                    asterisk
                                    label="Benefit Sub-Category"
                                    invalid={errors.sub_category && touched.sub_category}
                                    errorMessage={errors.sub_category}
                                >
                                    <Field

                                        type="text"
                                        autoComplete="off"
                                        name="sub_category"
                                        placeholder="Health Benefit Subcategory"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmitting}
                                        icon={<HiOutlinePlusCircle />}
                                    >
                                        {isSubmitting ?
                                            "Saving..."
                                            :
                                            "Add Benefit"
                                        }

                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div >

    )
}

export default CreateBenefit