import Card from '@/components/ui/Card'
import {HiCheckCircle} from 'react-icons/hi'
import {NigerianState} from '@/data/NigerianStates'
import {Option} from '@/data/NigerianStates'
import {FormItem, FormContainer} from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import {Field, Form, Formik} from 'formik'
import Alert from '@/components/ui/Alert'
import * as Yup from 'yup'
import type {FieldProps} from 'formik'
import useHealthPlan, {PlanCategory} from '@/utils/customAuth/useHealthPlanAuth'
import {useLocalStorage} from '@/utils/localStorage'
import Tabs from '@/components/ui/Tabs'
import {HiUserAdd, HiOutlineDocumentAdd, HiUserGroup} from 'react-icons/hi'
import {useEffect, useState} from 'react'
import AsyncSelect from 'react-select/async'
import {it} from "node:test";


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



const createHealthPlan = () => {


    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()
    const [planCategoryData, setPlanCategoryData] = useState<PlanCategory[]>()

    const [currentTab, setCurrentTab] = useState('tab1')


    const {useCreateHealthPlan, useGetHealthPlanCategory} = useHealthPlan()

    const {TabNav, TabList, TabContent} = Tabs
    const {getItem} = useLocalStorage()

    const onCreateHealthPlan = async (values: any,
                                      setSubmitting: (isSubmitting: boolean) => void,
                                      resetForm: () => void
    ) => {

        setSubmitting(true)

        values.user_id = getItem("user")

        const data = await useCreateHealthPlan(values)


        if (data) {

            setTimeout(() => {
                setSuccessMessage(data.message)
                setSubmitting(false)
                resetForm()
            }, 2000)

        }

    }


    useEffect(() => {
        const fetchData = async () => {
            const response = await useGetHealthPlanCategory()
            if (response?.status === 'success') {
                setPlanCategoryData(response.data)
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [])

    return (
        <>
            {
                errorMessage && (
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
                           title='Successfully'
                           duration={10000}>
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

            <div>
                <Formik
                    enableReinitialize
                    initialValues={{

                        plan_name: '',
                        plan_category: '',
                        plan_type: '',
                        plan_description: '',
                        allow_dependent: false,
                        max_dependant: 0,
                        plan_age_limit: 65,
                        plan_cost: 0,
                        user_id: ''

                    }}
                    validationSchema={planValidationSchema}

                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        alert(values)
                        console.log("values", values)
                    }}
                >
                    {({values, touched, errors, isSubmitting}) => (
                        <Form>
                            <FormContainer>
                                {/* Plan Name */}
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
                                {/* plan_category */}
                                <FormItem
                                    asterisk
                                    label="Plan Category"
                                    invalid={errors.plan_category && touched.plan_category}
                                    errorMessage={errors.plan_category}
                                >
                                    <Field name="plan_category">
                                        {({field, form}: FieldProps<FormModel>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={planCategoryData}
                                                value={planCategoryData?.filter(
                                                    (items) =>
                                                        items.label === values.plan_category
                                                )}

                                                onChange={(items) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        items?.label
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem>
                                    <Button variant="solid" type="submit"
                                            loading={isSubmitting}>

                                        {isSubmitting ?
                                            "Customizing Plan"
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

        </>


    )
}

export default createHealthPlan