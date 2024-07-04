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
import createHealthPlan from "@/views/healthplan/CreateHealthPlan";


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

const planCategoryValidationSchema = Yup.object().shape({

    name: Yup.string().required('health plan name Required'),
    description: Yup.string().required('what is this plan about?'),
    band: Yup.string().required('band required'),
})

const CreatePlanCategory = () => {


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
        <div>
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
                header="Add Health  Category"
            >
                <p>
                    Add Customized Health Category
                </p>
            </Card>

            <div>
                <Formik
                    enableReinitialize
                    initialValues={{

                        name: '',
                        description: '',
                        band: '',
                        user_id: ''

                    }}
                    validationSchema={planCategoryValidationSchema}

                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        onCreateHealthPlan(values, setSubmitting, resetForm)
                    }}
                >
                    {({values, touched, errors, isSubmitting}) =>
                        (
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
                                        placeholder="Health Plan Name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Band"
                                    invalid={errors.band && touched.band}
                                    errorMessage={errors.band}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="band"
                                        placeholder="Health Plan Band"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem

                                    asterisk
                                    label="description"
                                    invalid={errors.description && touched.description}
                                    errorMessage={errors.description}
                                >
                                    <Field

                                        type="text"
                                        autoComplete="off"
                                        name="description"
                                        placeholder="What is this plan for?"
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

export default CreatePlanCategory