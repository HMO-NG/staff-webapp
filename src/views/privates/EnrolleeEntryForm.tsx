import { Field, Form, Formik,FieldArray } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import * as Yup from 'yup'
import { useNavigate ,useLocation} from 'react-router-dom'
import Upload from '@/components/ui/Upload'
import * as XLSX from 'xlsx'
import { HiCheckCircle, HiCloudUpload } from 'react-icons/hi'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
import useDouments from '@/utils/customAuth/useDocumentAuth'
import { useLocalStorage } from '@/utils/localStorage'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import type { FieldProps } from 'formik'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { SingleValue } from "react-select";
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser, HiMinus } from 'react-icons/hi'
import { FcImageFile } from 'react-icons/fc'
import axios from 'axios';
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { healthPlan } from '@/utils/customAuth/useHealthPlanAuth'


type PrivateEnrollee={
  id:string
  first_name:string
  last_name:string
  middle_name:string
  email:string
  phone_number:string
  passport_url:string
  sex:string
  department:string
  position:string
  dob:string
  beneficiary_type:string
  family_size:string
  state:string
  city:string
  address:string
  is_active:boolean
  company_id:string
  provider_id:string

  blood_group: string,
  genotype: string,
  disabilities: string,
  allergies: string,
  pre_existing_conditions:string,
  past_surgeries: string,
  family_medical_history: string,

  linked_to_user:string
  enrolled_by:string
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
  segment: string[]
  upload: File[]
}
type Select_Type={
  label: string
   value: string
}
const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('Please enter enrollee first name'),
    last_name: Yup.string().required('Please enter enrollee last name'),
    middle_name: Yup.string().required('Please enter enrollee middle name'),
    email: Yup.string().required('Email address is required').email('Please enter a valid email address'),
    phone_number: Yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Must be only digits').min(10, 'Must be at least 10 digits'),
    passport_url: Yup.string().required('Passport photo is required'),
    sex: Yup.string().required('Please select enrollee gender'),
    department: Yup.string().required('Please specify enrollee department'),
    position: Yup.string().required('Please specify enrollee position'),
    dob: Yup.date().required('Date of birth is required').max(new Date(), 'Date cannot be in the future'),
    beneficiary_type: Yup.string().required('Please select beneficiary type'),
    state: Yup.string().required('Please select enrollee state'),
    city: Yup.string().required('Please enter enrollee city'),
    address: Yup.string().required('Please enter enrollee full address'),
    company_id: Yup.string().required('Company is required'),
    provider_id: Yup.string().required('Provider is required'),
    blood_group: Yup.string().required('Please select enrollee blood group').oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid blood group'),
    genotype: Yup.string().required('Please select enrollee genotype').oneOf(['AA', 'AS', 'AC', 'SS', 'SC', 'CC'], 'Please select a valid genotype'),
    disabilities: Yup.string().nullable(),
    allergies: Yup.string().nullable(),
    pre_existing_conditions: Yup.string().nullable(),
    past_surgeries: Yup.string().nullable(),
    family_medical_history: Yup.string().nullable(),

  //TODO make dependants valiidation schema work
  // dependents: Yup.array().of(
  //   Yup.object().shape({
  //   first_name: Yup.string().required('Please enter dependent first name'),
  //   last_name: Yup.string().required('Please enter dependent last name'),
  //   middle_name: Yup.string().required('Please enter dependent middle name'),
  //   email: Yup.string().required('Dependent email address is required').email('Please enter a valid email for dependent'),
  //   phone_number: Yup.string().required('Dependent phone number is required').matches(/^[0-9]+$/, 'Phone number must contain only digits').min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number cannot exceed 15 digits'),
  //   passport_url: Yup.string().required('Dependent passport photo is required').url('Please provide a valid URL for passport photo'),
  //   sex: Yup.string().required('Please select dependent gender').oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
  //   department: Yup.string().required('Please enter dependent department'),
  //   position: Yup.string().required('Please enter dependent position'),
  //   dob: Yup.date().required('Dependent date of birth is required').max(new Date(), 'Date of birth cannot be in the future'),
  //   state: Yup.string().required('Please select dependent state'),
  //   city: Yup.string().required('Please enter dependent city'),
  //   address: Yup.string().required('Please enter dependent address'),
  //   provider_id: Yup.string().required('Provider ID for dependent is required'),
  //   blood_group: Yup.string().required('Please select dependent blood group').oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Please select a valid blood group'),
  //   genotype: Yup.string().required('Please select dependent genotype').oneOf(['AA', 'AS', 'AC', 'SS', 'SC', 'CC'], 'Please select a valid genotype'),
  //   disabilities: Yup.string().required('Please specify any disabilities for dependent').nullable(),
  //   allergies: Yup.string().required('Please specify any allergies for dependent').nullable(),
  //   pre_existing_conditions: Yup.string().required('Please specify any pre-existing conditions for dependent').nullable(),
  //   past_surgeries: Yup.string().required('Please specify any past surgeries for dependent').nullable(),
  //   family_medical_history: Yup.string().required('Please provide family medical history for dependent').nullable()

  //   })
  // )
})
const sex = [
  { value: "M", label: "Male", color: '#5243AA' },
  { value: "F", label: "Female", color: '#0052CC' },
]
const no_of_dependants = [
  { value: "1", label: "1"},
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
]
const beneficiary_type_select = [
  { value: "individual", label: "Individual" },
  { value: "family", label: "Family"},
]

const EnrolleeEntryForm = () => {
  const {useGetCompanyAuth,useCreateCompanyAuth,
    usegetPrivateProviderAuth,OnboardIndividualPrivateEnrolleesAuth,
    usegetSinglePrivateEnrolleeAuth,createPrivateEnrolleeDependantsAuth,}=usePrivates()
  const {addDocumentAuth,uploadRawFilesTocloudinaryAuth}=useDouments()
  const { useGetHealthPlanAuth} = useHealthPlan()
  const navigate = useNavigate()
  const location = useLocation();
  const { getItem,setItem,removeItem } = useLocalStorage()
  const [companieslist, setCompaniesList] = useState<Select_Type[]>([])
  const [selectedCompany, setselectedCompany] = useState<Select_Type | null>(companieslist[0])
  const [companyId, setcompanyId] = useState<{
    company_name:string,
    company_id:string

  }>({
    company_name:'',
    company_id:''
  })
  const [providerlist, setProviderList] = useState<Select_Type[]>([])
  const [inputValue, setInputValue] = useState("");
  const [beneficiary_types, setBeneficiary_types] = useState<Select_Type | null>(beneficiary_type_select[0])
  const [selected_no_of_dependants, setselected_no_of_dependants] = useState<Select_Type | null>(no_of_dependants[0])
  const [selectedProvider, setselectedProvider] = useState<Select_Type | null>(providerlist[0])
  const [RegisteredEnrollee, setRegisteredEnrollee] = useState<PrivateEnrollee | undefined>()
  const [plan_type, setPlan_type] = useState()
  const [open_add_dependants, setopen_add_dependants] = useState<boolean>(false)
  const [open_Enrollee_Profile, setopen_Enrollee_Profile] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([]);
  const [doc_name, setdoc_name] = useState("")
  const [is_upload_disabled, setis_upload_disabled] = useState<boolean>(true)
  const [healthPlan, setHealthPlan] = useState<healthPlan[]>([])


  function openNotification(msg: string, notificationType: 'success' | 'warning' | 'danger' | 'info') {
    toast.push(
        <Notification
            title={notificationType.toString()}
            type={notificationType}>

            {msg}
        </Notification>, {
        placement: 'top-center'
    })
}

      const [successMessage, setSuccessMessage] = useTimeOutMessage()
      const fetchEnrollee = async (enrollee_id:string) => {

        const response = await usegetSinglePrivateEnrolleeAuth(enrollee_id)
        if (response.data) {
          setRegisteredEnrollee(response?.data)

        }
        console.log('ern data',response)
    }
          const onCreateEnrollee = async (values: any,
              setSubmitting: (isSubmitting: boolean) => void,
              resetForm: () => void
          ) => {

              setSubmitting(true)


              values.enrolled_by = getItem('user')
              if (beneficiary_types?.value == 'individual'){
                delete values.dependents;
              }

              let data= values

              const response = await OnboardIndividualPrivateEnrolleesAuth(data)
              console.log(data)

              setItem('enrollee',response?.data)
              sessionStorage.setItem("enrollee", JSON.stringify(response?.data));
              const ern_id = JSON.parse(sessionStorage.getItem('enrollee')|| '""')
              fetchEnrollee(ern_id.enrollee_id)

              if (response) {
                  setTimeout(() => {
                      setSuccessMessage(response.message)
                      setSubmitting(false)
                      resetForm()
                  }, 3000)

                  setopen_Enrollee_Profile(true)
                  openNotification(response.message,'success')
              }

          }
          const onCreateDependant = async (values: any,
            setSubmitting: (isSubmitting: boolean) => void,
            resetForm: () => void
        ) => {

            setSubmitting(true)


            const ern_id = getItem('enrollee')
            values.family_size=RegisteredEnrollee?.family_size
            let data= values

            const response = await createPrivateEnrolleeDependantsAuth(ern_id.enrollee_id,data)
            console.log(data)

            if (response) {
                setTimeout(() => {
                    setSuccessMessage(response.message)
                    setSubmitting(false)
                    resetForm()
                }, 3000)
                setopen_add_dependants(false)
                fetchEnrollee(ern_id.enrollee_id)
                openNotification(response.message,'success')
            }

        }
          const getCompanies = async () => {
            try {
                const response = await useGetCompanyAuth() // Fetch API data

                if (
                    response?.status === 'success' &&
                    Array.isArray(response.data)
                ) {
                    // Extract only 'id' and 'company_name'
                    const formattedCompanies = response.data.map((company) => ({
                        value: company.id,
                        label: company.company_name,
                    }))

                    setCompaniesList(formattedCompanies) // Update state with filtered data
                } else {
                    console.error('Invalid response format')
                }
            } catch (error) {
                console.error('Failed to fetch companies', error)
            }
        }
        const handle_change =(e:React.ChangeEvent<HTMLInputElement>)=>{
          console.log('nameee',e.target.value)
          setInputValue(e.target.value);
        }
        const handle_doc_name_change =(e:React.ChangeEvent<HTMLInputElement>)=>{
          console.log('nameee',e.target.value)
          setdoc_name(e.target.value);
          if(doc_name.length >= 1){
            setis_upload_disabled(false)
          }
        }

        const upload_to_cloudinary= async()=>{
          const formData = new FormData();
          formData.append('file', files[0]);
          formData.append('upload_preset', 'hciimage');
          formData.append('cloud_name', 'dtqdaogbn');

          const response2 = await uploadRawFilesTocloudinaryAuth(formData,'dtqdaogbn')
          let enr_data =getItem('enrollee')
          let user_data = getItem('user')
          let data={
            name:doc_name,
            url:response2.data.secure_url,
            user_type:'enrollee',
            linked_to_user:enr_data.linked_to_user,
            created_by:user_data
          }
          if(response2){
         const result = await addDocumentAuth(data)
          }
        }

          useEffect(() =>{
            getCompanies()
           const fetchData = async () => {
            const response = await usegetPrivateProviderAuth()
            if (response.data) {
            const formattedProviders = response.data.map((provider:any) => ({
              label: provider.name,
              value: provider.id,
            }))
              setProviderList(formattedProviders)

              const response2 = await useGetHealthPlanAuth({ sort: { order: 'asc' } })

              if (response2.status === 'success' && response2.data) {
                  setHealthPlan(response2.data)
              }

              if (response2.status === 'failed') {
                  openNotification(response2.message, 'danger')
              }
            }}
            const ern_id = JSON.parse(sessionStorage.getItem('enrollee')|| '""')
            if(ern_id){
             fetchEnrollee(ern_id.enrollee_id)
              setBeneficiary_types({label:ern_id.beneficiary_type,value:ern_id.beneficiary_type})
            }

        fetchData()


          },[])



          const  initialValues={
            enrollee:{
            first_name: "",
            last_name: "",
            middle_name: "",
            email: "",
            phone_number: "",
            passport_url: "",
            sex: "",
            department: "",
            position: "",
            dob: "",
            beneficiary_type: "",
            family_size: "",
            state: "",
            city: "",
            address: "",
            company_id: "",
            provider_id: "",
            health_plan_id:"",

            blood_group:"",
            genotype:"",
            disabilities:null,
            allergies:null,
            pre_existing_conditions:null,
            past_surgeries:null,
            family_medical_history:null,


             },
             dependents: {
                first_name: '',
                last_name:'',
                middle_name:'',
                email:'',
                phone_number:'',
                passport_url:"",
                sex: "",
                dob:"",
                state:"",
                city:"",
                address:"",

                blood_group:'',
                genotype:'',
                disabilities:null,
                allergies:null,
                pre_existing_conditions:null,
                past_surgeries:null,
                family_medical_history:null,
              },

            };

    return (
      <>

        <Formik
            initialValues={initialValues.enrollee}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              onCreateEnrollee(values, setSubmitting, resetForm)
                console.log(`enrolee data is:`, values)

            }}
        >
            {({ isSubmitting,errors ,touched,values}) => (
                <Form>

                    <FormContainer>
                      {open_Enrollee_Profile==true || RegisteredEnrollee?.is_active==true ?(
                               <div>
                               <Card
                                   className='m-7'
                                   header="Registered Enrollee Details">
                                   <div>
                                    <div className='flex items-center gap-3 mb-5'>
                                    <Avatar size={60} shape="circle" className="mr-4"
                                      {...(RegisteredEnrollee?.passport_url ? {
                                        src: RegisteredEnrollee?.passport_url
                                      } : {
                                        icon: <HiOutlineUser />
                                      })}
                                        />
                                        <h4> {RegisteredEnrollee?.first_name}</h4>
                                    </div>

                                       <div>
                                           {/* className=' flex grid-cols-{1}' */}
                                           {/* <p>first_name: {RegisteredEnrollee?.first_name}</p> */}
                                           <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                           <div className="space-y-2">
                                            {[
                                            { label: "Last Name", value: RegisteredEnrollee?.last_name },
                                            { label: "Middle Name", value: RegisteredEnrollee?.middle_name },
                                            { label: "Phone Number", value: RegisteredEnrollee?.phone_number },
                                            { label: "State", value: RegisteredEnrollee?.state },
                                            { label: "City", value: RegisteredEnrollee?.city },
                                            ].map((item) => (
                                            <div key={item.label} className="flex items-center">
                                              <p className="font-medium heading-text min-w-[150px]">{item.label}:</p>
                                              <p className="flex-1 truncate">{item.value || "-"}</p>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                            { label: "Sex", value: RegisteredEnrollee?.sex },
                                            { label: "Company ID", value: RegisteredEnrollee?.company_id },
                                            { label: "Provider ID", value: RegisteredEnrollee?.provider_id },
                                            { label: "beneficiary_type", value: RegisteredEnrollee?.beneficiary_type },
                                            { label: "family_size", value: RegisteredEnrollee?.family_size },
                                            ].map((item) => (
                                            <div key={item.label} className="flex items-center">
                                              <p className="font-medium heading-text min-w-[150px]">{item.label}:</p>
                                              <p className="flex-1 truncate">{item.value || "-"}</p>
                                            </div>
                                          ))}
                                        </div>



                                           </div>




                                       </div>
                                   </div>
                               </Card>
                               <Card  className='m-7'>
                               <FormItem label="Document Name"
                                asterisk
                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name="doc_name"
                                        placeholder="Enter document name"
                                        component={Input}
                                        onChange={handle_doc_name_change}
                                    />
                                </FormItem>
                               <Upload draggable disabled={is_upload_disabled}
                                onChange={(file: File[], fileList: File[])=>{

                                       console.log('ttt',file)
                                       console.log('ooo',fileList)

                                      const fileArray = Array.from(file);
                                      setFiles(fileArray);

                                      console.log(fileArray);
                                      // upload_to_cloudinary()

                                    }} uploadLimit={1}>
                                        <div className="my-16 text-center">
                                            <div className="text-6xl mb-4 flex justify-center">
                                                <FcImageFile />
                                            </div>
                                            <p className="font-semibold">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop Enrollee Doument here, or{' '}
                                                </span>
                                                <span className="text-blue-500">browse</span>
                                            </p>
                                            <p className="mt-1 opacity-60 dark:text-white">
                                                Support: jpeg, png, gif
                                            </p>
                                        </div>
                                </Upload>
                                <Button
                                   variant="twoTone"
                                   type="button"
                                   size="sm" onClick={()=>{
                                    upload_to_cloudinary()
                                    setis_upload_disabled(true)

                                   }}>Upload</Button>
                               </Card>

                            </div>

                      ):
                        <Card
                      header='Create New Enrollee'
                      footerBorder={false}
                      headerBorder={false}>
                         {/* Personal Info */}
                         <Card
                             className='mb-10'
                              header="Personal Info"
                              footerBorder={false}
                              headerBorder={false}>
                        <div className='grid lg:grid-cols-5 md:grid-cols-4 gap-4'>
                        <FormItem label="First Name"
                        asterisk
                        invalid={errors.first_name && touched.first_name}
                        errorMessage={errors.first_name

                        }
                        >
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="first_name"
                                placeholder="Enter First Name"
                                // value={inputValue}

                                // onChange={handle_change}
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label="Last Name"
                        asterisk
                        invalid={errors.last_name && touched.last_name}
                        errorMessage={errors.last_name}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="last_name"
                                placeholder="Enter Last Name"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label="Middle Name"
                        asterisk
                        invalid={errors.middle_name && touched.middle_name}
                        errorMessage={errors.middle_name}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="middle_name"
                                placeholder="Enter Middle Name"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label="Email"
                        asterisk
                        invalid={errors.email && touched.email}
                        errorMessage={errors.email}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="email"
                                placeholder="Enter Email"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label="Phonenumber"
                        asterisk
                        invalid={errors.phone_number && touched.phone_number}
                        errorMessage={errors.phone_number}>
                            <Field
                                type="number"
                                autoComplete="off"
                                name="phone_number"
                                placeholder="Enter phonenumber"
                                component={Input}
                            />
                        </FormItem>
                         </div>

                         <div className='grid lg:grid-cols-5 md:grid-cols-3 gap-4'>
                        {/* <FormItem label="Passport Photograph"
                        asterisk
                        invalid={errors.passport_url && touched.passport_url}
                        errorMessage={errors.passport_url}>
                            <Field
                                type="file"
                                autoComplete="off"
                                name="passport_url"
                                placeholder="Enter passport url"
                                component={Input}
                            />
                        </FormItem> */}

                        <FormItem
                                    asterisk
                                    label="sex"
                                    invalid={errors.sex && touched.sex}
                                    errorMessage={errors.sex}
                                >
                                    <Field
                                        name="sex">
                                        {({ field, form }: FieldProps<FormModel>) => (

                                            <Select
                                                options={sex}
                                                placeholder={"Select Enrollee Sex"}
                                                value={sex.filter((item) =>
                                                    item.value === values.sex
                                                )}
                                                onChange={(data) => {
                                                    form.setFieldValue(
                                                        "sex",
                                                        data?.value
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                         </FormItem>

                        <FormItem label="Department"
                        invalid={errors.department && touched.department}
                        errorMessage={errors.department}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="department"
                                placeholder="Enter Department"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label="Position"
                        invalid={errors.position && touched.position}
                        errorMessage={errors.position}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="position"
                                placeholder="Enter Position"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label="dob"
                        asterisk
                        invalid={errors.dob && touched.dob}
                        errorMessage={errors.dob}>
                            <Field
                                type="date"
                                autoComplete="off"
                                name="dob"
                                placeholder="Enter dob"
                                component={Input}
                            />
                        </FormItem>


                        </div>
                        <div className='grid lg:grid-cols-4 md:grid-cols-4 gap-4'>
                        <FormItem label="State"
                        asterisk
                        invalid={errors.state && touched.state}
                        errorMessage={errors.state}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="state"
                                placeholder="Enter State"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label="City"
                        asterisk
                        invalid={errors.city && touched.city}
                        errorMessage={errors.city}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="city"
                                placeholder="Enter City"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem label="Address"
                        asterisk
                        invalid={errors.address && touched.address}
                        errorMessage={errors.address}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="address"
                                placeholder="Enter Address"
                                component={Input}
                            />
                        </FormItem>


                        </div>
                        </Card>
                         {/* Personal Info */}

                        {/* Plan Info */}
                          <Card
                          className='mb-10'
                          header="Plan Info"
                          footerBorder={false}
                          headerBorder={false} bordered>
                          <div className='grid lg:grid-cols-4 md:grid-cols-4 gap-4'>
                          <FormItem label="Beneficiary Type"
                        asterisk
                        invalid={errors.beneficiary_type && touched.beneficiary_type}
                        errorMessage={errors.beneficiary_type}>
                           <Field name="beneficiary_type">
                                 {({ field, form }: FieldProps<FormModel>) => (

                                   <Select
                                     options={ beneficiary_type_select}
                                     value={ beneficiary_types}
                                     onChange={(option:SingleValue<Select_Type>) => {
                                       form.setFieldValue('beneficiary_type', option?.value);
                                       setBeneficiary_types(option)
                                       console.log('hddh',beneficiary_types)

                                     }}
                                     isSearchable={true}
                                     placeholder="Select Beneficiary Type..."
                                   />
                                 )}
                         </Field>
                        </FormItem>

                        {/* <FormItem label="Number Of Dependants"
                        asterisk
                        invalid={errors.family_size && touched.family_size}
                        errorMessage={errors.family_size}>
                        <Field name="family_size">
                                 {({ field, form }: FieldProps<FormModel>) => (

                                   <Select
                                     options={no_of_dependants}
                                     value={selected_no_of_dependants}
                                     onChange={(option:SingleValue<Select_Type>) => {
                                       // Update both Formik and any external state if needed
                                       form.setFieldValue('family_size', option?.value);
                                       setselected_no_of_dependants(option)
                                       console.log('allkdjd',selected_no_of_dependants)
                                     }}
                                     isDisabled={beneficiary_types?.value !== 'family'}
                                     isSearchable={true}
                                     placeholder="Select Number Of Dependants..."
                                   />
                                 )}
                         </Field>
                        </FormItem> */}
                          <FormItem label="Provider"
                          asterisk
                          invalid={
                            errors.provider_id &&
                            touched.provider_id
                        }
                        errorMessage={errors.provider_id}>
                        <Field name="provider_id">
                                 {({ field, form }: FieldProps<FormModel>) => (

                                   <Select
                                     options={providerlist}
                                     value={selectedProvider}
                                     onChange={(option:SingleValue<Select_Type>) => {
                                       // Update both Formik and any external state if needed
                                       form.setFieldValue('provider_id', option?.value);
                                       setselectedProvider(option)
                                     }}

                                     isSearchable={true}
                                     placeholder="Select provider..."
                                   />
                                 )}
                         </Field>
                        </FormItem>
                        <FormItem
                                    asterisk
                                    label="Select Client"
                                    invalid={
                                        errors.company_id &&
                                        touched.company_id
                                    }
                                    errorMessage={errors.company_id}
                                >
                                    <Field name="company_id">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<FormModel>) => (
                                            <Select
                                                options={companieslist}
                                                value={selectedCompany}

                                                onChange={(option:SingleValue<Select_Type>) =>{
                                                    form.setFieldValue(
                                                        'company_id',
                                                        option?.value);
                                                        setselectedCompany(option)
                                                }}
                                                isSearchable={true}
                                                placeholder="Select Client..."

                                            />
                                        )}
                                    </Field>
                                    {/* <p>{company}</p> */}
                        </FormItem>
                        <FormItem
                            label="Health Plan"
                            invalid={errors.health_plan_id && touched.health_plan_id}
                            errorMessage={errors.health_plan_id}>

                            <Field

                                name="health_plan_id">
                                {({ field, form }: FieldProps<FormModel>) => (

                                    <Select
                                        options={healthPlan}
                                        placeholder={"Select Health Plan Name"}
                                        value={healthPlan.filter((item) =>
                                            item.value === values.health_plan_id
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
                            </FormItem>
                        </div>
                         </Card>
                        {/* Plan Info */}

                        {/* Medical Info */}
                          <Card
                          className='mb-10'
                          header="Medical Info"
                          footerBorder={false}
                          headerBorder={false}>
                          <div className='grid lg:grid-cols-4 md:grid-cols-3 gap-4'>
                        <FormItem label="Blood Group"
                        invalid={errors.blood_group && touched.blood_group}
                        errorMessage={errors.blood_group}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="blood_group"
                                placeholder="Enter Blood Group"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="Genotype"
                        invalid={errors.genotype && touched.genotype}
                        errorMessage={errors.genotype}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="genotype"
                                placeholder="Enter Genotype"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="Disabilities"
                        invalid={errors.disabilities && touched.disabilities}
                        errorMessage={errors.disabilities}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="disabilities"
                                placeholder="Enter Disabilities"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="Allergies"
                        invalid={errors.allergies && touched.allergies}
                        errorMessage={errors.allergies}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="allergies"
                                placeholder="Enter Allergies"
                                component={Input}
                            />
                        </FormItem>
                        </div>
                        <div className='grid lg:grid-cols-3 md:grid-cols-3 gap-4'>
                        <FormItem label="Pre Existing Conditions"
                        invalid={errors.pre_existing_conditions && touched.pre_existing_conditions}
                        errorMessage={errors.pre_existing_conditions}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="pre_existing_conditions"
                                placeholder="Enter Pre Existing Conditions"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="past_surgeries"
                        invalid={errors.past_surgeries && touched.past_surgeries}
                        errorMessage={errors.past_surgeries}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="past_surgeries"
                                placeholder="Enter Past Surgeries"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="Family Medical History"
                        invalid={errors.family_medical_history && touched.family_medical_history}
                        errorMessage={errors.family_medical_history}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="family_medical_history"
                                placeholder="Enter Family Medical History"
                                component={Input}
                            />
                        </FormItem>
                        </div>
                          </Card>
                        {/* Medical Info */}


                        <FormItem>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : 'Add Enrollee '}
                            </Button>
                        </FormItem>
                      </Card>


                      }

                    </FormContainer>

                </Form>
            )}

        </Formik>
        {open_add_dependants==false && RegisteredEnrollee?.beneficiary_type=='family' &&(
          <div className='w-full flex justify-center'>
           <Button
                 variant="twoTone"
                 type="button"
                 size="sm"
                onClick={()=>{setopen_add_dependants(true)}}
             >
              Add Dependant
             </Button>
           </div>
           )}
        {beneficiary_types?.value == 'family' && open_add_dependants &&(
        <Formik
          initialValues={initialValues.dependents}
          // validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            onCreateDependant(values, setSubmitting, resetForm)
              console.log(`depen data is:`, values)

          }}
        >
          {({ isSubmitting,errors ,touched,values}) => (
          <Form>
          <Card
                              header='Add Dependants'
                              footerBorder={false}
                              headerBorder={false}
                              className='mt-10'>

                                 {/* Personal Info */}
                                 <Card
                                     className='mb-10'
                                      header="Personal Info"
                                      footerBorder={false}
                                      headerBorder={false}>
                                <div className='grid lg:grid-cols-5 md:grid-cols-4 gap-4'>
                                <FormItem label="First Name"
                                asterisk
                                // invalid={errors.dependents?.first_name && touched.dependents?.first_name}
                                // errorMessage={errors.dependents?.first_name}
                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name='first_name'
                                        placeholder="Enter First Name"
                                        component={Input}
                                        // value={inputValue}

                                    />
                                </FormItem>

                                <FormItem label="Last Name"
                                asterisk
                                // invalid={errors.last_name && touched.last_name}
                                // errorMessage={errors.last_name}
                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name="last_name"
                                        placeholder="Enter Last Name"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Middle Name"
                                asterisk
                               >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name="middle_name"
                                        placeholder="Enter Middle Name"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Email"
                                asterisk

                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Enter Email"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Phonenumber"
                                asterisk
>
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="phone_number"
                                        placeholder="Enter phonenumber"
                                        component={Input}
                                    />
                                </FormItem>
                                 </div>

                                 <div className='grid lg:grid-cols-5 md:grid-cols-3 gap-4'>
                                <FormItem label="Passport Photograph"
                                asterisk
>
                                    <Field
                                        type="file"
                                        autoComplete="off"
                                        name="passport_url"
                                        placeholder="Enter passport url"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                            asterisk
                                            label="sex"


                                        >
                                            <Field
                                                name="sex">
                                                {({ field, form }: FieldProps<FormModel>) => (

                                                    <Select
                                                        options={sex}
                                                        placeholder={"Select dependant Sex"}
                                                        value={sex.filter((item) =>
                                                          item.value === values.sex
                                                      )}
                                                        onChange={(option:SingleValue<Select_Type>) => {

                                                          form.setFieldValue(`sex`, option?.value);
                                                        }}
                                                        isSearchable={true}
                                                    />
                                                )}
                                            </Field>
                                 </FormItem>



                                <FormItem label="dob"
                                asterisk
                 >
                                    <Field
                                        type="date"
                                        autoComplete="off"
                                        name="dob"
                                        placeholder="Enter dob"
                                        component={Input}
                                    />
                                </FormItem>


                                </div>
                                <div className='grid lg:grid-cols-4 md:grid-cols-4 gap-4'>
                                <FormItem label="State"
                                asterisk
                               >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name="state"
                                        placeholder="Enter State"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="City"
                                asterisk
                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name="city"
                                        placeholder="Enter City"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem label="Address"
                                asterisk
                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name="address"
                                        placeholder="Enter Address"
                                        component={Input}
                                    />
                                </FormItem>


                                </div>
                                </Card>
                                 {/* Personal Info */}

                                {/* Plan Info */}
                                  <Card
                                  className='mb-10'
                                  header="Plan Info"
                                  footerBorder={false}
                                  headerBorder={false} bordered>
                                  <div className='grid lg:grid-cols-4 md:grid-cols-4 gap-4'>

                                  <FormItem label="Provider"
                                  asterisk>
                                <Field name="Provider">
                                         {({ field, form }: FieldProps<FormModel>) => (

                                           <Select
                                             options={providerlist}
                                             value={selectedProvider}
                                             onChange={(option:SingleValue<Select_Type>) => {

                                               form.setFieldValue(`provider_id`, option?.value);
                                               setselectedProvider(option)
                                             }}

                                             isSearchable={true}
                                             placeholder="Select provider..."
                                           />
                                         )}
                                 </Field>
                                </FormItem>

                                </div>
                                 </Card>
                                {/* Plan Info */}

                                {/* Medical Info */}
                                  <Card
                                  className='mb-10'
                                  header="Medical Info"
                                  footerBorder={false}
                                  headerBorder={false}>
                                  <div className='grid lg:grid-cols-4 md:grid-cols-3 gap-4'>
                                <FormItem label="Blood Group"
                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name={`blood_group`}
                                        placeholder="Enter Blood Group"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Genotype"
                               >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name={`genotype`}
                                        placeholder="Enter Genotype"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Disabilities"
                               >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name={`disabilities`}
                                        placeholder="Enter Disabilities"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Allergies"
                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name={`allergies`}
                                        placeholder="Enter Allergies"
                                        component={Input}
                                    />
                                </FormItem>
                                </div>
                                <div className='grid lg:grid-cols-3 md:grid-cols-3 gap-4'>
                                <FormItem label="Pre Existing Conditions"
                              >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name={`pre_existing_conditions`}
                                        placeholder="Enter Pre Existing Conditions"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Past Surgeries"
                             >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name={`past_surgeries`}
                                        placeholder="Enter Past Surgeries"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem label="Family Medical History"
                                >
                                    <Field
                                        type="txt"
                                        autoComplete="off"
                                        name={`family_medical_history`}
                                        placeholder="Enter Family Medical History"
                                        component={Input}
                                    />
                                </FormItem>
                                </div>
                                  </Card>
                                {/* Medical Info */}
                                <FormItem>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Saving...'
                                            : 'Add dependant '}
                                    </Button>
                                </FormItem>
            </Card>
          </Form>
          )}

        </Formik>
                )}

           <div className='w-full flex justify-center'>
           <Button
                 variant="twoTone"
                 type="button"
                 size="md"
                className='mt-10 '
                onClick={()=>{
                  navigate('/privates/enrollee/view')
                  openNotification('exited enrollee entry form','info')
                  sessionStorage.removeItem('enrollee')

                }}
             >
              finish
             </Button>
           </div>


        </>
    )
}
export default EnrolleeEntryForm
