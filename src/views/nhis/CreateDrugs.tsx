import Card from '@/components/ui/Card'
import { HiCheckCircle } from 'react-icons/hi'
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

    drug_name: Yup.string().required('service name Required'),
    code: Yup.string().required('NHIA service code required'),
    dosage: Yup.string().required('Please specify the type'),
    strengths: Yup.string().required('Please specify the type'),
    presentation: Yup.string().required('Please specify the type'),
    price: Yup.string().required('service price required'),
})



const createDrugs = () => {

    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()

    const { useCreateProvider } = useProvider()

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

                        service_name: '',
                        code: '',
                        dosage: '',
                        strengths: '',
                        presentation: '',
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

                                <FormItem
                                    asterisk
                                    label="Name"
                                    invalid={errors.service_name && touched.service_name}
                                    errorMessage={errors.service_name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Drug Name eg: Morphine"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="code"
                                    invalid={errors.code && touched.code}
                                    errorMessage={errors.code}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="Code"
                                        placeholder="Drug Code eg: NHIS-01-03-01"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem

                                    asterisk
                                    label="Dosage"
                                    invalid={errors.dosage && touched.dosage}
                                    errorMessage={errors.dosage}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="type"
                                        placeholder="Dosage eg: Injection, Tablets etc."
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem

                                    asterisk
                                    label="Drug Strength"
                                    invalid={errors.strengths && touched.strengths}
                                    errorMessage={errors.strengths}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="strengths"
                                        placeholder="Drug Strengths eg: 0.5mg/amp, 5mg/ml in 2 ml etc."
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="presentation"
                                    invalid={errors.strengths && touched.strengths}
                                    errorMessage={errors.strengths}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="presentation"
                                        placeholder="Drug Presentation eg:Amp., Capsule, Tablet etc."
                                        component={Input}
                                    />
                                </FormItem>
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
                                            "Add NHIA Drug"
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