import { Field, Form, Formik, FieldProps } from 'formik'
import * as Yup from 'yup'
import { FormItem, FormContainer, } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useLocalStorage } from '@/utils/localStorage'
import { useEffect, useState } from 'react'
import Notification from '@/components/ui/Notification'
import type {ProviderServiceTariffType,ProviderDrugTariffType} from '@/utils/customAuth/useProviderAuth'
import useProvider from '@/utils/customAuth/useProviderAuth'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import Select from '@/components/ui/Select'
import CreatableSelect from 'react-select/creatable'
import { SingleValue } from "react-select";
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
import { useParams } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import IconText from '@/components/shared/IconText'
import { useNavigate } from 'react-router-dom'
import ActionLink from '@/components/shared/ActionLink'
import Tabs from '@/components/ui/Tabs'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { healthPlan,PlanCategory } from '@/utils/customAuth/useHealthPlanAuth'
import Radio from '@/components/ui/Radio'
import Checkbox from '@/components/ui/Checkbox'
import type { ChangeEvent } from 'react'

const { TabNav, TabList, TabContent } = Tabs

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
type Select_Type={
  label: string
   value: string
}

const is_surgical_opt = [
  { value: true, label: "Yes", color: '#5243AA' },
  { value: false, label: "No", color: '#0052CC' },
]
const select_patient_type=[
  { value: 'inpatient', label: 'Inpatient' },
  { value: 'outpatient', label: 'Outpatient'},
  { value: 'both', label: 'Both'},
]
const select_service_type=[
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary'},
  { value: 'tertiary', label: 'Tertiary'},
]
const select_formulation=[
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule'},
  { value: 'injection', label: 'Injection'},
  { value: 'liquid', label: 'Liquid'},
]
const select_unit_of_measure = [
  { value: 'EA', label: 'Each (EA)' },
  { value: 'ML', label: 'Milliliter (ML)' },
  { value: 'MG', label: 'Milligram (MG)' },
  { value: 'GM', label: 'Gram (GM)' },
  { value: 'IU', label: 'International Unit (IU)' },
  { value: 'F2', label: 'F2 Unit (F2)' },
  { value: 'UN', label: 'Unit (UN)' },
  { value: 'BX', label: 'Box (BX)' }
];
const select_strength = [
  { value: '0.5mg', label: '0.5 mg' },
  { value: '1mg', label: '1 mg' },
  { value: '2.5mg', label: '2.5 mg' },
  { value: '5mg', label: '5 mg' },
  { value: '10mg', label: '10 mg' },
  { value: '20mg', label: '20 mg' },
  { value: '25mg', label: '25 mg' },
  { value: '50mg', label: '50 mg' },
  { value: '100mg', label: '100 mg' },
  { value: '200mg', label: '200 mg' },
  { value: '250mg', label: '250 mg' },
  { value: '500mg', label: '500 mg' },
  { value: '1g', label: '1 g' },
  { value: '2g', label: '2 g' },
  { value: '5mL', label: '5 mL' },
  { value: '10mL', label: '10 mL' },
  { value: '15mL', label: '15 mL' },
  { value: '30mL', label: '30 mL' },
  { value: '50mL', label: '50 mL' },
  { value: '100mL', label: '100 mL' },
  { value: '100IU', label: '100 IU' },
  { value: '1000IU', label: '1000 IU' },
];

const CreateTariff=()=>{
    const [provider, setProvider] = useState<Select_Type>()
    const [healthPlan, setHealthPlan] = useState<healthPlan[]>([])
    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
    const [checked,setChecked]=useState<boolean>(false)
    const {useCreateProviderServiceTariffAuth,usegetProviderServiceTariffByIdAuth,useGetProviderByID,} = useProvider()
    const { useGetHealthPlanAuth,useGetHealthPlanCategoryAuth } = useHealthPlan()
    const {provider_id}=useParams();

    function openNotification(msg: string, notificationType: 'success' | 'warning' | 'danger' | 'info') {
      toast.push(
          <Notification
              title={notificationType.toString()}
              type={notificationType}>

              {msg}
          </Notification>, {
          placement: 'top-center'
    })}

    const onCreateServiceTariff = async (values: any,
         setSubmitting: (isSubmitting: boolean) => void,
         resetForm: () => void
         ) =>  {

         setSubmitting(true)

         const { getItem } = useLocalStorage()

         values.created_by = getItem("user")
         checked? (values.available_to_all_plans = true,values.insurance_plan_id=null) : values.available_to_all_plans = false

         const data = await useCreateProviderServiceTariffAuth(values)

         if (data) {
             setTimeout(() => {
                if (data.status=='success'){
                     openNotification(data.message,'success')
                     setSubmitting(false)
                     resetForm()
                }
                else if (data.status=='failed'){
                    openNotification(data.message,'danger')
                    setSubmitting(false)
                }
             }, 3000)
         }

    }


    useEffect(()=>{

     const fetchData = async () => {
           const response = await useGetProviderByID({id:provider_id})
           if (response.data) {
                const formattedProviders = {
                  label: response.data[0].name,
                  value: response.data[0].id,
                }
                setProvider(formattedProviders)
       }}

     const fetchData2 = async () => {
           const response = await useGetHealthPlanAuth({ sort: { order: 'asc' } })

           if (response.status === 'success' && response.data) {
               setHealthPlan(response.data)
           }

           if (response.status === 'failed') {
               openNotification(response.message, 'danger')
           }
     }

     fetchData2()
     fetchData()
},[])
  return(
    <>
             <ActionLink to="/provider/view" themeColor={false}>
              <IconText
                className=" text-md font-semibold"
                icon={<HiChevronLeft/>}
            >
                back
            </IconText></ActionLink>
            <h4 className="mb-5">Create Tariff for {provider?.label}</h4>
            <div>

                <div className="p-4">

                      <Formik
                        initialValues={{
                          item_name:"",
                          item_price:"",
                          description:"",
                          provider_id:provider_id,
                          insurance_plan_id:"",
                          hcpcs_code:"",
                          is_surgical:false,
                          patient_type:"",
                          category:"",
                          service_type:""

                           }}
                  //  validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                onCreateServiceTariff(values, setSubmitting, resetForm)
                }}
            >
                {({ isSubmitting,errors ,touched,values}) => (
                    <Form>

                        <FormContainer>
                           {/* Name */}
                            <FormItem label="Item Name"
                            asterisk
                            invalid={errors.item_name && touched.item_name}
                            errorMessage={errors.item_name}>
                                <Field
                                    type="txt"
                                    autoComplete="off"
                                    name="item_name"
                                    placeholder="Enter item name"
                                    component={Input}
                                />
                            </FormItem>
                            {/* Name */}

                            {/* Price */}
                            <FormItem label="Price"
                            asterisk
                            invalid={errors.item_price && touched.item_price}
                            errorMessage={errors.item_price}>
                                <Field
                                    type="number"
                                    autoComplete="off"
                                    name="item_price"
                                    placeholder="Enter price"
                                    component={Input}
                                />
                            </FormItem>
                            {/* Price */}

                            {/* description */}
                            <FormItem label="Description"
                            invalid={errors.description && touched.description}
                            errorMessage={errors.description}>
                                <Field
                                    type="txt"
                                    autoComplete="off"
                                    name="description"
                                    placeholder="Enter Description"
                                    component={Input}
                                />
                            </FormItem>
                           {/* description */}

                           {/* hcpcs_code */}
                            <FormItem label="HCPCS Code"
                            invalid={errors.hcpcs_code && touched.hcpcs_code}
                            errorMessage={errors.hcpcs_code}>
                                <Field
                                    type="txt"
                                    autoComplete="off"
                                    name="hcpcs_code"
                                    placeholder="Enter HCPCS Code"
                                    component={Input}
                                />
                            </FormItem>
                            {/* hcpcs_code */}

                            {/* is_surgical */}
                            <FormItem
                             label="is_surgical?"
                             invalid={errors.is_surgical && touched.is_surgical}
                             errorMessage={errors.is_surgical}
                         >
                             <Field
                                 name="is_surgical">
                                 {({ field, form }: FieldProps<FormModel>) => (
                                     <Select
                                         field={field}
                                         form={form}
                                         options={is_surgical_opt}
                                         value={is_surgical_opt?.filter(
                                             (items) =>
                                                 items.value === values.is_surgical
                                            )}
                                         onChange={(items) =>
                                             form.setFieldValue(
                                                 field.name,
                                                 items?.value
                                             )
                                         } />
                                 )}
                             </Field>
                            </FormItem>
                            {/* is_surgical */}

                            {/* patient_type */}
                            <FormItem
                             label="Select Patient Type"
                             invalid={errors.patient_type && touched.patient_type}
                             errorMessage={errors.patient_type}
                         >
                             <Field
                                 name="patient_type">
                                 {({ field, form }: FieldProps<FormModel>) => (
                                     <Select
                                         field={field}
                                         form={form}
                                         options={select_patient_type}
                                         value={select_patient_type?.filter(
                                             (items) =>
                                                 items.value === values.patient_type
                                            )}
                                         onChange={(items) =>
                                             form.setFieldValue(
                                                 field.name,
                                                 items?.value
                                             )
                                         } />
                                 )}
                             </Field>
                            </FormItem>
                            {/* patient_type */}

                            {/* category */}
                            <FormItem label="Category"
                            invalid={errors.category && touched.category}
                            errorMessage={errors.category}>
                                <Field
                                    type="txt"
                                    autoComplete="off"
                                    name="category"
                                    placeholder="Enter Category"
                                    component={Input}
                                />
                            </FormItem>
                            {/* category */}

                            {/* service_type */}
                            <FormItem
                             label="Select service type"
                             invalid={errors.service_type && touched.service_type}
                             errorMessage={errors.service_type}
                              >
                             <Field
                                 name="service_type">
                                 {({ field, form }: FieldProps<FormModel>) => (
                                     <Select
                                         field={field}
                                         form={form}
                                         options={select_service_type}
                                         value={select_service_type?.filter(
                                             (items) =>
                                                 items.value === values.service_type
                                            )}
                                         onChange={(items) =>
                                             form.setFieldValue(
                                                 field.name,
                                                 items?.value
                                             )
                                         } />
                                 )}
                             </Field>
                            </FormItem>
                            {/* service_type */}

                            {/* insurance_plan */}

                            <Checkbox onChange={(value)=>setChecked(value)} className='mb-5'>
                                Enable all Health Plans
                            </Checkbox>


                           { checked==false && (
                             <FormItem label="Health Plan"
                                     invalid={errors.insurance_plan_id && touched.insurance_plan_id}
                                     errorMessage={errors.insurance_plan_id}>

                                     <Field name="insurance_plan_id">
                                          {({
                                              field,
                                              form,
                                          }: FieldProps<FormModel>) => (
                                              <Select
                                                  options={healthPlan}
                                                  isMulti
                                                  isSearchable={true}
                                                   onChange={(selectedOptions) => {
                                                    const selectedIds = selectedOptions.map(option => option.value); // Extract UUIDs
                                                     setSelectedPlans(selectedIds);
                                                     form.setFieldValue(field.name, selectedIds);
                                                      }}
                                                  placeholder="Select Health Plans..."
                                              />
                                          )}
                                      </Field>
                            </FormItem>)}
                            {/* insurance_plan */}

                            <FormItem>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    {isSubmitting
                                        ? 'Saving...'
                                        : 'Add tariff '}
                                </Button>
                            </FormItem>
                        </FormContainer>

                  </Form>

                )}
                      </Formik>
                </div>
        </div>


    </>
  )
}

export default CreateTariff
