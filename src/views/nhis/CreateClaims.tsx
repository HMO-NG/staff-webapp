import React, { Component, useEffect, useState } from 'react'
import useEnrollee from '@/utils/customAuth/useEnrolleeAuth'
import debounce from 'lodash/debounce'
import Select from '@/components/ui/Select'
import { components, OptionProps, SingleValueProps } from "react-select";
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'
import useHealthCheck from '@/utils/customAuth/useHealthCheckerAuth'
import type { FieldProps } from 'formik'
import * as Yup from 'yup'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Field, Form, Formik } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import useProvider, { NHIAProviderType } from '@/utils/customAuth/useProviderAuth';

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
    // recieving_hcf: Yup.string().required('Recieving HCF name Required'),
    // referral_code: Yup.string().required('Referral code required'),
    // approval_date: Yup.string().required('Please specify the approval date'),
    // date_hmo_recieved_claim: Yup.string().required('Please specify the date HMO recieved claim'),
    // diagnosis: Yup.string().required('Please specify the diagnosis'),
    // items: Yup.,
    // amount_claimed: Yup.string().required('Please specify the amount claimed'),
    // amount_agreed: Yup.string().required('Please specify the amount agreed'),
    // amount_paid: Yup.string().required('Please specify the amount required'),
    // remarks: Yup.string().required(''),
})
const CreateClaims = () => {

    const [selectedValue, setSelectedValue] = useState<NHIAEnrollee>()
    const [search, setSearch] = useState<string | undefined>(undefined)
    const [searchProvider, setSearchProvider] = useState<string | undefined>(undefined)
    const [data, setData] = useState<NHIAEnrollee[]>([])
    const [providerData, setProviderData] = useState<NHIAProviderType[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const { useGetAllNhiaEnrolleeAuth } = useEnrollee()
    const { useHealthCheckAuth } = useHealthCheck()
    const { useSearchNHIAProviderByHCPIDAuth } = useProvider()


    const debounceFn = debounce(handleDebounceFn, 500)
    const providerDebounceFn = debounce(getProviderDebounceFn, 500)

    function handleDebounceFn(val: string) {
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setSearch(val)
        }
    }

    function getProviderDebounceFn(val: string) {
        if (typeof val === 'string' && (val.length > 1 || val.length === 0)) {
            setSearchProvider(val)
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

    const handleInputChange = (newValue) => {
        const inputValue = newValue.replace(/\W/g, '')
        debounceFn(inputValue)
    }

    const getProviderHandleInput = (newValue) => {
        const inputValue = newValue.replace(/\W/g, '')
        providerDebounceFn(inputValue)
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

            if (searchProvider !== undefined) {
                setLoading(true)
                const response = await useSearchNHIAProviderByHCPIDAuth(searchProvider)


                if (response?.status === 'success') {
                    setLoading(false)
                    setProviderData(response.data!)
                }

                if (response?.status === 'failed') {
                    setLoading(false)
                }

            }

        }
        fetchData()
        console.log("provider", providerData)
    }, [search, searchProvider])

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
                                referring_hcf: '',
                                recieving_hcf: ''
                            }}
                            validationSchema={validationSchema}

                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                // onCreateProvider(values, setSubmitting, resetForm)

                                alert(JSON.stringify(values, null, 2))
                                setSubmitting(false)
                            }}
                        >
                            {({ values, touched, errors, isSubmitting }) => (
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
                                                        options={providerData}
                                                        onChange={(k) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                k?.value
                                                            )
                                                            setLoading(false)

                                                        }}
                                                        isLoading={loading}
                                                        value={providerData.filter((item) =>
                                                            item.value === values.referring_hcf
                                                        )}
                                                    />
                                                )}
                                            </Field>

                                            {/* Things of concern */}
                                            {/* 1. too much api calls - useEffect runs all the time, check others.
                                            2. the exception i am returning all the time for the Select

                                             */}
                                        </FormItem>

                                        {/* nhia code */}
                                        {/* <FormItem
                                            asterisk
                                            label="NHIA Code"
                                            invalid={errors.nhia_code && touched.nhia_code}
                                            errorMessage={errors.nhia_code}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="nhia_code"
                                                placeholder="Drug Code eg: NHIS-01-03-01"
                                                component={Input}
                                            />
                                        </FormItem> */}

                                        {/* dosage_form */}
                                        {/* <FormItem

                                            asterisk
                                            label="Dosage"
                                            invalid={errors.dosage_form && touched.dosage_form}
                                            errorMessage={errors.dosage_form}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="dosage_form"
                                                placeholder="Dosage eg: Injection, Tablets etc."
                                                component={Input}
                                            />
                                        </FormItem> */}

                                        {/* strength */}
                                        {/* <FormItem

                                            asterisk
                                            label="Drug Strength"
                                            invalid={errors.strength && touched.strength}
                                            errorMessage={errors.strength}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="strength"
                                                placeholder="Drug Strengths eg: 0.5mg/amp, 5mg/ml in 2 ml etc."
                                                component={Input}
                                            />
                                        </FormItem> */}

                                        {/* presentation */}
                                        {/* <FormItem
                                            asterisk
                                            label="presentation"
                                            invalid={errors.presentation && touched.presentation}
                                            errorMessage={errors.presentation}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="presentation"
                                                placeholder="Drug Presentation eg:Amp., Capsule, Tablet etc."
                                                component={Input}
                                            />
                                        </FormItem> */}

                                        {/* category */}
                                        {/* <FormItem
                                            asterisk
                                            label="category"
                                            invalid={errors.category && touched.category}
                                            errorMessage={errors.category}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="category"
                                                placeholder="Drug Category eg: Pain relieve"
                                                component={Input}
                                            />
                                        </FormItem> */}

                                        {/* plan_type */}
                                        {/* <FormItem
                                            asterisk
                                            label="Plan Type"
                                            invalid={errors.plan_type && touched.plan_type}
                                            errorMessage={errors.plan_type}
                                        >
                                            <Field

                                                name="plan_type">
                                                {({ field, form }: FieldProps<FormModel>) => (

                                                    <Select
                                                        options={healthPlan}
                                                        placeholder={"Select Health Plan Name"}
                                                        value={healthPlan.filter((item) =>
                                                            item.value === values.plan_type
                                                        )}
                                                        onChange={(data) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                data?.value
                                                            )
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem> */}

                                        {/* price */}
                                        {/* <FormItem
                                            asterisk
                                            label="Price"
                                            invalid={errors.price && touched.price}
                                            errorMessage={errors.price}
                                        >
                                            <Field
                                                type="number"
                                                autoComplete="off"
                                                name="price"
                                                placeholder="price"
                                                component={Input}
                                            />
                                        </FormItem> */}

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
                            )}
                        </Formik>
                    </div>
                }

            </div>
        </>
    )
}

export default CreateClaims