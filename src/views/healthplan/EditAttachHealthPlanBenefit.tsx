import Select from '@/components/ui/Select'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { useEffect, useState } from 'react'
import { healthPlan, benefitList } from '@/utils/customAuth/useHealthPlanAuth'
import { Card, Tag } from '@/components/ui'
import Spinner from '@/components/ui/Spinner'
import { Field, FieldArray, Form, Formik, getIn, FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { HiMinus } from 'react-icons/hi'
import Alert from '@/components/ui/Alert'
import type { FormikProps } from 'formik'
import { useLocalStorage } from '@/utils/localStorage'
import Input from '@/components/ui/Input'
import type { ChangeEvent } from 'react'

type attachedBenefitType = {
    benefit_name: string,
    limit_type: string,
    limit_value: string,
    health_plan_name: string,
    benefit_item_id: string,
    created_by: string,
    health_plan_id: string,
}

const limit_type = [
    { value: "max_freqency_per_year", label: "Max Frequency Per Year", color: '#5243AA' },
    { value: "max_cost_per_year", label: "Max Cost Per Year", color: '#0052CC' },
    { value: "max_enrollee_age", label: "Max Entrollee Age", color: '#0052CC' },
    { value: "min_enrollee_age", label: "Min Entrollee Age", color: '#0052CC' },
]

type FormModel = {
    benefit_limit: {
        benefit_name: string
        limit_type: string
        limit_value: string,
        benefit_id: string,
    }[]
}

function EditAttachHealthPlanBenefit() {

    const [healthPlan, setHealthPlan] = useState<healthPlan[]>([])
    const [benefitList, setBenefitList] = useState<benefitList[]>([])

    const [attachedBenefit, setAttachedBenefit] = useState<attachedBenefitType[]>([])

    // TODO: This should house all the updated values
    const [value, setValue] = useState('')

    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState("")

    const { useGetHealthPlanAuth, useGetAttachedBenefitByHealthPlanIdAuth, useGetAllBenefitListAuth } = useHealthPlan()

    // store the attached benefit result from the api
    const requestForAttachedBenefit = async (id: {}) => {

        if (!id) {
            throw Error("health plan ID required to query attach benefit")
        }

        const result = await useGetAttachedBenefitByHealthPlanIdAuth(id)

        if (result.status === 'success') {

            setAttachedBenefit(result.data)
        }

        if (result.status === 'failed') {
            setMessage(result.message)
        }
    }

    // TODO this will update value for limit_value
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)

    useEffect(() => {
        const fetchData = async () => {

            const response = await useGetHealthPlanAuth({ sort: { order: 'asc' } })
            const benefitResponse = await useGetAllBenefitListAuth()

            if (response.status === 'success' && response.data) {
                setHealthPlan(response.data)
                setIsLoading(false)
            }

            if (benefitResponse.status === 'success' && benefitResponse.data) {
                setBenefitList(benefitResponse.data)
                setIsLoading(false)
            }

            if (response.status === 'failed' || benefitResponse.status === 'failed') {
                setMessage(response.message || benefitResponse.message)
                setIsLoading(false)
            }

        }
        fetchData()
    }, [])


    return (
        <div>
            {message && <Alert
                className="mb-4"
                type="danger"
                showIcon
                closable
                duration={5000}>
                {message}
            </Alert>}
            {
                isLoading ?
                    <div className='flex justify-center'>
                        <Spinner size="3.25rem"
                        />
                    </div>
                    :
                    <div>
                        <Select
                            options={healthPlan}
                            placeholder={"Select Health Plan To Edit"}

                            onChange={(data) => {
                                if (data) {

                                    requestForAttachedBenefit({ "id": data.value })
                                }
                            }}
                        />


                        {
                            attachedBenefit.map((item: attachedBenefitType, index) => {
                                return (
                                    <Card
                                        className='my-2 hover:shadow-lg transition duration-150 ease-in-out'
                                        clickable>
                                        <div className='flex items-center'>

                                            <p className='px-1'>Benefit Name:</p>
                                            <Select
                                                className='grow'
                                                options={benefitList}
                                                defaultValue={benefitList.filter((i) => (
                                                    i.value === item.benefit_item_id
                                                ))}

                                                onChange={(data) => {
                                                    if (data) {

                                                        // requestForAttachedBenefit({ "id": data.value })
                                                    }
                                                }}
                                            />
                                            <p className='px-1'>Limit Type:</p>
                                            <Select
                                                options={limit_type}
                                                defaultValue={limit_type.filter((i) => (
                                                    i.value === item.limit_type
                                                ))}

                                                onChange={(data) => {
                                                    if (data) {

                                                        // requestForAttachedBenefit({ "id": data.value })
                                                    }
                                                }}
                                            />
                                            <p className='px-1'>Limit Value:</p>
                                            <Input
                                                value={item.limit_value}
                                                onChange={handleChange}
                                                placeholder="Sample placeholder"
                                                className='grow-0 w-28'
                                            />
                                        </div>
                                    </Card>

                                )

                            })

                        }

                    </div>
            }

        </div>
    )
}

export default EditAttachHealthPlanBenefit