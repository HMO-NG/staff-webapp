import { Field, Form, Formik,FieldArray } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import * as Yup from 'yup'
import { useNavigate ,useLocation} from 'react-router-dom'
import Upload from '@/components/ui/Upload'
import * as XLSX from 'xlsx'
import { HiCheckCircle, HiCloudUpload,HiOutlineUser, HiMinus} from 'react-icons/hi'
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
import { FcImageFile } from 'react-icons/fc'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { healthPlan } from '@/utils/customAuth/useHealthPlanAuth'
import type {PrivateEnrollee} from '@/utils/customAuth/usePrivatesAuth'
import Alert from '@/components/ui/Alert'
import Loading from '@/components/shared/Loading'
import { useQuery } from '@tanstack/react-query'


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

type linked_plan_Type={
    label: string
    value: string
    band_id:string,
    band_name:string,
}

type company_Select_Type={
  label: string
  value: string
  count:number
  number_of_enrollees:number
  linked_plans?:linked_plan_Type[]
}

type provider_Select_Type={
  value: string
  label: string
  linked_bands: { id: string; band_name: string }[]
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

const beneficiary_type_select = [
  { value: "individual", label: "Individual" },
  { value: "family", label: "Family"},
  { value: "both", label: "Both"},
]

const EnrolleeEntryForm = () => {
  const {useGetCompanyAuth,useCreateCompanyAuth,
    usegetPrivateProviderAuth,OnboardIndividualPrivateEnrolleesAuth,
    usegetSinglePrivateEnrolleeAuth,createPrivateEnrolleeDependantsAuth,}=usePrivates()
  const {addDocumentAuth,
         uploadRawFilesTocloudinaryAuth,
         uploadDocumentsAndSaveInDBAuth}=useDouments()
  const { useGetHealthPlanAuth} = useHealthPlan()
  const navigate = useNavigate()

  const { getItem,setItem,removeItem } = useLocalStorage()

  const [beneficiary_types, setBeneficiary_types] = useState<Select_Type | null>(beneficiary_type_select[0])

  const [selectedProvider, setselectedProvider] = useState<Select_Type | null>()
  const [RegisteredEnrollee, setRegisteredEnrollee] = useState<PrivateEnrollee | undefined>()

  const [open_add_dependants, setopen_add_dependants] = useState<boolean>(false)
  const [open_Enrollee_Profile, setopen_Enrollee_Profile] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([]);
  const [passport, setPassport] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false)

  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [fetchClient, setFetchClient] = useState<boolean>(false);
  const [fetchPlan, setFetchPlan] = useState<boolean>(false);

  const [disablePlanSelect,setDisablePlanSelect]=useState(true);
  const [selectedPlan,setSelectedPlan]=useState('');

  const [availablePlans, setAvailablePlans] = useState<linked_plan_Type[]>([])
  const [availableProviders, setAvailableProviders] = useState<provider_Select_Type[]>([])
  const maxUpload = 1


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
              upload_to_cloudinary(passport,response?.data.linked_to_user)

              setItem('enrollee',response?.data)
              sessionStorage.setItem("enrollee", JSON.stringify(response?.data));
              const ern_id = JSON.parse(sessionStorage.getItem('enrollee')|| '""')
              fetchEnrollee(ern_id.enrollee_id)

              if (response) {
                    if (response.status === 'success') {
                      setTimeout(() => {
                      setSubmitting(false)
                      resetForm()
                      setopen_Enrollee_Profile(true)
                      openNotification(response.message,'success')
                       }, 3000)
                    }


                    else if (response.status === 'failed') {
                      setTimeout(() => {
                      openNotification(response.message,'danger')
                      setSubmitting(false)
                       }, 3000)

                    }



              }

          }
          const onCreateDependant = async (values: any,
            setSubmitting: (isSubmitting: boolean) => void,
            resetForm: () => void
        ) => {

            setSubmitting(true)


            const ern_id = getItem('enrollee')
            values.family_size=RegisteredEnrollee?.family_size
            values.enrolled_by = getItem('user')
            let data= values

            const response = await createPrivateEnrolleeDependantsAuth(ern_id.enrollee_id,data)
            console.log(data)
            upload_to_cloudinary(passport,response?.data.linked_to_user)

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


        const upload_to_cloudinary= async(fileData:File[],userId:string)=>{
          let enr_data =getItem('enrollee')
          let user_data = getItem('user')
                const formData = new FormData();
                      formData.append('file', fileData[0]);
                      formData.append('user_type', 'enrollee');
                      //the user id of the enrollee from 'user' table
                      formData.append('user_id', userId|| '');
                      formData.append('created_by', user_data)

          const upload_response= await uploadDocumentsAndSaveInDBAuth(formData)
          if (upload_response.status === 'success'){
                  openNotification(upload_response.message,'success')
                  setIsLoading(false)
                  setFiles([])
                  return true
                }else if (upload_response.status === 'failed'){
                  openNotification(upload_response.message,'danger')
                  setIsLoading(false)
                  return false
                }

        }
        const checkEnrolleeMaxLimit=(comp:any)=>{

            if (!comp) return;

            const maxAllowed = Number(comp.number_of_enrollees);
            const currentCount = Number(comp.count);
            const remaining = maxAllowed - currentCount;

            if (remaining <= 0) {
              openNotification('You have reached the maximum number of enrollees.','warning')
            } else if (remaining === 1) {
              openNotification('Only 1 enrollee slot left.','warning')
            }else if (remaining === 2) {
              openNotification('Only 2 enrollee slot left.','warning')
            }

        }

        const sortProviders=(band_id:string)=>{
            const matchingProviders = providerlist?.filter((provider: any) =>
               provider.linked_bands?.some((band: any) => band.id === band_id)
             );

            console.log(matchingProviders);
            setAvailableProviders(matchingProviders || [])

        }

        const beforeUpload = (files: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        const maxFileSize = 500000

        if (fileList.length >= maxUpload) {
            return `You can only upload ${maxUpload} file(s)`
        }

        if (files) {
            for (const f of files) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }

                if (f.size >= maxFileSize) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }


      const {data:providerlist,isLoading:providerLoading}= useQuery({
          queryKey:['provider'],
          queryFn: ()=>usegetPrivateProviderAuth(),
          enabled: shouldFetch,
          select:(data) => data?.data || [],

        })
      const {data:companieslist,isLoading:companyLoading}= useQuery({
          queryKey:['client'],
          queryFn: ()=>useGetCompanyAuth(),
          enabled: fetchClient,
          select: (data) => data?.data?.map((company:any)=>({
                  value: company.id,
                  label: company.company_name,
                  count: company.count,
                  number_of_enrollees: company.number_of_enrollees,
                   linked_plans:company.linked_plans.map((plan:any)=>({
                             value:plan.id,
                             label:plan.plan_name,
                             band_id:plan.band_id,
                             band_name:plan.band_name,
                   })),
          })) || [],

        })
      const {data:healthPlan,isLoading:healthPlanLoading}= useQuery({
          queryKey:['healthPlan'],
          queryFn: ()=>useGetHealthPlanAuth({ sort: { order: 'asc' } }),
          enabled: fetchPlan,
          select:(data) => data?.data || []
        })

          useEffect(() =>{

            const ern_id = JSON.parse(sessionStorage.getItem('enrollee')|| '""')
            if(ern_id){
             fetchEnrollee(ern_id.enrollee_id)
              setBeneficiary_types({label:ern_id.beneficiary_type,value:ern_id.beneficiary_type})
            }

        // fetchData()


          },[])
      useEffect(() =>{
          if (providerlist && selectedPlan) {
            sortProviders(selectedPlan);
            setselectedProvider(null);
          }

          },[providerlist,selectedPlan])



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
            // family_size: "",
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
                health_plan_id:"",

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


        <div className="flex justify-end pb-5">
          <Button
             variant='solid'
             icon={<HiCloudUpload />}
             onClick={() => {navigate('/privates/enrollee/onboard')}}
             >
             Bulk Upload Enrollees
        </Button>

        </div>



        <Formik
            initialValues={initialValues.enrollee}
            // validationSchema={validationSchema}
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
                                            { label: "Company", value: RegisteredEnrollee?.company_name },
                                            { label: "Provider", value: RegisteredEnrollee?.provider_name },
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
                               {/* UPLOAD DOCUMENTS */}

                                   <Loading loading={isLoading} type="cover">
                                     <Card  className='m-7'>

                                             <Upload draggable
                                               onChange={(file: File[], fileList: File[])=>{
                                                     let fileArray
                                                     file? fileArray = Array.from(file):fileArray = Array.from(fileList)
                                                     setFiles(fileArray);
                                                     console.log(fileArray);
                                                     console.log('tyyye',fileArray[0].type);
                                                   }}>
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
                                                    let enr_data =getItem('enrollee')
                                                    upload_to_cloudinary(files,enr_data.linked_to_user || '')
                                                   }}>Upload</Button>


                                     </Card>
                                   </Loading>

                                {/* UPLOAD DOCUMENTS */}

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
                        <FormItem label="Passport Photograph"
                        asterisk
                        invalid={errors.passport_url && touched.passport_url}
                        errorMessage={errors.passport_url}>
                         <Upload
                            beforeUpload={beforeUpload}
                            uploadLimit={maxUpload}
                            onChange={(file: File[], fileList: File[])=>{
                                       let fileArray
                                       file? fileArray = Array.from(file):fileArray = Array.from(fileList)
                                       setPassport(fileArray);
                                       console.log(fileArray);
                                       console.log('tyyye',fileArray[0].type);
                                     }}
                        >
                        <Button  icon={<HiCloudUpload />}>
                             Upload Passport
                        </Button>
                        </Upload>
                        </FormItem>

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
                      {/* Beneficiary Type */}
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

                                        }}
                                        isSearchable={true}
                                        placeholder="Select Beneficiary Type..."
                                      />
                                    )}
                              </Field>
                        </FormItem>
                      {/* Beneficiary Type */}

                      {/* Client */}
                        <FormItem
                               asterisk
                               label="Select Client"
                               invalid={
                                   errors.company_id && touched.company_id
                               }
                               errorMessage={errors.company_id}>
                              <Field name="company_id">
                                  {({
                                      field,
                                      form,
                                  }: FieldProps<FormModel>) => (
                                      <Select
                                          options={companieslist}
                                          value={companieslist?.filter((item) =>
                                            item.value === values.company_id
                                          )}
                                          onFocus={() => setFetchClient(true)}

                                          onChange={(option:SingleValue<company_Select_Type>) =>{
                                                    form.setFieldValue(field.name,option?.value);
                                                checkEnrolleeMaxLimit({
                                                        label:option?.label || '',
                                                        value:option?.value || '',
                                                        count:option?.count || 0,
                                                        number_of_enrollees:option?.number_of_enrollees || 0
                                                        })
                                                        setAvailablePlans(option?.linked_plans || [])
                                                        setDisablePlanSelect(false)
                                          }}
                                          isSearchable={true}
                                          placeholder="Select Client..."

                                      />
                                  )}
                              </Field>
                        </FormItem>
                      {/* Client */}

                      {/* Health Plan */}
                        <FormItem
                            label="Health Plan"
                            invalid={errors.health_plan_id && touched.health_plan_id}
                            errorMessage={errors.health_plan_id}>

                            <Field
                                name="health_plan_id">
                                {({ field, form }: FieldProps<FormModel>) => (
                                    <Select
                                        options={availablePlans}
                                        placeholder={"Select Health Plan"}
                                        isDisabled={disablePlanSelect}
                                        onFocus={() => {setFetchPlan(true),setShouldFetch(true)} }
                                        value={availablePlans?.filter((item) =>
                                            item.value === values.health_plan_id
                                        )}
                                        onChange={(data) => {
                                            form.setFieldValue(field.name,data?.value)
                                            setSelectedPlan(data?.band_id || '');
                                        }}
                                    />
                                )}
                            </Field>
                        </FormItem>
                      {/* Health Plan */}

                      {/* Provider */}
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
                                     options={availableProviders}
                                     value={selectedProvider}
                                     isClearable={true}
                                    //  onFocus={() => setShouldFetch(true)}
                                     onChange={(option:SingleValue<Select_Type>) => {
                                       // Update both Formik and any external state if needed
                                       form.setFieldValue(field.name, option?.value);
                                       setselectedProvider(option)

                                     }}

                                     isSearchable={true}
                                     placeholder="Select provider..."
                                   />
                                 )}
                         </Field>
                        </FormItem>
                      {/* Provider */}

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
                                      invalid={errors.passport_url && touched.passport_url}
                                      errorMessage={errors.passport_url}>
                                       <Upload
                                          beforeUpload={beforeUpload}
                                          uploadLimit={maxUpload}
                                          onChange={(file: File[], fileList: File[])=>{
                                                     let fileArray
                                                     file? fileArray = Array.from(file):fileArray = Array.from(fileList)
                                                     setPassport(fileArray);
                                                   }}
                                      >
                                      <Button  icon={<HiCloudUpload />}>
                                           Upload Passport
                                      </Button>
                                     </Upload>
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
                                             onFocus={() => setShouldFetch(true)}
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
                                        onFocus={() => setFetchPlan(true)}
                                        value={healthPlan?.filter((item) =>
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
