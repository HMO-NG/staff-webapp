import Select from '@/components/ui/Select'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { useEffect, useState } from 'react'
import { string } from 'yup'
import { healthPlan } from '@/utils/customAuth/useHealthPlanAuth'
import { Card, Tag } from '@/components/ui'
import Spinner from '@/components/ui/Spinner'
import { Field, FieldArray, Form, Formik, getIn, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiMinus } from 'react-icons/hi'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { benefitList } from '@/utils/customAuth/useHealthPlanAuth'



type FormModel = {
    users: {
        name: string
        limit_type: string
    }[]
}

const limit_type = [
    { value: "max_freqency_per_year", label: "Max Frequency Per Year", color: '#5243AA' },
    { value: "max_cost_per_year", label: "Max Cost Per Year", color: '#0052CC' },
    { value: "max_enrollee_age", label: "Max Entrollee Age", color: '#0052CC' },
    { value: "min_enrollee_age", label: "Min Entrollee Age", color: '#0052CC' },
]
const AttachHealthPlanBenefit = () => {

    const [healthPlan, setHealthPlan] = useState<healthPlan[]>([])
    const [benefitList, setBenefitList] = useState<benefitList[]>([])

    const [selectedHealthPlan, setSelectedHealthPlan] = useState<healthPlan>()

    const [isLoading, setIsLoading] = useState(true)

    const { useGetHealthPlanAuth, useGetAllBenefitListAuth } = useHealthPlan()

    const validationSchema = Yup.object({
        benefit_limit: Yup.array().of(
            Yup.object().shape({
                benefit_name: Yup.string().required('Benefit Required'),
                limit_type: Yup.string().required('Limit Type Required'),
                limit_value: Yup.number().required("Limit Required")
            })
        )
    })

    const fieldFeedback = (form: FormikProps<FormModel>, name: string) => {
        const error = getIn(form.errors, name)
        const touch = getIn(form.touched, name)
        return {
            errorMessage: error || '',
            invalid: typeof touch === 'undefined' ? false : error && touch,
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useGetHealthPlanAuth({ sort: { order: 'asc' } })
                const benefitResponse = await useGetAllBenefitListAuth()

                if (response.status === 'success' && response.data) {
                    setHealthPlan(response.data)
                    setIsLoading(false)
                }

                if (benefitResponse.status === 'success' && benefitResponse.data) {
                    setBenefitList(benefitResponse.data)
                    console.log(benefitResponse.data)
                    setIsLoading(false)
                }

            } catch (error) {
                console.log(error)
                setIsLoading(false)

            }
        }
        fetchData()
        console.log(benefitList)
        console.log(healthPlan)
    }, [])
    return (
        <> {isLoading ?
            <div>
                <Spinner size="3.25rem" />
            </div>
            :
            <div>
                <Select
                    options={healthPlan}
                    placeholder={"Select Health Plan Name"}
                    value={healthPlan.filter((item) =>
                        item.value === selectedHealthPlan?.value
                    )}
                    onChange={(data) => {
                        if (data) {
                            setSelectedHealthPlan(data)
                        }
                    }}
                />
                {
                    selectedHealthPlan &&
                    <div>
                        <div className='pt-10'>
                            <Card
                                header="Detailed Information"
                                headerBorder={false}>
                                <div className='grid grid-cols-3 gap-4'>
                                    <span className="text-xl text-slate-500 font-mono mb-3 dark:text-slate-400"> Plan Name: <span className='font-black'>{selectedHealthPlan.label}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Plan Type: <span className='font-black'>{selectedHealthPlan.plan_type}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Does this plan allow dependent?:{selectedHealthPlan.allow_dependent ? <Tag className='text-white bg-indigo-600 border-0'>Yes</Tag> : <Tag className='text-white bg-red-700 border-0'>No</Tag>}</span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Maximum Dependant: <span className='font-black'>{selectedHealthPlan.max_dependant}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Plan Age Limit: <span className='font-black'>{selectedHealthPlan.plan_age_limit}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Plan Cost: <span className='font-black'>{selectedHealthPlan.plan_cost}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Plan Create at: <span className='font-black'>{selectedHealthPlan.created_at}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Plan Category:
                                        <span className='font-black'>{selectedHealthPlan.health_plan_category_name}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Plan Category Code: <span className='font-black'>{selectedHealthPlan.health_plan_category_code}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Plan Category Band: <span className='font-black'>{selectedHealthPlan.health_plan_category_band}</span></span>
                                    <span className='text-xl text-slate-500 font-mono mb-3 dark:text-slate-400'>Plan Created by: <span className='font-bold'>{selectedHealthPlan.entered_by}</span></span>
                                </div>
                            </Card>
                        </div>

                        {/* Attach benefit list */}
                        <div className='pt-10'>
                            <Card header="Attach Benefits"
                                headerBorder={false}>
                                <div>
                                    <Formik
                                        validationSchema={validationSchema}
                                        initialValues={{
                                            benefit_limit: [
                                                {
                                                    benefit_name: '',
                                                    limit_type: '',
                                                    limit_value: ''
                                                }
                                            ],
                                        }}
                                        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
                                    >
                                        {({ touched, errors, values }) => {
                                            const benefit_limit = values.benefit_limit
                                            return (
                                                <Form>
                                                    <FormContainer layout="inline">
                                                        <div>
                                                            <div className="mb-10">
                                                                <h5 className="mb-4">Benefit List</h5>
                                                            </div>
                                                            <FieldArray name="benefit_limit">
                                                                {({ form, remove, push }) => (
                                                                    <div>
                                                                        {benefit_limit && benefit_limit.length > 0
                                                                            ? benefit_limit.map((_, index) => {
                                                                                const nameFeedBack =
                                                                                    fieldFeedback(
                                                                                        form,
                                                                                        `benefit_limit[${index}].benefit_name`
                                                                                    )
                                                                                const limitTypeFeedBack =
                                                                                    fieldFeedback(
                                                                                        form,
                                                                                        `benefit_limit[${index}].limit_type`
                                                                                    )
                                                                                const limitValueFeedBack = fieldFeedback(form, `benefit_limit[${index}].limit_value`)

                                                                                return (
                                                                                    <div key={index}>
                                                                                        {/* benefit names */}
                                                                                        <FormItem
                                                                                            label="Name"
                                                                                            invalid={
                                                                                                nameFeedBack.invalid
                                                                                            }
                                                                                            errorMessage={
                                                                                                nameFeedBack.errorMessage
                                                                                            }



                                                                                        >
                                                                                            <Field
                                                                                                name={`benefit_limit[${index}].benefit_name`}
                                                                                                placeholder="">
                                                                                                {({ field, form }: FieldProps<FormModel>) => (
                                                                                                    <Select
                                                                                                        field={field}
                                                                                                        form={form}
                                                                                                        options={benefitList}
                                                                                                        placeholder="select appropriate benefit"
                                                                                                        value={benefitList?.filter(
                                                                                                            (items) =>
                                                                                                                items.value === _.benefit_name
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

                                                                                        {/* the type of limit */}
                                                                                        <FormItem
                                                                                            label="Limit Type"
                                                                                            invalid={
                                                                                                limitTypeFeedBack.invalid
                                                                                            }
                                                                                            errorMessage={
                                                                                                limitTypeFeedBack.errorMessage
                                                                                            }
                                                                                        >
                                                                                            <Field
                                                                                                name={`benefit_limit[${index}].limit_type`}>
                                                                                                {({ field, form }: FieldProps<FormModel>) => (
                                                                                                    <Select
                                                                                                        field={field}
                                                                                                        form={form}
                                                                                                        options={limit_type}
                                                                                                        value={limit_type?.filter(
                                                                                                            (items) =>
                                                                                                                items.value === _.limit_type
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

                                                                                        {/* expected limit value */}
                                                                                        <FormItem
                                                                                            label="limit Value"
                                                                                            invalid={
                                                                                                limitValueFeedBack.invalid
                                                                                            }
                                                                                            errorMessage={
                                                                                                limitValueFeedBack.errorMessage
                                                                                            }

                                                                                        >
                                                                                            <Field
                                                                                                invalid={
                                                                                                    limitValueFeedBack.invalid
                                                                                                }
                                                                                                placeholder="Limit Value"
                                                                                                name={`benefit_limit[${index}].limit_value`}
                                                                                                type="number"
                                                                                                component={
                                                                                                    Input
                                                                                                }
                                                                                            />
                                                                                        </FormItem>
                                                                                        <Button
                                                                                            shape="circle"
                                                                                            size="sm"
                                                                                            icon={
                                                                                                <HiMinus />
                                                                                            }
                                                                                            onClick={() =>
                                                                                                remove(
                                                                                                    index
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            })
                                                                            : null}
                                                                        <div>
                                                                            <Button
                                                                                type="button"
                                                                                className="ltr:mr-2 rtl:ml-2"
                                                                                onClick={() => {
                                                                                    push({
                                                                                        name: '',
                                                                                        limit_type: '',
                                                                                        limit_value: ''

                                                                                    })
                                                                                }}
                                                                            >
                                                                                Attach New Benefit
                                                                            </Button>
                                                                            <Button
                                                                                type="submit"
                                                                                variant="solid"
                                                                            >
                                                                                Save list
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </FieldArray>
                                                        </div>
                                                    </FormContainer>
                                                </Form>
                                            )
                                        }}
                                    </Formik>
                                </div>
                            </Card>
                        </div>
                    </div>

                }
            </div>


        }


        </>
    )
}

export default AttachHealthPlanBenefit