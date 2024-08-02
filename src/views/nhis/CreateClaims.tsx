import { useEffect, useState, useRef } from 'react'
import useEnrollee from '@/utils/customAuth/useEnrolleeAuth'
import debounce from 'lodash/debounce'
import Select from '@/components/ui/Select'
import { components, OptionProps, SingleValueProps } from "react-select";
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser, HiMinus } from 'react-icons/hi'
import useHealthCheck from '@/utils/customAuth/useHealthCheckerAuth'
import { Field, FieldArray, Form, Formik, getIn, FieldProps } from 'formik'
import * as Yup from 'yup'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, FormContainer } from '@/components/ui/Form'
import useProvider, { NHIAProviderType } from '@/utils/customAuth/useProviderAuth';
import DatePicker from '@/components/ui/DatePicker'
import type { FormikProps } from 'formik'
import useNhia from '@/utils/customAuth/useNhisAuth';

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

type NHIATarrifService = {
    // value as id
    value: string,
    // label as name
    label: string,
    nhia_code: string,
    price: string,
    tarrif_type: string,
    service_type: string,
    category: string,
    sub_category: string,
}

type NHIADrugs = {
    // value as id
    value: string,
    // label as name_of_drug
    label: string,
    nhia_code: string,
    price: string,
    dosage_form: string,
    strength: string,
    presentation: string,
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

const nhiaDrugDeduction = [
    { value: "0", label: "0%" },
    { value: "10", label: "10%" },
    { value: "20", label: "20%" },
    { value: "30", label: "30%" },
    { value: "40", label: "40%" },
    { value: "50", label: "50%" },
]

const validationSchema = Yup.object().shape({
    referring_hcf: Yup.string().required('Referring HCF name Required'),
    recieving_hcf: Yup.string().required('Recieving HCF name Required'),
    referral_code: Yup.string().required('Referral code required'),
    approval_date: Yup.date().required('Please specify the approval date'),
    date_hmo_recieved_claim: Yup.date().required('Please specify the date HMO recieved claim'),
    diagnosis: Yup.string().required('Please specify the diagnosis'),
    // items: Yup.array().of(
    //     Yup.object().shape({
    //         service_name: Yup.string().required('Benefit Required'),
    //         amount: Yup.string().required('Limit Type Required'),
    //         qty: Yup.number().required("Limit Required"),
    //         // amount_claimed: Yup.number().required("Limit Required"),
    //         // amount_agreed: Yup.number().required("Limit Required"),
    //         // amount_paid: Yup.number().required("Limit Required"),
    //         // remark: Yup.number().required("Limit Required"),
    //     })
    // ),
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
    // the nhia service tarrif from database
    const [nhiaDataFromDb, setNhiaDataFromDb] = useState<NHIATarrifService[]>([])
    // the nhia drugs from database
    const [nhiaDrugsFromDb, setNhiaDrugsFromDb] = useState<NHIADrugs[]>([])
    // the nhia service tarrif info
    const [serviceInfo, setServiceInfo] = useState<{
        name?: string,
        service_price?: string,
        drug_price?: string,
        qty?: string,
        percentage?: string,
        amt_claimed?: string,
        comment?: string
    }>({})

    // an array to store the info from nhia service and drug
    const [combindedServices, setCombindedServices] = useState<{}[]>([])

    // network auth
    const { useGetAllNhiaEnrolleeAuth } = useEnrollee()
    const { useHealthCheckAuth } = useHealthCheck()
    const { useSearchNHIAProviderByHCPIDAuth } = useProvider()
    const { getAllAndSearchNhiaServiceTarrifAuth, getAllAndSearchNhiaDrugTarrifAuth } = useNhia()

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

        alert(JSON.stringify(combindedServices, null, 2))

        if (setSubmitting !== undefined) {
            setSubmitting(false)
        }
    }

    function storeTheServices() {

        // if(serviceInfo !== undefined){

        setCombindedServices((prevServiceAmount) => [...prevServiceAmount, serviceInfo])
        // }

        // console.log("service info",)

        // setTimeout(() => {
        // alert(JSON.stringify(combindedServices, null, 2))
        // }, 3000)

        // setServiceInfo({})
    }

    function calculateTotals(items: any) {
        let totalServicePrice = 0;
        let totalDrugPrice = 0;

        for (const item of items) {
          const quantity = Number(item.qty) || 0;

          if (item.service_price) {
            const servicePrice = Number(item.service_price) || 0;
            totalServicePrice += servicePrice * quantity;
          } else if (item.drug_price) {
            const drugPrice = Number(item.drug_price) || 0;
            const percentage = Number(item.percentage) || 0;
            const discountedPrice = drugPrice * (1 - percentage / 100);
            totalDrugPrice += discountedPrice * quantity;
          }
        }

        return (totalServicePrice + totalDrugPrice);
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

            // nhia service
            const nhiaServiceDetails = await getAllAndSearchNhiaServiceTarrifAuth({ sort: { order: 'asc' } })

            if (nhiaServiceDetails?.status === 'success') {
                setNhiaDataFromDb(nhiaServiceDetails.data.map((i: any) => {
                    return {
                        label: i.name,
                        value: i.id,
                        nhia_code: i.nhia_code,
                        price: i.price,
                        tarrif_type: i.tarrif_type,
                        service_type: i.service_type,
                        category: i.category,
                        sub_category: i.sub_category,
                    }
                }))
            }

            // nhia drugs
            const nhiaDrugs = await getAllAndSearchNhiaDrugTarrifAuth({ sort: { order: 'asc' } })

            if (nhiaDrugs?.status === 'success') {
                setNhiaDrugsFromDb(nhiaDrugs.data.map((j: any) => {
                    return {
                        value: j.id,
                        label: j.name_of_drug,
                        nhia_code: j.nhia_code,
                        price: j.price,
                        dosage_form: j.dosage_form,
                        strength: j.strength,
                        presentation: j.presentation,
                    }
                }))
            }

        }
        fetchData()
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
                    <div className='flex grid-cols-2'>
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
                                item: '',
                                items: [
                                    {
                                        service_name: '',
                                        amount: '',
                                        qty: '',
                                        // amount_claimed: '',
                                        // amount_agreed: '',
                                        // amount_paid: '',
                                        // remark: '',
                                    }
                                ]
                            }}
                            validationSchema={validationSchema}

                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                onCreateClaims(values, setSubmitting, resetForm)
                            }}
                        >
                            {({ values, touched, errors, isSubmitting }) => {
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

                                            {/* Item services  */}
                                            <FormContainer>
                                                <Card
                                                    header="Investigation & Procuredures"
                                                    className='mb-10'>
                                                    <div className='grid grid-cols-3 gap-4'>


                                                        {/* service names */}
                                                        <div>
                                                            <FormItem
                                                                label="Service Name"
                                                            >
                                                                <Field
                                                                    name="item"
                                                                    placeholder="select a service">
                                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                                        <Select
                                                                            isClearable={true}
                                                                            options={nhiaDataFromDb}

                                                                            placeholder="select appropriate service"
                                                                            onChange={(items) => {
                                                                                if (items?.price) {
                                                                                    setServiceInfo({ ...serviceInfo, name: items?.label, service_price: items?.price, drug_price: undefined})

                                                                                } else {
                                                                                    // setServiceInfo({ ...serviceInfo, name: items?.label, price: items?.price })
                                                                                }

                                                                            }
                                                                            }
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </FormItem>
                                                        </div>


                                                        {/* Amount */}
                                                        <div>
                                                            <FormItem
                                                                label="Service Amount"
                                                            >

                                                                <Field
                                                                    name={``}
                                                                >
                                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                                        <Input
                                                                            disabled={true}
                                                                            value={serviceInfo.service_price}
                                                                        />
                                                                    )}

                                                                </Field>
                                                            </FormItem>
                                                        </div>


                                                        {/* qty */}
                                                        <div>
                                                            <FormItem
                                                                label="Service Quantity"
                                                            >

                                                                <Field
                                                                    name={``}
                                                                >
                                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                                        <Input
                                                                            type='number'
                                                                            onChange={(i) =>
                                                                                setServiceInfo({ ...serviceInfo, qty: i.target.value })
                                                                            }
                                                                        />
                                                                    )}

                                                                </Field>
                                                            </FormItem>
                                                        </div>


                                                        {/* amount claimed */}
                                                        <div>
                                                            <FormItem
                                                                label="Amt Claimed"
                                                            >

                                                                <Field
                                                                    name={``}
                                                                >
                                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                                        <Input
                                                                            type='number'
                                                                            onChange={(i) =>
                                                                                setServiceInfo({ ...serviceInfo, amt_claimed: i.target.value })
                                                                            }
                                                                        />
                                                                    )}

                                                                </Field>
                                                            </FormItem>
                                                        </div>


                                                        {/* comments */}
                                                        <div>
                                                            <FormItem
                                                                label="Comment"
                                                            >

                                                                <Field
                                                                    name={``}
                                                                >
                                                                    {({ field, form }: FieldProps<FormModel>) => (
                                                                        <Input
                                                                            onChange={(i) =>
                                                                                setServiceInfo({ ...serviceInfo, comment: i.target.value })
                                                                            }
                                                                        />
                                                                    )}

                                                                </Field>
                                                            </FormItem>
                                                        </div>

                                                        <div className='justify-self-center content-center'>
                                                            <Button
                                                                variant="solid"
                                                                type='button'
                                                                onClick={storeTheServices}
                                                            >

                                                                Add Service
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>

                                            </FormContainer>

                                            {/* Drugs */}
                                            <FormContainer>
                                                <Card
                                                    header="Drugs"
                                                    className='mb-10'>
                                                    <div>
                                                        <div className='grid grid-cols-3 gap-4'>
                                                            {/* drug names */}
                                                            <div>
                                                                <FormItem
                                                                    label="Drugs Name"
                                                                >
                                                                    <Field
                                                                        name="item"
                                                                        placeholder="select a drugs">
                                                                        {({ field, form }: FieldProps<FormModel>) => (
                                                                            <Select
                                                                                isClearable={true}
                                                                                options={nhiaDrugsFromDb}

                                                                                placeholder="select appropriate drug"
                                                                                onChange={(items) => {
                                                                                    if (items?.price) {
                                                                                        setServiceInfo({ ...serviceInfo, name: items?.label, drug_price: items?.price, service_price: undefined })
                                                                                    }

                                                                                }
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>
                                                            </div>


                                                            {/* Amount */}
                                                            <div>
                                                                <FormItem
                                                                    label="Drugs Amount"
                                                                >
                                                                    <Field
                                                                        name={``}
                                                                    >
                                                                        {({ field, form }: FieldProps<FormModel>) => (
                                                                            <Input
                                                                                disabled={true}
                                                                                value={serviceInfo.drug_price}
                                                                            />
                                                                        )}

                                                                    </Field>
                                                                </FormItem>
                                                            </div>


                                                            {/* qty */}
                                                            <div>
                                                                <FormItem
                                                                    label="Drug Quantity"
                                                                >

                                                                    <Field
                                                                        name={``}
                                                                    >
                                                                        {({ field, form }: FieldProps<FormModel>) => (
                                                                            <Input
                                                                                type='number'
                                                                                onChange={(i) =>
                                                                                    setServiceInfo({ ...serviceInfo, qty: i.target.value })
                                                                                }
                                                                            />
                                                                        )}

                                                                    </Field>
                                                                </FormItem>
                                                            </div>


                                                            {/* drug deduction */}
                                                            <div>
                                                                <FormItem
                                                                    label="Deduction"
                                                                >

                                                                    <Field
                                                                        name={``}
                                                                    >
                                                                        {({ field, form }: FieldProps<FormModel>) => (
                                                                            <Select
                                                                                isClearable={true}
                                                                                options={nhiaDrugDeduction}

                                                                                placeholder="select appropriate service"
                                                                                onChange={(items) => {
                                                                                    setServiceInfo({ ...serviceInfo, percentage: items.value })


                                                                                }
                                                                                }
                                                                            />
                                                                        )}

                                                                    </Field>
                                                                </FormItem>
                                                            </div>


                                                            {/* comments */}
                                                            <div>
                                                                <FormItem
                                                                    label="Comment"
                                                                >

                                                                    <Field
                                                                        name={``}
                                                                    >
                                                                        {({ field, form }: FieldProps<FormModel>) => (
                                                                            <Input
                                                                                onChange={(i) =>
                                                                                    setServiceInfo({ ...serviceInfo, comment: i.target.value })
                                                                                }
                                                                            />
                                                                        )}

                                                                    </Field>
                                                                </FormItem>
                                                            </div>
                                                            <div className='justify-self-center content-center'>
                                                                <Button
                                                                    variant="solid"
                                                                    type='button'
                                                                    onClick={storeTheServices}
                                                                >
                                                                    Add Drugs
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>

                                            </FormContainer>


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

                        <div>
                            <Card
                                className='m-7'
                                header="NHIA Enrollee Details">
                                <div>
                                    {/* className='flex grid-cols-{2} items-center' */}
                                    <Avatar size={60} className="mr-4" icon={<HiOutlineUser />} />
                                    <div>
                                        {/* className=' flex grid-cols-{1}' */}
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
                            <Card
                                header="Drugs & Services"
                                className='m-7'>
                                <div>
                                    {
                                        combindedServices.map((items) => {
                                            return (
                                                <>
                                                    <p>Name: <b>{items.name}</b></p>
                                                    {items.service_price && <p>Service Price: <b>{items.service_price}</b></p>}
                                                    {items.drug_price && <p>Drug Price: <b>{items.drug_price}</b></p>}
                                                    <p>Quantity: <b>{items.qty}</b></p>
                                                    {items.percentage && <p>percentage: <b>{items.percentage}</b>%</p>}
                                                    {items.percentage && <p>deducted amount: <b>{(items.percentage * items.drug_price) / 100}</b></p>}
                                                    <p>comment: <b>{items.comment}</b></p>
                                                    <br />
                                                    <br />
                                                </>
                                            )
                                        })
                                    }
                                    {
                                        <h3>Total  N{calculateTotals(combindedServices)}</h3>
                                    }
                                </div>

                            </Card>
                        </div>
                    </div>
                }

            </div>
        </>
    )
}

export default CreateClaims