import Card from '@/components/ui/Card'
import { HiCheckCircle } from 'react-icons/hi'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'
import useNhia from '@/utils/customAuth/useNhisAuth'
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

    type: Yup.string().required('Please specify the type'),
    name: Yup.string().required('service name Required'),
    code: Yup.string().required('NHIA service code required'),
    price: Yup.string().required('service price required'),
})

const createService = () => {

    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()

    const { useCreateNhiaService } = useNhia()

    const onCreateNhiaService = async (values: any,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: () => void
    ) => {

        setSubmitting(true)

        const { getItem } = useLocalStorage()

        values.user_id = getItem("user")

        const data = await useCreateNhiaService(values)

        if (data?.status === 'success') {

            setSuccessMessage(data.message)
            setSubmitting(false)
            resetForm()

        }

        if (data?.status === 'failed') {
            setErrorMessage(data.message ? data?.message : "Something went wrong, we are working on it 😊")
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
                header="Add NHIA Service"
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
                        code: '',
                        type: '',
                        price: '',

                    }}
                    validationSchema={validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateNhiaService(values, setSubmitting, resetForm)


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
                                        placeholder="Service Name eg: Oesophagoscopy"
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
                                        name="code"
                                        placeholder="Service Code eg: NHIS-010-001"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem

                                    asterisk
                                    label="Type"
                                    invalid={errors.type && touched.type}
                                    errorMessage={errors.type}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="type"
                                        placeholder="Service Type eg: Primary, Secondary etc."
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
                                            "Add NHIA Service"
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

export default createService