import Select from '@/components/ui/Select'
import { SingleValue } from 'react-select'
import Card from '@/components/ui/Card'
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
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
import { HiOutlineCloudUpload } from 'react-icons/hi'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { healthPlan } from '@/utils/customAuth/useHealthPlanAuth'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useProvider from '@/utils/customAuth/useProviderAuth'
import { useLocalStorage } from '@/utils/localStorage'
import Dialog from '@/components/ui/Dialog'
import usePrivateClaims from '@/utils/customAuth/usePrivateClaimAuth'
import DatePicker from '@/components/ui/DatePicker'

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
type Select_Type2 = {
    label: string
    value: string
    item_price: string
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
    pa_code: Yup.string().required('Please enter PA Code'),

})

const CreatePrivateClaims = () => {
    const {usegetPrivateProviderAuth,} = usePrivates()
    const {uploadRawFilesTocloudinaryAuth } = useDouments()
    const {
        usegetProviderServiceTariffByIdAuth,
    } = useProvider()
    const {
       usecreatePrivateClaimAuth,
    } = usePrivateClaims()
    const {useGetPrivateEnrolleeAuth}=usePrivates()
    const { getItem,setItem,removeItem } = useLocalStorage()

    const [providerlist, setProviderList] = useState<Select_Type[]>([])
    const [Enroleelist, setEnroleelist] = useState<Select_Type[]>([])
    const [selectedProvider, setselectedProvider] =useState<Select_Type | null>(providerlist[0])

    const [files, setFiles] = useState<File[]>([])
    const [uploadedUrls, setUploadedUrls] = useState<related_doc_type[]>([]);

    const [SelectserviceTariffData, setSelectServiceTariffData] = useState<Select_Type2[]>([])

    const [InputTariffServices, setInputTariffServices] = useState<pa_tariffs>({})
    const [combindedServices, setCombindedServices] = useState<pa_tariffs[]>([])

    const [EnableTariff, setEnableTariff] = useState<boolean>(true)
    const [viewReviewDialog, setReviewDialog] = useState(false)
    const [selectedTariffData, setselectedTariffData] = useState<pa_tariffs>(defaultTariff)
    const [selectKey, setSelectKey] = useState(0);
    const [selectKey2, setSelectKey2] = useState(0);

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

        const response = await usecreatePrivateClaimAuth(values)

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
          }, 3000)


      }


   }
   function calculateTotals(items: any) {
    let total_price = '';

        const serviceQuantity = Number(items.quantity) || 0;

        // for nhia service price quantity
        if (items.item_price) {
            const servicePrice = parseFloat(items.item_price) || 0;
            // total_price = servicePrice * serviceQuantity;
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

        fetchData()
    }, [])
    return (
        <>
        <h5 className='mb-5'>Create Claim</h5>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2  p-4">
                    <Formik
                        initialValues={{
                            claim_type:'outpatient',
                            diagnosis: '',
                            provider_id: '',
                            enrollee_id: '',
                            pa_code:'',
                            selected_tariffs: [{}],
                            related_documents: [{}],
                            requested_total_price:'',
                            created_by: '',
                            encounter_date:'',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          onCreateClaim(values, setSubmitting, resetForm)

                            console.log(`enrolee data is:`, values)
                        }}
                    >
                        {({ isSubmitting, errors, touched, values }) => (
                            <Form>
                                <div>
                                    <Card header="Enrollee Details">
                                        <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4">
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
                                                            }}
                                                            isSearchable={true}
                                                            placeholder="Select provider..."
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
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
                                                            }}
                                                            isSearchable={true}
                                                            placeholder="Select Enrollee..."
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
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
                                                //  onChange={handle_doc_name_change}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Encounter Date"
                                            asterisk
                                            // invalid={
                                            //     errors.diagnosis &&
                                            //     touched.diagnosis
                                            // }
                                            // errorMessage={errors.diagnosis}
                                        >
                                           {/* <Field name="encounter_date">
                                          {({
                                            field,form
                                          }: FieldProps<FormModel>) => (
                                          <DatePicker placeholder="Enter Encounter Date"
                                                       onChange={(value)=>{
                                                        console.log('val',value)
                                                        form.setFieldValue(field.name,value)
                                                      }}
                                           />
                                            )}
                                            </Field> */}
                                            <Field
                                               type="date"
                                               autoComplete="off"
                                               name="encounter_date"
                                               placeholder="Enter Encounter Date"
                                               component={Input}
                                               //  onChange={handle_doc_name_change}
                                           />

                                        </FormItem>
                                        </div>

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
                                                //  onChange={handle_doc_name_change}
                                            />
                                        </FormItem>
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
                                                                //  value={selectedProvider}
                                                                isClearable={true}
                                                                onChange={(option: SingleValue<Select_Type2>) => {
                                                                    setInputTariffServices({...defaultTariff,
                                                                      id:`${option?.value}`,
                                                                      item_price:`${option?.item_price}`,
                                                                      item_name:`${option?.label}`})
                                                                      console.log(option)
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
                                                    // invalid={
                                                    //     errors.diagnosis &&
                                                    //     touched.diagnosis
                                                    // }
                                                    // errorMessage={
                                                    //     errors.diagnosis
                                                    // }
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
                                                            //SelectedTariffservice?.item_price
                                                            InputTariffServices?.item_price
                                                        }
                                                    />
                                                </FormItem>
                                            </div>

                                            <Button
                                               disabled={EnableTariff}
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
                                                    // item_price: selectedTariffData.approved_price || '',
                                                    quantity: selectedTariffData.quantity || 0,
                                                    total_price:''
                                                }}
                                                onSubmit={async (values, { setSubmitting, resetForm }) => {
                                                    console.log('Form values:', values);
                                                    let total_price = '';
                                                    const serviceQuantity = values.quantity
                                                    // const servicePrice = parseFloat(selectedTariffData.item_price) || 0;
                                                    const servicePrice = Number(selectedTariffData.item_price) || 0;
                                                    total_price = (servicePrice * serviceQuantity).toFixed(2);
                                                    values.total_price=total_price
                                                    // setReviewDialog(false)
                                                    editTariff(selectedTariffData.id || '',values)
                                                }}
                                            >
                                                {({ isSubmitting, errors, touched, values }) => (
                                                    <Form>
                                                      <FormContainer>
                                                        {/* <div className='grid grid-cols-2 gap-4 mb-5'> */}
                                                         <Field
                                                              type="number"
                                                              autoComplete="off"
                                                              name="quantity"
                                                              placeholder="Enter Quantity"
                                                              component={Input}
                                                         />
                                                         {/* </div> */}

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
