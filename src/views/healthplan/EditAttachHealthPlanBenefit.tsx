import Select from '@/components/ui/Select'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { useEffect, useState } from 'react'
import { healthPlan, benefitList } from '@/utils/customAuth/useHealthPlanAuth'
import { Card, Tag } from '@/components/ui'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { HiMinus } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Input from '@/components/ui/Input'
import type { ChangeEvent } from 'react'
import Notification from '@/components/ui/Notification'


type attachedBenefitType = {
    id: string
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

    const [valueToUpdate, setValueToUpdate] = useState<{
        benefit_name?: string,
        limit_type?: string,
        limit_value?: string,
        benefit_item_id?: string
    }>({})

    const [isLoading, setIsLoading] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [isAttachedBenefitLoaded, setIsAttachedBenefitLoaded] = useState(false)

    const [idToDelete, setIdToDelete] = useState("")

    const { useGetHealthPlanAuth, useGetAttachedBenefitByHealthPlanIdAuth,
        useGetAllBenefitListAuth, useUpdateAttachedBenefitAuth, useDeleteAttachedBenefitAuth } = useHealthPlan()

    // store the attached benefit result from the api
    const requestForAttachedBenefit = async (id: {}) => {

        // clear the useState array to prevent having old data from a previous request.
        setAttachedBenefit([])

        setIsAttachedBenefitLoaded(true)

        if (!id) {
            throw Error("health plan ID required to query attach benefit")
        }

        const result = await useGetAttachedBenefitByHealthPlanIdAuth(id)

        if (result.status === 'success') {
            setAttachedBenefit(result.data)
            setIsAttachedBenefitLoaded(false)
        }

        if (result.status === 'failed') {
            openNotification(result.message, 'danger')
        }
    }

    // delete the attached benefit by id
    const deleteAttachedBenefit = async (id: string) => {
        const isDeleted = await useDeleteAttachedBenefitAuth(id)

        if (isDeleted.status === 'success') {
            setIdToDelete("")
            openNotification(isDeleted.message, 'success')
            setTimeout(() => {
                window.location.reload()
            }, 1000)

        }

        if (isDeleted.status === 'failed') {
            setIdToDelete("")
            openNotification(isDeleted.message, 'danger')
        }
    }

    // update the attach benefit
    const updateAttachedBenefit = async (id: string, data: {}) => {

        /*
        !id: id is null or undefined.
        typeof id !== 'string': id is not a string.
        !data: data is null or undefined.
        Object.keys(data).length === 0: data is an empty object.
        */
        if (!id || typeof id !== 'string' || !data || Object.keys(data).length === 0) {
            openNotification("No value selected to update", 'danger')
            return
        }

        const dataToSendToApi = {
            id: id,
            data: data
        }
        const result = await useUpdateAttachedBenefitAuth(dataToSendToApi)

        if (result.status === 'success') {
            openNotification(result.message, 'success')
            // setOpenEditDialog(true)
        }
        if (result.status === 'failed') {
            openNotification(result.message, 'danger')
        }
    }

    function openNotification(msg: string, notificationType: 'success' | 'warning' | 'danger' | 'info') {
        toast.push(
            <Notification
                title="Warning!"
                type={notificationType}>

                {msg}
            </Notification>, {
            placement: 'top-center'
        })
    }

    // TODO this will update value for limit_value
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValueToUpdate({ ...valueToUpdate, limit_value: e.target.value })

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
                openNotification(response.message || benefitResponse.message, 'info')
                setIsLoading(false)
            }

        }
        fetchData()
    }, [])

    return (
        <div>
            {
                isLoading ?
                    <div className='flex justify-center'>
                        <Spinner size="3.25rem"
                        />
                    </div>
                    :
                    <div>
                        <Card
                            className='mb-5 bg-neutral-500 text-white'>
                            Edit/Update or delete Attached Benefits to Health Plans.
                        </Card>
                        <Select
                            options={healthPlan}
                            placeholder={"Select Health Plan To Edit"}

                            onChange={(data) => {
                                if (data) {

                                    requestForAttachedBenefit({ "id": data.value })
                                }
                            }}
                        />
                        {attachedBenefit.length > 0 &&
                            <h5
                                className='font-medium py-3'>
                                Benefits Attached to <span className='heading-text font-semibold'>{attachedBenefit[0].health_plan_name}</span> health plan
                            </h5>

                        }
                        {isAttachedBenefitLoaded &&
                            <div className='flex justify-center mt-16'>
                                <Spinner size="3.25rem"
                                />
                            </div>
                        }
                        {
                            attachedBenefit.map((item: attachedBenefitType, index) => {
                                return (
                                    <Card
                                        className='my-2 hover:shadow-lg transition duration-150 ease-in-out'
                                        clickable
                                        key={index}>
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
                                                        setValueToUpdate({ ...valueToUpdate, benefit_name: data.label, benefit_item_id: data.value })
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
                                                        setValueToUpdate({ ...valueToUpdate, limit_type: data.value })
                                                    }
                                                }}
                                            />
                                            <p className='px-1'>Limit Value:</p>
                                            <Input
                                                defaultValue={item.limit_value}
                                                onChange={handleChange}
                                                placeholder="Sample placeholder"
                                                type='number'
                                                className='grow-0 w-28'
                                            />
                                            <Button
                                                variant="solid"
                                                size='md'
                                                className='mx-3'
                                                color="blue-600"
                                                onClick={() => {

                                                    updateAttachedBenefit(item.id, valueToUpdate)
                                                    setValueToUpdate({})
                                                }}>
                                                Update
                                            </Button>
                                            <Button
                                                variant="solid"
                                                size='md'
                                                className='mx-3'
                                                color="red-600"
                                                onClick={() => {
                                                    setIdToDelete(item.id)
                                                    setOpenDeleteDialog(true)
                                                }
                                                }>
                                                Delete
                                            </Button>


                                        </div>
                                    </Card>
                                )

                            })
                        }

                    </div>
            }

            {/* Delete Dialong */}
            {openDeleteDialog &&
                <Dialog
                    isOpen={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                >

                    <h5 className="mb-4">Do You Want to Delete This Benefit?</h5>
                    <p>
                        Kindly cross check and make sure the benefit you are wish to delete is the correct one.
                    </p>
                    <div className="text-right mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={() => {
                                setOpenDeleteDialog(false)

                            }}
                        >
                            Cancel
                        </Button>
                        <Button variant="solid" onClick={() => {
                            deleteAttachedBenefit(idToDelete)
                            setOpenDeleteDialog(false)
                        }}>
                            Yes
                        </Button>
                    </div>
                </Dialog>
            }

        </div>
    )
}

export default EditAttachHealthPlanBenefit