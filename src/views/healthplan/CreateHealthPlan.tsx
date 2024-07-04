import Card from '@/components/ui/Card'
import { HiCheckCircle } from 'react-icons/hi'
import { NigerianState } from '@/data/NigerianStates'
import Segment from '@/components/ui/Segment'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import useHealthPlan, { PlanCategory } from '@/utils/customAuth/useHealthPlanAuth'
import { useLocalStorage } from '@/utils/localStorage'
import Tabs from '@/components/ui/Tabs'
import { HiUserAdd, HiOutlineDocumentAdd, HiUserGroup } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import createHealthPlan from "@/views/healthplan/CreateHealthPlan";
import { Radio } from "@/components/ui";
import classNames from "classnames";


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

const allowDependent = [
    { value: true, label: "Yes", color: '#5243AA' },
    { value: false, label: "No", color: '#0052CC' },
]

const maxDependent = [
    { value: "1", label: "1", color: '#5243AA' },
    { value: "2", label: "2", color: '#0052CC' },
    { value: "3", label: "3", color: '#0052CC' },
    { value: "4", label: "4", color: '#0052CC' },
    { value: "5", label: "5", color: '#0052CC' },
    { value: "6", label: "6", color: '#0052CC' },
    { value: "7", label: "7", color: '#0052CC' },
    { value: "8", label: "8", color: '#0052CC' },
    { value: "9", label: "9", color: '#0052CC' },
    { value: "10", label: "10", color: '#0052CC' },
]

const planType = [
    { value: "family", label: "Family", color: '#5243AA' },
    { value: "individual", label: "Individual", color: '#5243AA' },
]

const planValidationSchema = Yup.object().shape({
    plan_name: Yup.string().required('plan name required'),
    plan_category: Yup.string().required('plan category required'),
    plan_type: Yup.string().required('plan type required'),
    allow_dependent: Yup.boolean().required('required'),
    max_dependant: Yup.number().required('maximum dependants required'),
    plan_age_limit: Yup.number().required('age limit required'),
    plan_cost: Yup.number().required('plan cost required'),
})

const CreatePlan = () => {


    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()

    const [planCategoryData, setPlanCategoryData] = useState<PlanCategory[]>()

    const { useCreateHealthPlanAuth, useGetHealthPlanCategoryAuth } = useHealthPlan()

    const { getItem } = useLocalStorage()

    const onCreateHealthPlan = async (
        values: any,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: () => void
    ) => {

        setSubmitting(true)

        values.user_id = getItem("user")

        const response = await useCreateHealthPlanAuth(values)

        // alert(JSON.stringify(response, null, 2))

        if (response.status === 'success') {
            setSuccessMessage(response.message)
            setSubmitting(false)
            resetForm()
        }

        if (response.status === 'failed') {
            setErrorMessage(response.message)
            setSubmitting(false)
        }

    }


    useEffect(() => {
        const fetchData = async () => {
            const response = await useGetHealthPlanCategoryAuth()
            if (response.status === 'success') {
                setPlanCategoryData(response.data)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [])

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
                    >
                        {successMessage}
                    </Alert>
                )
            }
            <Card
                header="Add Health Plan"
            >
                <p>
                    Add Customized Health Plan
                </p>
            </Card>

            <div className='pt-10'>
                <Formik
                    enableReinitialize
                    initialValues={{
                        plan_name: '',
                        plan_category: '',
                        plan_type: '',
                        allow_dependent: false,
                        max_dependant: '',
                        plan_age_limit: '',
                        plan_cost: '',
                    }}
                    validationSchema={planValidationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateHealthPlan(values, setSubmitting, resetForm)
                    }}>
                    {({ values, touched, errors, isSubmitting }) =>
                    (
                        <Form>
                            <FormContainer>

                                {/* plan name */}
                                <FormItem
                                    asterisk
                                    label="Plan Name"
                                    invalid={errors.plan_name && touched.plan_name}
                                    errorMessage={errors.plan_name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="plan_name"
                                        placeholder="Health Plan Name"
                                        component={Input}
                                    />
                                </FormItem>

                                {/*plan category*/}
                                <FormItem
                                    asterisk
                                    label="Plan Category"
                                    invalid={errors.plan_category && touched.plan_category}
                                    errorMessage={errors.plan_category}
                                >
                                    <Field name="plan_category">
                                        {({ field, form }: FieldProps<FormModel>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={planCategoryData}
                                                value={planCategoryData?.filter(
                                                    (items) =>
                                                        items.value === values.plan_category
                                                )}

                                                onChange={(items) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        items?.value
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/*plan type */}
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
                                                field={field}
                                                form={form}
                                                options={planType}
                                                value={planType?.filter(
                                                    (items) =>
                                                        items.value === values.plan_type
                                                )}

                                                onChange={(items) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        items?.value
                                                    )
                                                } />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* allow dependent*/}
                                <FormItem
                                    asterisk
                                    label="Allow Dependant?"
                                    invalid={errors.allow_dependent && touched.allow_dependent}
                                    errorMessage={errors.allow_dependent}
                                >
                                    <Field
                                        name="allow_dependent">
                                        {({ field, form }: FieldProps<FormModel>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={allowDependent}
                                                value={allowDependent?.filter(
                                                    (items) =>
                                                        items.value === values.allow_dependent
                                                )}

                                                onChange={(items) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        items?.value
                                                    )
                                                } />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* max dependent*/}
                                <FormItem
                                    asterisk
                                    label="Maximum Dependant"
                                    invalid={errors.max_dependant && touched.max_dependant}
                                    errorMessage={errors.max_dependant}
                                >
                                    <Field
                                        name="max_dependant">
                                        {({ field, form }: FieldProps<FormModel>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={maxDependent}
                                                value={maxDependent?.filter(
                                                    (items) =>
                                                        items.value === values.max_dependant
                                                )}

                                                onChange={(items) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        items?.label
                                                    )
                                                } />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* plan age limit*/}
                                <FormItem
                                    asterisk
                                    label="Age Limit"
                                    invalid={errors.plan_age_limit && touched.plan_age_limit}
                                    errorMessage={errors.plan_age_limit}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="plan_age_limit"
                                        placeholder="Health Plan Age limit"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* Plan Cost */}
                                <FormItem
                                    asterisk
                                    label="Plan Cost"
                                    invalid={errors.plan_cost && touched.plan_cost}
                                    errorMessage={errors.plan_cost}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="plan_cost"
                                        placeholder="Annual Plan Cost"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem>
                                    <Button variant="solid" type="submit"
                                        loading={isSubmitting}>
                                        {isSubmitting ?
                                            "Saving"
                                            :
                                            "Add Health Plan Category"
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

export default CreatePlan