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
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { useLocalStorage } from '@/utils/localStorage'
import Tabs from '@/components/ui/Tabs'
import { HiUserAdd, HiOutlineDocumentAdd, HiUserGroup } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import useBandAuth from '@/utils/customAuth/useBandAuth'
import type {Band}from '@/utils/customAuth/useBandAuth'


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
type SelectBandType = {
     id: string
     label: string
     value: string
}

const planCategoryValidationSchema = Yup.object().shape({

    name: Yup.string().required('health plan name Required'),
    description: Yup.string().required('what is this plan about?'),
    band: Yup.string().required('band required'),
})

const CreateHealthPlanCategory = () => {


    const [errorMessage, setErrorMessage] = useTimeOutMessage()
    const [successMessage, setSuccessMessage] = useTimeOutMessage()
    const [selectBand, setSelectBand] = useState<SelectBandType[] | undefined>([])

    const { useCreateHealthPlanCategoryAuth } = useHealthPlan()
    const {useGetBandAuth,} = useBandAuth()

    const { getItem } = useLocalStorage()

    const onCreateHealthPlanCategory = async (
        values: any,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: () => void
    ) => {

        setSubmitting(true)

        values.user_id = getItem("user")

        const data = await useCreateHealthPlanCategoryAuth(values)


        if (data.status === 'success') {
            setSuccessMessage(data.message)
            setSubmitting(false)
            resetForm()
        }

        if(data.status  === 'failed'){
            setErrorMessage(data.message)
            setSubmitting(false)
        }

    }


    useEffect(() => {
        const fetchData = async () => {
            console.log("useEffect for createHealthPlanCategory called!")
        }
        const fetchBand= async () => {
             const response = await useGetBandAuth()
             if (response?.status === 'success') {
                  const bandOptions = response?.data?.map((band: any) => ({
                      id: band.id,
                      label: band.name,
                      value: band.id
                  }))
                  setSelectBand(bandOptions)
      }
  }

        fetchData()
        fetchBand()
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
                        band_name: '',
                        user_id: ''

                    }}
                    validationSchema={planCategoryValidationSchema}

                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        onCreateHealthPlanCategory(values, setSubmitting, resetForm)
                    }}
                >
                    {({ values, touched, errors, isSubmitting }) =>
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

                                <FormItem label="Band">
                                    <Field
                                        name="band">
                                        {({ field, form }: FieldProps<FormModel>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={selectBand}
                                                value={selectBand?.filter(
                                                    (items) =>
                                                        items.value === values.band
                                                )}

                                                onChange={(items) =>{
                                                    form.setFieldValue(
                                                        field.name,
                                                        items?.value
                                                    ),
                                                    form.setFieldValue(
                                                        'band_name',
                                                        items?.label
                                                    )}
                                                } />
                                        )}
                                    </Field>
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

export default CreateHealthPlanCategory
