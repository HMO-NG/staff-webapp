import Select from '@/components/ui/Select'
import { SingleValue } from 'react-select'
import Card from '@/components/ui/Card'
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
import type {PrivateEnrollee} from '@/utils/customAuth/usePrivatesAuth'
import defaultPrivateEnrollee from '@/utils/customAuth/usePrivatesAuth'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, FieldArray } from 'formik'
import type { FieldProps } from 'formik'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import * as Yup from 'yup'
import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import useDouments from '@/utils/customAuth/useDocumentAuth'
import Upload from '@/components/ui/Upload'
import { FcImageFile } from 'react-icons/fc'
import { HiOutlineCloudUpload,HiCheckCircle,HiOutlineUser, } from 'react-icons/hi'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { healthPlan } from '@/utils/customAuth/useHealthPlanAuth'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useProvider from '@/utils/customAuth/useProviderAuth'
import { useLocalStorage } from '@/utils/localStorage'
import Dialog from '@/components/ui/Dialog'
import usePrivateClaims from '@/utils/customAuth/usePrivateClaimAuth'
import DatePicker from '@/components/ui/DatePicker'
import Checkbox from '@/components/ui/Checkbox'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import { useNavigate,useParams } from 'react-router-dom'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import Alert from '@/components/ui/Alert'

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
type Select_Type = {
    label: string
    value: string
}
type Select_Tariff_Type = {
    label: string
    value: string
    item_price: string
    linked_plans:{
    id: string,
    plan_name: string
    }[],
    service_type:'primary'|'secondary'|'tertiary',
    available_to_all_plans:boolean
}
type pa_tariffs={
  id?:string
  quantity?:number
  approved_quantity?:number
  item_name?:string
  item_price?:string
  approved_price?:string
  status?:"pending"
  comment?:string| null;
  total_price?:string
  approved_total?:number
}
type related_doc_type={
  url: string
  filename: string
}
const defaultTariff: pa_tariffs = {
  id: '',
  quantity: 1,
  approved_quantity:0,
  item_name: "",
  item_price: "",
  approved_price: "",
  status: "pending",
  comment: null,
  total_price:"",
  approved_total:0
};


const validationSchema = Yup.object().shape({
    diagnosis: Yup.string().required('Please enter Diagnosis'),
    provider_id: Yup.string().required('Please Select Provider'),
    enrollee_id: Yup.string().required('Please Select enrollee'),
    // pa_code: Yup.string().matches(paCodeRegex, 'Invalid PA code format')
    // .required('PA code is required'),

})

const CreatePrivateClaims = () => {
    const {usegetPrivateProviderAuth,
          usegetSinglePrivateEnrolleeAuth,
    } = usePrivates()
    const {uploadRawFilesTocloudinaryAuth } = useDouments()
    const {
        usegetProviderServiceTariffByIdAuth,
        usegetPreAuthorizationByPACodeAuth,
        usegetSinglePreAuthorizationByIdAuth,
        useUpdatePreAuthorizationByPA_codeAuth,
    } = useProvider()
    const {
       usecreatePrivateClaimAuth,
    } = usePrivateClaims()
    const {useGetPrivateEnrolleeAuth}=usePrivates()
    const { getItem,setItem,removeItem } = useLocalStorage()
    const {pa_id}=useParams();

    const [providerlist, setProviderList] = useState<Select_Type[]>([])
    const [Enroleelist, setEnroleelist] = useState<Select_Type[]>([])
    const [selectedProvider, setselectedProvider] =useState<Select_Type | null>(providerlist[0])

    const [files, setFiles] = useState<File[]>([])
    const [uploadedUrls, setUploadedUrls] = useState<related_doc_type[]>([]);

    const [SelectserviceTariffData, setSelectServiceTariffData] = useState<Select_Tariff_Type[]>([])

    const [InputTariffServices, setInputTariffServices] = useState<pa_tariffs>({})
    const [combindedServices, setCombindedServices] = useState<pa_tariffs[]>([])

    const [EnableTariff, setEnableTariff] = useState<boolean>(true)
    const [EnableTariffButton, setEnableTariffButton] = useState<boolean>(true)
    const [viewReviewDialog, setReviewDialog] = useState(false)
    const [selectedTariffData, setselectedTariffData] = useState<pa_tariffs>(defaultTariff)
    const [selectKey, setSelectKey] = useState(0);
    const [selectKey2, setSelectKey2] = useState(0);
    const [checked,setChecked]=useState<boolean>(false)
    const [enrolleeData, setEnrolleeData] = useState<PrivateEnrollee>()
    const [inputPA_code,setInputPA_code]=useState('')
    const [inputDiagnosis,setInputDiagnosis]=useState('')
    const [inputEncounter_date,setInputEncounter_date]=useState<Date|null>(null)
    const [errorMessage, setErrorMessage] = useTimeOutMessage(5000)

    function openNotification(msg: string,notificationType: 'success' | 'warning' | 'danger' | 'info') {
        toast.push(
            <Notification title={notificationType.toString()} type={notificationType}>
                {msg}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }
    const onselect_provider = async (v: any) => {
        const getservice = await usegetProviderServiceTariffByIdAuth(v)
        if (getservice.data) {
            setSelectServiceTariffData(
                getservice.data.map((data: any) => {
                    return {
                        label: data.item_name,
                        value: data.id,
                        item_price: data.item_price,
                        linked_plans: data.linked_plans.map((plan: any) => ({
                            id: plan.id,
                            plan_name: plan.plan_name,
                        })),
                        service_type: data.service_type,
                        available_to_all_plans:data.available_to_all_plans
                    }
                }),
            )
        }

    }
    async function on_submit_service() {
      const updatedTariff = calculateTotals(InputTariffServices);
      setCombindedServices((prevServiceAmount: pa_tariffs[]) => [...prevServiceAmount, updatedTariff,])
      console.log(updatedTariff)
      setInputTariffServices(defaultTariff)
      setSelectKey(prev => prev + 1);
      setSelectKey2(prev => prev + 1);
   }
    const upload_to_cloudinary= async()=>{
      let all_data: related_doc_type[] = [];

      const uploads = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'hciimage');
      formData.append('cloud_name', 'dtqdaogbn');

      const response2 = await uploadRawFilesTocloudinaryAuth(formData,'dtqdaogbn')

      all_data.push({
        url:response2.data.secure_url,
        filename: response2.data.original_filename,
      })


    });
    await Promise.all(uploads);
    console.log('allluuus',all_data)
    setUploadedUrls(all_data);
    return all_data


    }
    const onCreateClaim=async(values: any,setSubmitting: (isSubmitting: boolean) => void,resetForm: () => void)=>{
        setSubmitting(true)
        let data= values
        const r=await upload_to_cloudinary()
        const totalServiceAmount = combindedServices.reduce((acc, item) => {
          return acc + parseFloat(item.total_price || '0');
        }, 0);

        values.created_by = getItem('user')
        values.selected_tariffs=JSON.stringify(combindedServices, null, 2)
        values.related_documents=JSON.stringify(r, null, 2)
        values.requested_amount=totalServiceAmount
        values.encounter_date=inputEncounter_date

        const response = await usecreatePrivateClaimAuth(values)

        const setToClaimed=await useUpdatePreAuthorizationByPA_codeAuth(values.pa_code,{is_claimed:true})


        if (response) {
          setTimeout(() => {
             if (response.status=="success"){
              openNotification(response.message,'success')
              setSubmitting(false)
              resetForm()
              setCombindedServices([])
              setselectedTariffData({})
              setInputTariffServices({})
              setselectedProvider(null)

             }
             else if (response.status=="failed"){
              openNotification(response.message,"danger")
              setSubmitting(false)
             }
              if (setToClaimed.status === 'failed') {
                openNotification(setToClaimed.message,"danger")
              }
          }, 3000)


      }


   }
   function calculateTotals(items: any) {
    let total_price = '';

        const serviceQuantity = Number(items.quantity) || 0;

        // for nhia service price quantity
        if (items.item_price) {
            const servicePrice = parseFloat(items.item_price) || 0;
            total_price = (servicePrice * serviceQuantity).toFixed(2);

          }

    return {
      ...items,
      total_price,
    };
}
   const removeTariff = (tariffId: string) => {
     setCombindedServices(prev =>
       prev.filter(tariff => tariff.id !== tariffId)
     );
   };
   const editTariff = (tariff_id:string,updatedTariff: pa_tariffs) => {
    setCombindedServices(prev =>
      prev.map(tariff =>
        tariff.id === tariff_id ? { ...tariff, ...updatedTariff } : tariff
      )
    );
  };
   const onCheck = (value: boolean, e: ChangeEvent<HTMLInputElement>) => {
        console.log(value, e)
        setChecked(value)
    }
   function calculateAge(dobString: string): number {
        const dob = new Date(dobString);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();

        const hasHadBirthdayThisYear =
          today.getMonth() > dob.getMonth() ||
          (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

        if (!hasHadBirthdayThisYear) {
          age -= 1;
        }

   return age;
  }
  const profileHeader=(
          <>
          <div className='grid lg:grid-cols-4 md:grid-cols-3 gap-4 '>
            <div className='lg:col-span-1 md:col-span-1'>
               <Avatar size={60} shape="circle" className="mr-4"
                    src={enrolleeData?.passport_url || undefined}
                    icon={!enrolleeData?.passport_url ? <HiOutlineUser /> : undefined} />
            </div>
            <div className='lg:col-span-3 md:col-span-1 '>
               <h5>{enrolleeData?.first_name ||'-'}</h5>
                     {
                          enrolleeData?.is_active ?
                              <Tag className='w-fit bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0'>
                                  Active
                              </Tag> :
                              <Tag className='w-fit text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'>
                                  Inactive
                              </Tag>

                      }
            </div>

          </div>
           </>

  )
  const getEnrollee=async(id:string)=>{
      const enr= await usegetSinglePrivateEnrolleeAuth(id)
      if (enr){
        setEnrolleeData(enr.data)
      }
    }
    const getPAData=async(pa_code:string)=>{
      const isValidPaCode = (pa_code: string): boolean => {
          const pattern = /^PA4LG\/\d{2}\/\d{2}\/\d{2}\/[A-Z]{2}\/[0-9a-fA-F-]{36}$/;
            return pattern.test(pa_code);
           };

      const isValid = isValidPaCode(pa_code)
      if(isValid){
      const pa_data= await usegetPreAuthorizationByPACodeAuth(pa_code)
      if(pa_data){
        if (pa_data.status === 'success') {
                      setTimeout(() => {
                      //set diagnosis data
                      setInputDiagnosis(pa_data.data?.diagnosis || '')
                      // call get enrollee data function with enrollee id gotten from PA
                      getEnrollee(pa_data.data?.enrollee.id || '')
                      // set selected provider and get tariffs under that provider
                      setselectedProvider({label:pa_data.data?.provider.name || '',
                                            value:pa_data.data?.provider.id || ''} )
                      onselect_provider(pa_data.data?.provider.id)
                      setEnableTariff(false)

                      // set all selected tariffs
                      setCombindedServices(pa_data.data?.selected_tariffs || [])
                      openNotification(pa_data.message,'success')
                       }, 3000)
                    }
        else if (pa_data.status === 'failed') {
                      setTimeout(() => {
                      openNotification(pa_data.message,'danger')
                       }, 3000)

                    }

      }
    }
    }
   const validatePlan= (linkedPlans: { id: string; plan_name: string }[],
                           availableToAllPlans: boolean):'has access'|'no access' => {
    const all_plan = linkedPlans.map(t => t.plan_name);
    if (availableToAllPlans === true){
      setEnableTariffButton(false)
      return 'has access';
    }else{
      const isIncluded2 = linkedPlans.some(plan => plan.plan_name === enrolleeData?.plan_name);

      if (isIncluded2) {
          setEnableTariffButton(false)
          return 'has access';
      } else {
          openNotification('This enrollee\'s plan does not cover this service', 'danger')
          setEnableTariffButton(true)
          return 'no access';
      }

    }
   }

    useEffect(() => {
        const fetchData = async () => {
            const response = await usegetPrivateProviderAuth()
            if (response.data) {
                const formattedProviders = response.data.map(
                    (provider: any) => ({
                        label: provider.name,
                        value: provider.id,
                    }),
                )
                setProviderList(formattedProviders)

            }
            const response2 = await useGetPrivateEnrolleeAuth()
            if (response2.data) {
              const formattedEnrolees = response2.data.map(
                  (i: any) => ({
                      label: (`${i.first_name}`+" "+`${i.last_name}`),
                      value: i.id,
                  }),
              )
              setEnroleelist(formattedEnrolees)

          }

        }
        const fetchPADataFromIDParameter = async () => {
          if (pa_id) {
            const response = await usegetSinglePreAuthorizationByIdAuth(pa_id)
            if (response.data) {
                       //set diagnosis data
                      setInputDiagnosis(response.data?.diagnosis || '')
                      // call get enrollee data function with enrollee id gotten from PA
                      getEnrollee(response.data?.enrollee.id || '')
                      // set selected provider and get tariffs under that provider
                      setselectedProvider({label:response.data?.provider.name || '',
                                            value:response.data?.provider.id || ''} )
                      onselect_provider(response.data?.provider.id)
                      setEnableTariff(false)

                      // set PA code
                      setInputPA_code(response.data?.pa_code || '')
                      const encounter= new Date(response.data?.created_at)
                      setInputEncounter_date(encounter)
                      // set all selected tariffs
                      setCombindedServices(response.data?.selected_tariffs || [])



            }
          }
        }

        fetchData()
        fetchPADataFromIDParameter()
    }, [])
    return (
        <>
        <h5 className='mb-5'>Create Claim</h5>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2  p-4">
                    <Formik
                        initialValues={{
                            claim_type:'outpatient',
                            diagnosis: inputDiagnosis,
                            provider_id: selectedProvider?.value,
                            enrollee_id: enrolleeData?.id ,
                            pa_code:inputPA_code,
                            selected_tariffs: [{}],
                            related_documents: [{}],
                            created_by: '',
                            encounter_date:'',
                        }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          onCreateClaim(values, setSubmitting, resetForm)

                            console.log(`enrolee data is:`, values)
                        }}
                    >
                        {({ isSubmitting, errors, touched, values }) => (
                            <Form>
                                <div>
                                    <Card header="Enrollee Details"
                                          headerExtra={<Checkbox onChange={onCheck}>
                                                   Admission
                                               </Checkbox>}
                                    >
                                        <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4">
                                        {/* Provider */}
                                            <FormItem
                                                label="Provider"
                                                asterisk
                                                invalid={
                                                    errors.provider_id &&
                                                    touched.provider_id
                                                }
                                                errorMessage={
                                                    errors.provider_id
                                                }
                                            >
                                                <Field name="provider_id">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps<FormModel>) => (
                                                        <Select
                                                            options={providerlist}
                                                            value={selectedProvider}
                                                            onChange={(option: SingleValue<Select_Type>,) => {
                                                                // Update both Formik and any external state if needed
                                                                form.setFieldValue('provider_id',option?.value,)
                                                                setselectedProvider(option)
                                                                onselect_provider(option?.value,)
                                                                setEnableTariff(false)
                                                                setEnableTariffButton(false)
                                                            }}
                                                            isSearchable={true}
                                                            placeholder="Select provider..."
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        {/* Provider */}
                                        {/* enrollee id */}
                                            <FormItem
                                                asterisk
                                                label="Select enrollee"
                                                invalid={
                                                    errors.enrollee_id &&
                                                    touched.enrollee_id
                                                }
                                                errorMessage={
                                                    errors.enrollee_id
                                                }
                                            >
                                                <Field name="enrollee_id">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps<FormModel>) => (
                                                        <Select
                                                            options={Enroleelist}
                                                            value={Enroleelist?.filter(
                                                              (items) =>
                                                                  items.value === values.enrollee_id
                                                             ) }
                                                            onChange={(option: SingleValue<Select_Type>,) => {
                                                                form.setFieldValue('enrollee_id',option?.value,)
                                                                getEnrollee(option?.value || '')
                                                            }}
                                                            isSearchable={true}
                                                            placeholder="Select Enrollee..."
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        {/* enrollee id */}
                                        {/* pa code */}
                                            <FormItem
                                            label="PA Code"
                                            asterisk
                                            invalid={
                                                errors.pa_code &&
                                                touched.pa_code
                                            }
                                            errorMessage={errors.pa_code}
                                        >
                                            <Field
                                                type="txt"
                                                autoComplete="off"
                                                name="pa_code"
                                                placeholder="Enter PA Code"
                                                component={Input}
                                                value={inputPA_code}
                                                onChange={(e:any)=>{
                                                  setInputPA_code(e.target.value)
                                                  console.log('value',e.target.value)
                                                  getPAData(e.target.value)
                                                }
                                                }
                                            />
                                            </FormItem>
                                        {/* pa code */}
                                        {/* encounter date */}
                                            <FormItem
                                            label="Encounter Date"
                                            asterisk
                                            invalid={
                                                errors.encounter_date &&
                                                touched.encounter_date
                                            }
                                            errorMessage={errors.encounter_date}
                                        >
                                           <Field name="encounter_date">
                                          {({
                                            field,form
                                          }: FieldProps<FormModel>) => (
                                          <DatePicker placeholder="Enter Encounter Date"
                                                       onChange={(value)=>{
                                                        console.log('val',value)
                                                        form.setFieldValue(field.name,value)
                                                        setInputEncounter_date(value)
                                                      }}
                                                      value={inputEncounter_date}
                                           />
                                            )}
                                            </Field>
                                            </FormItem>
                                        {/* encounter date */}
                                        {checked&&<>

                                        {/* admitted_date */}
                                            <FormItem
                                            label="Admitted Date"
                                            asterisk
                                        >

                                            <Field name="admitted_date">
                                          {({
                                            field,form
                                          }: FieldProps<FormModel>) => (
                                          <DatePicker placeholder="Enter Admitted Date"
                                                       onChange={(value)=>{
                                                        form.setFieldValue(field.name,value)
                                                      }}
                                           />
                                            )}
                                            </Field>

                                            </FormItem>
                                        {/* admitted_date */}

                                        {/* discharged_date */}
                                            <FormItem
                                            label="Discharged Date"
                                            asterisk
                                        >

                                           <Field name="discharged_date">
                                          {({
                                            field,form
                                          }: FieldProps<FormModel>) => (
                                          <DatePicker placeholder="Enter Discharged Date"
                                                       onChange={(value)=>{
                                                        form.setFieldValue(field.name,value)
                                                      }}
                                           />
                                            )}
                                            </Field>

                                            </FormItem>
                                        {/* discharged_date */}

                                           </>}
                                        </div>

                                        {/* Diagnosis */}
                                            <FormItem
                                               label="Diagnosis"
                                               asterisk
                                               invalid={
                                                   errors.diagnosis &&
                                                   touched.diagnosis
                                               }
                                              errorMessage={errors.diagnosis}
                                            >
                                            <Field
                                                type="txt"
                                                autoComplete="off"
                                                name="diagnosis"
                                                placeholder="Enter Diagnosis"
                                                component={Input}
                                            />
                                            </FormItem>
                                        {/* Diagnosis */}
                                        <div>
                                            <Upload
                                                className="w-full flex justify-center"
                                                onChange={(file: File[],fileList: File[]) => {
                                                    console.log('ttt', file)
                                                    console.log('ooo', fileList)
                                                    let fileArray

                                                    file? fileArray = Array.from(file):fileArray = Array.from(fileList)
                                                    setFiles(fileArray)

                                                    console.log('rrrr',fileArray)
                                                }}
                                            >
                                                <Button
                                                    variant="twoTone"
                                                    icon={<HiOutlineCloudUpload /> }
                                                    type="button"
                                                >
                                                    Upload your file
                                                </Button>
                                            </Upload>
                                        </div>
                                    </Card>

                                    <Card
                                        header="Add Treatment Items"
                                        className="mt-10"
                                    >
                                        {/* service Tariff */}
                                        <div>
                                            <div className="grid lg:grid-cols-3 md:grid-cols-3 gap-4">
                                                <FormItem
                                                    label="Service"
                                                    asterisk
                                                >
                                                    <Field>
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps<FormModel>) => (
                                                            <Select
                                                               key={selectKey}
                                                                isDisabled={EnableTariff}
                                                                options={SelectserviceTariffData }
                                                                isClearable={true}
                                                                onChange={(option: SingleValue<Select_Tariff_Type>) => {
                                                                    setInputTariffServices({...defaultTariff,
                                                                      id:`${option?.value}`,
                                                                      item_price:`${option?.item_price}`,
                                                                      item_name:`${option?.label}`})
                                                                    validatePlan(option?.linked_plans || [],option?.available_to_all_plans || false)
                                                                }}
                                                                isSearchable={true}
                                                                placeholder="Select provider..."
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                                <FormItem
                                                    label="Quantity"
                                                    asterisk

                                                >
                                                    <Field
                                                        disabled={EnableTariff}
                                                        key={selectKey2}
                                                        type="number"
                                                        autoComplete="off"
                                                        name="quantity"
                                                        placeholder="Enter quantity"
                                                        component={Input}
                                                        onChange={(i:any) => {
                                                          setInputTariffServices({ ...InputTariffServices, quantity: i.target.value })
                                                      }
                                                      }
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    label="Price"
                                                    asterisk
                                                >
                                                    <Field
                                                        disabled={EnableTariff}
                                                        type="number"
                                                        autoComplete="off"
                                                        name="item_price"
                                                        placeholder="Enter quantity"
                                                        component={Input}
                                                        value={
                                                            InputTariffServices?.item_price
                                                        }
                                                    />
                                                </FormItem>
                                            </div>

                                            <Button
                                               disabled={EnableTariffButton}
                                                variant="twoTone"
                                                type="button"
                                                onClick={()=>{
                                                  on_submit_service()
                                                }}
                                            >
                                                Add Service
                                            </Button>
                                        </div>
                                        {/* service Tariff */}

                                    </Card>
                                </div>
                                <FormItem
                                className='w-full flex justify-center mt-10'>
                                  <Button
                                      variant="solid"
                                      type="submit"
                                      loading={isSubmitting}
                                  >
                                      {isSubmitting
                                          ? 'Submitting...'
                                          : 'Submit Claim '}
                                  </Button>
                                </FormItem>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="col-span-1  p-4">
                  {enrolleeData&&<Card
                        header={profileHeader}
                        className=" mb-5"
                     >
                        <div className="grid grid-cols-2 gap-6 rounded-xl">
                             <div className="space-y-2">
                               <p className="font-light text-gray-700">Type: <span className="font-semibold text-gray-900">{enrolleeData?.enrollee_type}</span></p>
                               <p className="font-light text-gray-700">Plan: <span className="font-semibold text-gray-900">{enrolleeData?.plan_name}</span></p>
                                <p className="font-light text-gray-700">Beneficiary Type: <span className="font-semibold text-gray-900">{enrolleeData?.beneficiary_type}</span></p>
                               <p className="font-light text-gray-700">Age: <span className="font-semibold text-gray-900">{calculateAge(enrolleeData?.dob || '')} yrs</span></p>
                             </div>
                             <div className="space-y-2">
                               <p className="font-light text-gray-700">Provider: <span className="font-semibold text-gray-900">{enrolleeData?.provider_name}</span></p>
                               <p className="font-light text-gray-700">Client: <span className="font-semibold text-gray-900">{enrolleeData?.company_name}</span></p>
                               <p className="font-light text-gray-700">Phone number: <span className="font-semibold text-gray-900">{enrolleeData?.phone_number}</span></p>
                               <p className="font-light text-gray-700">Sex: <span className="font-semibold text-gray-900">{enrolleeData?.sex}</span></p>
                             </div>
                        </div>
                   </Card>}
                     {combindedServices.map((items) => {
                           return (
                    <Card
                        header={items?.item_name}
                        className=" mb-5"
                    >
                        <div>
                            <>
                                <div className="space-y-2 mb-4">
                                    {[
                                    { label: "Price", value: `₦${items?.item_price}` },
                                    { label: "Quantity", value: items?.quantity},
                                    { label: "Total", value: `₦${items?.total_price}` },
                                    ].map((item) => (
                                    <div key={item.label} className="flex justify-between w-full">
                                      <p className="font-medium heading-text ">{item.label}:</p>
                                      <p className="text-right">{item.value || "-"}</p>
                                    </div>
                                  ))}
                                 </div>
                                 <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-4'>
                                <Button
                                      variant='twoTone'
                                      size='xs'
                                      className=''
                                      onClick={() => {
                                        setReviewDialog(true)
                                        setselectedTariffData(items)
                                       }}
                                      >
                                     Edit Seleted Tariff
                                  </Button>
                                  <Button
                                      variant='twoTone'
                                      size='xs'
                                      className=''
                                      color="red-600"
                                      onClick={() => {
                                        removeTariff(items.id || '')
                                        console.log('deleted',items.id)
                                       }}
                                      >
                                     Remove Tariff
                                  </Button>
                                  </div>

                            </>


                        </div>
                    </Card>
                      )
                     })}
                </div>
            </div>

            {/* edit selected tariff */}
                           {
                                viewReviewDialog && <Dialog
                                   isOpen={viewReviewDialog}
                                   onClose={() => setReviewDialog(false)}
                                   onRequestClose={() => setReviewDialog(false)}
                                   width={450}
                                   height={190}
                                   style={{
                                    content: {
                                        marginTop: 250,
                                    },
                                   }}
                                   shouldCloseOnOverlayClick={false}
                                   shouldCloseOnEsc={false}
                               >
                                    <div className="">
                                        <h5 className="mb-2">Review</h5>
                                        <div className="overflow-y-auto">
                                            <Formik
                                                initialValues={{
                                                    quantity: selectedTariffData.quantity || 0,
                                                    total_price:''
                                                }}
                                                onSubmit={async (values, { setSubmitting, resetForm }) => {
                                                    console.log('Form values:', values);
                                                    let total_price = '';
                                                    const serviceQuantity = values.quantity
                                                    const servicePrice = Number(selectedTariffData.item_price) || 0;
                                                    total_price = (servicePrice * serviceQuantity).toFixed(2);
                                                    values.total_price=total_price
                                                    editTariff(selectedTariffData.id || '',values)
                                                }}
                                            >
                                                {({ isSubmitting, errors, touched, values }) => (
                                                    <Form>
                                                      <FormContainer>
                                                         <Field
                                                              type="number"
                                                              autoComplete="off"
                                                              name="quantity"
                                                              placeholder="Enter Quantity"
                                                              component={Input}
                                                         />

                                                      </FormContainer>
                                                        <div className="mt-5 'w-full flex justify-center">
                                                            <Button
                                                               type="submit"
                                                               variant="solid"
                                                               size='sm'
                                                               loading={isSubmitting}
                                                               >
                                                            {isSubmitting
                                                                ? 'Saving...'
                                                                : 'Review Tariff'}
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                    </div>
                                </Dialog>
                            }
        </>
    )
}
export default CreatePrivateClaims
