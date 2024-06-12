import Card from '@/components/ui/Card'
import { useState } from 'react'
import { HiOutlineEyeOff, HiOutlineEye, HiFire, HiCheckCircle } from 'react-icons/hi'
import type { MouseEvent } from 'react'
import Container from '@/components/shared/Container'
import { NigerianState } from '@/data/NigerianStates'
import { values } from 'lodash'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import TimeInput from '@/components/ui/TimeInput'
import Checkbox from '@/components/ui/Checkbox'
import Radio from '@/components/ui/Radio'
import Switcher from '@/components/ui/Switcher'
import Segment from '@/components/ui/Segment'
import Upload from '@/components/ui/Upload'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import { generateProviderCode, createProvider } from '@/services/ProviderService'


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
        .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits and contain only numbers')
        .required('Provider Phone number is required'),
    medical_director_name: Yup.string()
        .min(3, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Medical Director Name Required'),
    medical_director_phone_no: Yup.string()
        .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits and contain only numbers')
        .required('Medical Director Phone number is required'),

})

const CreateProvider = () => {

    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()


    const onCreateProvider = async (values) => {

        // generate provider code
        try {
            const result = await generateProviderCode()
            const codeLength = result.data.data.length
            console.log(codeLength)

            // check for errors
            values.code = `${values.state}/${codeLength}`

            const  data = await createProvider(values)

            console.log(data)

            // if (data?.status === 'failed') {
            //     setErrorMessage(data.message)
            // }

        } catch (error) {

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
                    customIcon={<HiCheckCircle/>}
                    title='Provided Added Successfully'
                    duration={10000}>
                        {successMessage}
                    </Alert>
                )
            }
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
                        medical_director_phone_no: ''

                    }}
                    validationSchema={validationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        console.log('values', values)
                        onCreateProvider(values)

                        setTimeout(() => {
                            // JSON.stringify(values, null, 2)
                            setSubmitting(false)
                            setSuccessMessage(`${values.name} added successfully with code ${values.code} and will be awaiting verification`)
                            resetForm()

                        }, 5000)
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
                                                        option.value ===
                                                        values.state
                                                )}
                                                onChange={(option) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value
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