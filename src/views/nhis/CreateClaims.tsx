import { useEffect, useState } from 'react'
import useEnrollee from '@/utils/customAuth/useEnrolleeAuth'
import debounce from 'lodash/debounce'
import Select from '@/components/ui/Select'
import { components, OptionProps, SingleValueProps } from "react-select";
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'
import useHealthCheck from '@/utils/customAuth/useHealthCheckerAuth'
import { Field, FieldArray, Form, Formik, getIn, FieldProps } from 'formik'
import * as Yup from 'yup'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, FormContainer } from '@/components/ui/Form'
import useProvider, { NHIAProviderType } from '@/utils/customAuth/useProviderAuth';
import DatePicker from '@/components/ui/DatePicker'
import type { FormikProps } from 'formik'


type NHIAEnrollee = {
    // value as id
    value: string,
    // label as policy_id
    label: string,
    relationship: string,
    surname: string,
    other_names: string,
    dob: string,
    sex: string,
    company_id: string,
    provider_id: string,
    provider_name: string,
    provider_Address: string,
    created_by: string,
    created_at: string,
}


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
    referring_hcf: Yup.string().required('Referring HCF name Required'),
    recieving_hcf: Yup.string().required('Recieving HCF name Required'),
    referral_code: Yup.string().required('Referral code required'),
    approval_date: Yup.date().required('Please specify the approval date'),
    date_hmo_recieved_claim: Yup.date().required('Please specify the date HMO recieved claim'),
    diagnosis: Yup.string().required('Please specify the diagnosis'),
    items: Yup.array().of(
        Yup.object().shape({
            service_name: Yup.string().required('Benefit Required'),
            amount: Yup.string().required('Limit Type Required'),
            qty: Yup.number().required("Limit Required"),
            amount_claimed: Yup.number().required("Limit Required"),
            amount_agreed: Yup.number().required("Limit Required"),
            amount_paid: Yup.number().required("Limit Required"),
            remark: Yup.number().required("Limit Required"),
        })
    ),
})
const CreateClaims = () => {

    const [selectedValue, setSelectedValue] = useState<NHIAEnrollee>()
    const [search, setSearch] = useState<string | undefined>(undefined)
    const [searchReferringHCF, setSearchReferringHCF] = useState<string | undefined>(undefined)
    const [searchrecievingHCF, setSearchRecievingHCF] = useState<string | undefined>(undefined)
    const [data, setData] = useState<NHIAEnrollee[]>([])
    const [referringHCFData, setReferringHCFData] = useState<NHIAProviderType[]>([])
    const [recievingHCFData, setRecievingHCFData] = useState<NHIAProviderType[]>([])
    
    const [loading, setLoading] = useState<boolean>(false)
    const { useGetAllNhiaEnrolleeAuth } = useEnrollee()
    const { useHealthCheckAuth } = useHealthCheck()
    const { useSearchNHIAProviderByHCPIDAuth } = useProvider()


    const debounceFn = debounce(handleDebounceFn, 500)
    const providerDebounceFn = debounce(getProviderDebounceFn, 500)
    const receivingDebFn = debounce(recievingHCFDebounceFn, 500)

    function handleDebounceFn(val: string) {
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setSearch(val)
        }
    }

    function getProviderDebounceFn(val: string) {
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setSearchReferringHCF(val)
        }
    }

    function recievingHCFDebounceFn(val: string) {
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setSearchRecievingHCF(val)
        }
    }

    const fieldFeedback = (form: FormikProps<FormModel>, name: string) => {
        const error = getIn(form.errors, name)
        const touch = getIn(form.touched, name)
        return {
            errorMessage: error || '',
            invalid: typeof touch === 'undefined' ? false : error && touch,
        }
    }

    const SingleValue = ({
        children,
        ...props
    }: SingleValueProps<NHIAEnrollee>) => (
        <components.SingleValue {...props}>
            <div>{props.data.label} {props.data.surname} {props.data.other_names}</div>
        </components.SingleValue>
    );
    const Option = (props: OptionProps<NHIAEnrollee>) => {
        return (
            //   <Tooltip content={'Customise your option component!'} truncate>
            <components.Option {...props} >
                <div>{props.data.label}</div>
                <div>{props.data.surname} {props.data.other_names}</div>
            </components.Option>

            //   </Tooltip>
        );
    };

    const handleInputChange = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, '')
        debounceFn(inputValue)
    }

    const getProviderHandleInput = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, '')
        providerDebounceFn(inputValue)
    }

    const getRecievingHCFInput = (newValue: string) => {
        const inputValue = newValue.replace(/\W/g, '')
        receivingDebFn(inputValue)
    }

    const onCreateClaims = (values: any, setSubmitting?: (isSubmitting: boolean) => void, resetForm?: () => void) => {

        values.nhia_enrollee_name = `${selectedValue?.surname} ${selectedValue?.other_names}`
        values.nhia_enrollee_id = `${selectedValue?.label}`

        alert(JSON.stringify(values, null, 2))

        if (setSubmitting !== undefined) {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {

            await useHealthCheckAuth()

            if (search !== undefined) {
                setLoading(true)
                const response = await useGetAllNhiaEnrolleeAuth(search)

                if (response?.status === 'success') {
                    setLoading(false)
                    setData(response?.data)
                }

                if (response?.status === 'failed') {
                    setLoading(false)
                }
            }

            if (searchReferringHCF !== undefined) {
                setLoading(true)
                const response = await useSearchNHIAProviderByHCPIDAuth(searchReferringHCF)


                if (response?.status === 'success') {
                    setLoading(false)
                    setReferringHCFData(response.data!)
                }

                if (response?.status === 'failed') {
                    setLoading(false)
                }

            }

            if (searchrecievingHCF !== undefined) {
                setLoading(true)
                const recievingResponse = await useSearchNHIAProviderByHCPIDAuth(searchrecievingHCF)


                if (recievingResponse?.status === 'success') {
                    setLoading(false)
                    setRecievingHCFData(recievingResponse.data!)
                }

                if (recievingResponse?.status === 'failed') {
                    setLoading(false)
                }

            }

        }
        fetchData()
        console.log("searching on ", searchrecievingHCF)
    }, [search, searchReferringHCF, searchrecievingHCF])

    return (
        <>
            <div>

                <Card
                    className='mb-5'>
                    <p>
                        Type the <b>NHIA Enrollee Policy ID</b> to get started
                    </p>
                </Card>

                <Select
                    onInputChange={(i) => { handleInputChange(i) }}
                    options={data}
                    onChange={(k) => {
                        setLoading(false)
                        setSelectedValue(k!)

                    }}
                    components={{ Option, SingleValue }}
                    isLoading={loading}
                />

                {
                    selectedValue &&
                    <div>
                        <Card
                            className='mt-5'>
                            <h3 className='mb-7'>NHIA Enrollee Details</h3>
                            <div className='flex grid-cols-{2} items-center'>
                                <Avatar size={60} className="mr-4" icon={<HiOutlineUser />} />
                                <div className=' flex grid-cols-{1}'>
                                    <p>Policy ID: {selectedValue.label}</p>
                                    <p>Relationship: {selectedValue.relationship}</p>
                                    <p>Surname: {selectedValue.surname}</p>
                                    <p>Other Name: {selectedValue.other_names}</p>
                                    <p>Date of Birth: {selectedValue.dob}</p>
                                    <p>Sex: {selectedValue.sex}</p>
                                    <p>Company ID: {selectedValue.company_id}</p>
                                    <p>Provider ID: {selectedValue.provider_id}</p>
                                    <p>Provider Name: {selectedValue.provider_name}</p>
                                    <p>Provider Address: {selectedValue.provider_Address}</p>

                                </div>
                            </div>
                        </Card>

                        <Formik
                            enableReinitialize
                            initialValues={{
                                nhia_enrollee_name: '',
                                nhia_enrollee_id: '',
                                referring_hcf: '',
                                recieving_hcf: '',
                                referral_code: '',
                                approval_date: null,
                                date_hmo_recieved_claim: null,
                                diagnosis: '',
                                items: [
                                    {
                                        service_name: '',
                                        amount: '',
                                        qty: '',
                                        amount_claimed: '',
                                        amount_agreed: '',
                                        amount_paid: '',
                                        remark: '',
                                    }
                                ]
                            }}
                            validationSchema={validationSchema}

                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                onCreateClaims(values, setSubmitting, resetForm)
                            }}
                        >
                            {({ values, touched, errors, isSubmitting }) => {
                                const items = values.items
                                return (
                                    <Form>
                                        <FormContainer>

                                            {/* Referring HCF */}
                                            <FormItem
                                                asterisk
                                                label="Referring HCF"
                                                invalid={errors.referring_hcf && touched.referring_hcf}
                                                errorMessage={errors.referring_hcf}
                                            >

                                                <Field

                                                    name="referring_hcf">
                                                    {({ field, form }: FieldProps<FormModel>) => (

                                                        <Select
                                                            onInputChange={(i) => { getProviderHandleInput(i) }}
                                                            options={referringHCFData}
                                                            onChange={(k) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    k?.label
                                                                )
                                                                setLoading(false)

                                                            }}
                                                            isLoading={loading}
                                                            value={referringHCFData.filter((item) =>
                                                                item.label === values.referring_hcf
                                                            )}
                                                        />
                                                    )}
                                                </Field>

                                                {/*TODO Things of concern*/}
                                                {/* 1. too much api calls - useEffect runs all the time, check others.
                                            2. the exception i am returning all the time for the Select

                                             */}
                                            </FormItem>

                                            {/* Recieving HCF */}
                                            <FormItem
                                                asterisk
                                                label="Recieving HCF"
                                                invalid={errors.recieving_hcf && touched.recieving_hcf}
                                                errorMessage={errors.recieving_hcf}
                                            >

                                                <Field

                                                    name="recieving_hcf">
                                                    {({ field, form }: FieldProps<FormModel>) => (

                                                        <Select
                                                            onInputChange={(i) => { getRecievingHCFInput(i) }}
                                                            options={recievingHCFData}
                                                            onChange={(k) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    k?.label
                                                                )
                                                                setLoading(false)

                                                            }}
                                                            isLoading={loading}
                                                            value={recievingHCFData.filter((item) =>
                                                                item.label === values.recieving_hcf
                                                            )}
                                                        />
                                                    )}
                                                </Field>

                                                {/* Things of concern */}
                                                {/* 1. too much api calls - useEffect runs all the time, check others.
                                            2. the exception i am returning all the time for the Select

                                             */}
                                            </FormItem>

                                            {/* Referral code */}
                                            <FormItem
                                                asterisk
                                                label="Referral Code"
                                                invalid={errors.referral_code && touched.referral_code}
                                                errorMessage={errors.referral_code}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="referral_code"
                                                    placeholder="Referral Code"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            {/* approval date */}
                                            <FormItem
                                                asterisk
                                                label="Approval Date"
                                                invalid={errors.approval_date && touched.approval_date}
                                                errorMessage={errors.approval_date}
                                            >
                                                <Field

                                                    name="approval_date">
                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                        <DatePicker
                                                            field={field}
                                                            form={form}
                                                            value={values.approval_date}
                                                            placeholder="Pick the approval date"
                                                            onChange={(date) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    date
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            {/* date hmo recieved claim */}
                                            <FormItem
                                                asterisk
                                                label="Date HMO Recieved Claim"
                                                invalid={errors.date_hmo_recieved_claim && touched.date_hmo_recieved_claim}
                                                errorMessage={errors.date_hmo_recieved_claim}
                                            >
                                                <Field

                                                    name="date_hmo_recieved_claim">
                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                        <DatePicker
                                                            field={field}
                                                            form={form}
                                                            value={values.date_hmo_recieved_claim}
                                                            placeholder="Pick the date hmo recieved claim"
                                                            onChange={(date) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    date
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            {/* diagnosis */}
                                            <FormItem
                                                asterisk
                                                label="Diagnosis"
                                                invalid={errors.diagnosis && touched.diagnosis}
                                                errorMessage={errors.diagnosis}
                                            >
                                                <Field

                                                    name="diagnosis">
                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                        <Input
                                                            field={field}
                                                            form={form}
                                                            placeholder="Text area example" textArea
                                                        />

                                                    )}
                                                </Field>
                                            </FormItem>

                                            {/* Array */}
                                            <FieldArray
                                                name="items">
                                                {({ form, remove, push }) => (
                                                    <div>
                                                        {items && items.length > 0
                                                            ? items.map((_, index) => {
                                                                const serviceNameFeedBack =
                                                                    fieldFeedback(
                                                                        form,
                                                                        `items[${index}].service_name`
                                                                    )
                                                                const amountFeedBack =
                                                                    fieldFeedback(
                                                                        form,
                                                                        `items[${index}].amount`
                                                                    )
                                                                const qtyFeedBack =
                                                                fieldFeedback(form,
                                                                    `items[${index}].qty`)

                                                                const amountClaimedFeedBack =
                                                                fieldFeedback(form,
                                                                    `items[${index}].amount_claimed`)

                                                                const amountAgreedFeedBack =
                                                                fieldFeedback(form,
                                                                    `items[${index}].amount_agreed`)

                                                                const amountPaidFeedBack =
                                                                fieldFeedback(form,
                                                                    `items[${index}].amount_paid`)

                                                                return (
                                                                    <div key={index}>
                                                                        {/* benefit names */}
                                                                        <FormItem
                                                                            label="Service Name"
                                                                            invalid={
                                                                                serviceNameFeedBack.invalid
                                                                            }
                                                                            errorMessage={
                                                                                serviceNameFeedBack.errorMessage
                                                                            }
                                                                        >
                                                                            <Field
                                                                                name={`items[${index}].service_name`}
                                                                                placeholder="">
                                                                                {({ field, form }: FieldProps<FormModel>) => (
                                                                                    <Select
                                                                                        field={field}
                                                                                        form={form}
                                                                                        options={selectedBenefitList}
                                                                                        placeholder="select appropriate benefit"
                                                                                        value={selectedBenefitList?.filter(
                                                                                            (items) =>
                                                                                                items.label === _.benefit_name
                                                                                        )}

                                                                                        onChange={(items) => {
                                                                                            form.setFieldValue(
                                                                                                field.name,
                                                                                                items?.label
                                                                                            )

                                                                                            if (items?.value) {

                                                                                                values.benefit_limit[index].benefit_id = items?.value
                                                                                            } else {
                                                                                                values.benefit_limit[index].benefit_id = ''
                                                                                            }

                                                                                        }


                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                        </FormItem>

                                                                        {/* the type of limit */}
                                                                        <FormItem
                                                                            label="Limit Type"
                                                                            invalid={
                                                                                amountFeedBack.invalid
                                                                            }
                                                                            errorMessage={
                                                                                amountFeedBack.errorMessage
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
                                                                                qtyFeedBack.invalid
                                                                            }
                                                                            errorMessage={
                                                                                qtyFeedBack.errorMessage
                                                                            }

                                                                        >
                                                                            <Field
                                                                                invalid={
                                                                                    qtyFeedBack.invalid
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
                                            <FormItem>
                                                <Button variant="solid" type="submit"
                                                    loading={isSubmitting}>
                                                    {isSubmitting ?
                                                        "Saving..."
                                                        :
                                                        "Save Claim"
                                                    }

                                                </Button>
                                            </FormItem>
                                        </FormContainer>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                }

            </div>
        </>
    )
}

export default CreateClaims