import Card from '@/components/ui/Card'
import { HiCheckCircle } from 'react-icons/hi'
import { NigerianState } from '@/data/NigerianStates'
import { Option } from '@/data/NigerianStates'
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

const planValidationSchema = Yup.object().shape({
    plan_name: Yup.string().required('plan name required'),
    plan_category: Yup.string().required('plan category required'),
    plan_type: Yup.string().required('plan type required'),
    allow_dependent: Yup.boolean().required('band required'),
    max_dependant: Yup.number().required('band required'),
    plan_age_limit: Yup.number().required('band required'),
    plan_cost: Yup.number().required('band required'),
})

const createHealthPlan = () => {


    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()
    const [planCategoryData, setPlanCategoryData] = useState<PlanCategory[]>()

    const [currentTab, setCurrentTab] = useState('tab1')



    const { useCreateHealthPlan, useGetHealthPlanCategory } = useHealthPlan()

    const { TabNav, TabList, TabContent } = Tabs
    const { getItem } = useLocalStorage()

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

    // const filterPlanCategory = (inputValue) => {
    //     return planCategoryData.filter((i) =>
    //         i.name.toLowerCase().includes(inputValue.toLowerCase())
    //     )
    // }
    // const filterPlanCategory = (inputValue: string) => {
    //     return planCategoryData?.filter((i) =>
    //         i.name.toLowerCase().includes(inputValue.toLowerCase())
    //     )
    // }
    // const newData: PlanCategory = planCategoryData

    const colourOptions: PlanCategory[] = planCategoryData!;

    const filterColors = (inputValue: string) => {
        return colourOptions.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const promiseOptions = (inputValue: string) =>
        new Promise<PlanCategory[]>((resolve) => {
            setTimeout(() => {
                resolve(filterColors(inputValue));
            }, 1000);
        });






    // const loadOptions = (inputValue, callback) => {
    //     setTimeout(() => {
    //         callback(filterPlanCategory(inputValue))
    //     }, 1000)
    // }

    // const handleInputChange = (newValue) => {
    //     const inputValue = newValue.replace(/\W/g, '')
    //     // setValue(inputValue)
    //     return inputValue
    // }


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

    console.log("test", planCategoryData)



    return (

        <>
            <div>
                <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}
                    variant='underline'>
                    <TabList>
                        <TabNav value="tab1" icon={<HiUserGroup />}>
                            Create Plan Category
                        </TabNav>
                        <TabNav value="tab2" icon={<HiOutlineDocumentAdd />}>
                            Create Plan
                        </TabNav>
                        <TabNav value="tab3" icon={<HiUserAdd />}>
                            Add Benenefit to Plan
                        </TabNav>
                    </TabList>
                    <div className="p-4">
                        <TabContent value="tab1">
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
                                            customIcon={<HiCheckCircle />}
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
                                        Add Customized Health  Category
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

                                        onSubmit={(values, { setSubmitting, resetForm }) => {
                                            onCreateHealthPlan(values, setSubmitting, resetForm)
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
                        </TabContent>
                        <TabContent value="tab2">
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
                                            customIcon={<HiCheckCircle />}
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

                                        onSubmit={(values, { setSubmitting, resetForm }) => {
                                            // onCreateHealthPlan(values, setSubmitting, resetForm)

                                        }}
                                    >
                                        {({ values, touched, errors, isSubmitting }) => (
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
                                                            {({ field, form }: FieldProps<FormModel>) => (
                                                                <Select
                                                                    field={field}
                                                                    // form={form}
                                                                    options={planCategoryData}
                                                                // value={planCategoryData.filter(
                                                                //     (option) =>
                                                                //         option.name ===
                                                                //         values.plan_name
                                                                // )}
                                                                // onChange={(option) =>
                                                                //     form.setFieldValue(
                                                                //         field.name,
                                                                //         option?.name
                                                                //     )
                                                                // }
                                                                />


                                                            )}
                                                        </Field>
                                                    </FormItem>

                                                    {/* plan_type */}
                                                    {/* <FormItem

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
                                                    </FormItem> */}

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
                                    {/* <Select
                                        cacheOptions
                                        loadOptions={loadOptions}
                                        defaultOptions
                                        onInputChange={handleInputChange}
                                        componentAs={AsyncSelect}
                                    /> */}

                                    <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions} />



                                </div>
                            </div>
                        </TabContent>
                        <TabContent value="tab3">
                            <p>
                                In C++ its harder to shoot yourself in the foot, but
                                when you do, you blow off your whole leg. (Bjarne
                                Stroustrup)
                            </p>
                        </TabContent>
                    </div>
                </Tabs>
            </div>



        </>


    )
}

export default createHealthPlan