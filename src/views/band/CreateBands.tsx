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
import useBandAuth from '@/utils/customAuth/useBandAuth'
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
    name: Yup.string().required('Band name is Required'),
})

const CreateBand = () => {

    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()

    const {useCreateBandAuth } = useBandAuth()

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

    const onCreateBand = async (values: any,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: () => void
    ) => {

        setSubmitting(true)

        const { getItem } = useLocalStorage()

        values.created_by = getItem("user")

        const data = await useCreateBandAuth(values)

        if (data?.data) {
            setTimeout(() => {
              if (data?.status ==='success'){
                setSuccessMessage(data.message)
              }
                setSubmitting(false)
                resetForm()
            }, 3000)

        }

        else if (data?.status ==='failed'){
          setTimeout(() => {
              setErrorMessage(data.message)
              setSubmitting(false)
              resetForm()
          }, 3000)
          setErrorMessage(data.message)
        }

    }



    return (
        <div>
            {errorMessage && (
                <Alert closable
                showIcon
                type="danger"
                title='failed'
                customIcon={<HiCheckCircle />}
                duration={10000}>
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

            <Card header='Band' className='mb-5'>
              <p>Create Band</p>
            </Card>




            <div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        name: '',
                        description: null,
                    }}
                    validationSchema={validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateBand(values, setSubmitting, resetForm)


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
                                        placeholder="Band Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Description"
                                    invalid={errors.description && touched.description}
                                    errorMessage={errors.description}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="description"
                                        placeholder="Band Description"
                                        component={Input}
                                    />
                                </FormItem>


                                <FormItem>
                                    <Button variant="solid" type="submit"
                                        loading={isSubmitting}>
                                        {isSubmitting ?
                                            "Saving..."
                                            :
                                            "create Band"
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

export default CreateBand
