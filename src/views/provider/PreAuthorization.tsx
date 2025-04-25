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
import type {
    ProviderServiceTariffType,
    ProviderDrugTariffType,
} from '@/utils/customAuth/useProviderAuth'
import { useLocalStorage } from '@/utils/localStorage'

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
  item_name?:string
  item_price?:string
  status?:"pending"
  comment?:string| null;
}
type related_doc_type={
  url: string
  filename: string
}
const defaultTariff: pa_tariffs = {
  id: '',
  quantity: 1,
  item_name: "",
  item_price: "",
  status: "pending",
  comment: null,
};

const validationSchema = Yup.object().shape({
    diagnosis: Yup.string().required('Please enter Diagnosis'),
    provider_id: Yup.string().required('Please Select Provider'),
    enrollee_id: Yup.string().required('Please Select enrollee'),

})

const EnrolleeEntryForm = () => {
    const {
        usegetPrivateProviderAuth,
        OnboardIndividualPrivateEnrolleesAuth,
        usegetSinglePrivateEnrolleeAuth,
    } = usePrivates()
    const { addDocumentAuth, uploadRawFilesTocloudinaryAuth } = useDouments()
    const { useGetHealthPlanAuth } = useHealthPlan()
    const {
        usegetProviderServiceTariffByIdAuth,
        usegetProviderDrugTariffByIdAuth,
        useCreatePreAuthorizationAuth,
    } = useProvider()
    const {useGetPrivateEnrolleeAuth}=usePrivates()
    const { getItem,setItem,removeItem } = useLocalStorage()

    const [providerlist, setProviderList] = useState<Select_Type[]>([])
    const [Enroleelist, setEnroleelist] = useState<Select_Type[]>([])
    const [selectedProvider, setselectedProvider] =useState<Select_Type | null>(providerlist[0])

    const [files, setFiles] = useState<File[]>([])
    const [uploadedUrls, setUploadedUrls] = useState<related_doc_type[]>([]);

    const [SelectserviceTariffData, setSelectServiceTariffData] = useState<Select_Type2[]>([])
    const [SelectDrugTariffData, setSelectsetDrugTariffData] = useState<Select_Type2[]>([])

    const [InputTariffServices, setInputTariffServices] = useState<pa_tariffs>({})
    const [InputTariffDrug, setInputTariffDrug] = useState<pa_tariffs>({})
    const [combindedServices, setCombindedServices] = useState<pa_tariffs[]>([])
    const [combindedDrugs, setCombindedDrugs] = useState<pa_tariffs[]>([])

    const [EnableTariff, setEnableTariff] = useState<boolean>(true)

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
        // const getservice=await usegetProviderServiceTariffByIdAuth(`${selectedProvider?.value}`)
        // const getdrug=await usegetProviderDrugTariffByIdAuth(`${selectedProvider?.value}`)
        const getservice = await usegetProviderServiceTariffByIdAuth(v)
        const getdrug = await usegetProviderDrugTariffByIdAuth(v)
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
            // setServiceTariffData(getservice?.data)
        }
        if (getdrug.data) {
            setSelectsetDrugTariffData(
                getdrug.data.map((data: any) => {
                    return {
                        label: data.item_name,
                        value: data.id,
                        item_price: data.item_price,
                    }
                }),
            )
        }
    }
    function on_submit_service() {
      setCombindedServices((prevServiceAmount: pa_tariffs[]) => [...prevServiceAmount, InputTariffServices,])
      console.log(InputTariffServices)
   }
    function on_submit_drug() {
    setCombindedDrugs((prevServiceAmount) => [...prevServiceAmount, InputTariffDrug,])
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
    const onCreatePA=async(values: any,setSubmitting: (isSubmitting: boolean) => void,resetForm: () => void)=>{
        setSubmitting(true)
        let data= values
        const r=await upload_to_cloudinary()

        values.created_by = getItem('user')
        values.service_tariffs=JSON.stringify(combindedServices, null, 2)
        values.drug_tariffs=JSON.stringify(combindedDrugs, null, 2)
        values.related_documents=JSON.stringify(r, null, 2)

        const response = await useCreatePreAuthorizationAuth(values)

        if (response) {
          setTimeout(() => {
             if (response.status=="success"){
              openNotification(response.message,'success')
              setSubmitting(false)
              resetForm()
             }
             else if (response.status=="failed"){
              openNotification(response.message,"danger")
              setSubmitting(false)
             }
          }, 3000)


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

        fetchData()
    }, [])
    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2  p-4">
                    <Formik
                        initialValues={{
                            diagnosis: '',
                            provider_id: '',
                            enrollee_id: '',
                            drug_tariffs: [{}],
                            service_tariffs: [{}],
                            related_documents: [{}],
                            created_by: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                          onCreatePA(values, setSubmitting, resetForm)

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
                                                                isDisabled={EnableTariff}
                                                                options={SelectserviceTariffData }
                                                                //  value={selectedProvider}
                                                                isClearable={true}
                                                                onChange={(option: SingleValue<Select_Type2>) => {
                                                                    setInputTariffServices({...defaultTariff,
                                                                      id:`${option?.value}`,
                                                                      item_price:`${option?.item_price}`,
                                                                      item_name:`${option?.label}`})
                                                                    // setInputTariffServices({'id':`${option?.value}`,'item_price':`${option?.item_price}`,'item_name':`${option?.label}`,'status':'pending','comment':''})
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
                                                    invalid={
                                                        errors.diagnosis &&
                                                        touched.diagnosis
                                                    }
                                                    errorMessage={
                                                        errors.diagnosis
                                                    }
                                                >
                                                    <Field
                                                        disabled={EnableTariff}
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
                                                        name="quantity"
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
                                                onClick={on_submit_service}
                                            >
                                                Add Service
                                            </Button>
                                        </div>
                                        {/* service Tariff */}

                                        {/* Drug Tariff */}
                                        <div className="mt-10">
                                            <div className="grid lg:grid-cols-3 md:grid-cols-3 gap-4">
                                                <FormItem
                                                    label="Drug"
                                                    asterisk
                                                    invalid={
                                                        errors.provider_id &&
                                                        touched.provider_id
                                                    }
                                                    errorMessage={
                                                        errors.provider_id
                                                    }
                                                >
                                                    <Field>
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps<FormModel>) => (
                                                            <Select
                                                                isDisabled={EnableTariff }
                                                                options={SelectDrugTariffData }
                                                                isClearable={true}
                                                                onChange={(
                                                                    option: SingleValue<Select_Type2>) => {
                                                                      setInputTariffDrug({...defaultTariff,
                                                                        id:`${option?.value}`,
                                                                        item_price:`${option?.item_price}`,
                                                                        item_name:`${option?.label}`})
                                                                    console.log(option)
                                                                }}
                                                                isSearchable={true}
                                                                placeholder="Select Drug Tariff..."
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
                                                        type="number"
                                                        autoComplete="off"
                                                        name="quantity"
                                                        placeholder="Enter quantity"
                                                        component={Input}
                                                        onChange={(i:any) => {
                                                          setInputTariffDrug({ ...InputTariffDrug, quantity: i.target.value })
                                                      }
                                                      }
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    label="Price"
                                                    asterisk
                                                    invalid={
                                                        errors.diagnosis &&
                                                        touched.diagnosis
                                                    }
                                                    errorMessage={
                                                        errors.diagnosis
                                                    }
                                                >
                                                    <Field
                                                        disabled={EnableTariff}
                                                        type="number"
                                                        autoComplete="off"
                                                        name="quantity"
                                                        placeholder="Enter quantity"
                                                        component={Input}
                                                        value={
                                                          InputTariffDrug?.item_price
                                                      }
                                                    />
                                                </FormItem>
                                            </div>

                                            <Button
                                                disabled={EnableTariff}
                                                variant="twoTone"
                                                type="button"
                                                onClick={on_submit_drug}
                                            >
                                                Add Drug
                                            </Button>
                                        </div>
                                        {/* Drug Tariff */}
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
                                          ? 'Saving...'
                                          : 'Create PA '}
                                  </Button>
                                </FormItem>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="col-span-1  p-4">
                    <Card
                        header="Drugs & Services"
                        // className='w-1/3'
                        className="col-span-2 p-4"
                    >
                        <div
                        //  className='w-full'
                        >
                            {combindedServices.map((items) => {
                                return (
                                    <>
                                        {items?.item_name && (<p>Name:<b>{items?.item_name}</b></p>)}
                                        {items?.item_price && (<p>Price:<b>{items?.item_price}</b></p>)}
                                        {items?.quantity && (<p>Quantity:<b>{items?.quantity}</b></p>)}

                                    </>
                                )
                            })}
                              {combindedDrugs.map((items) => {
                                return (
                                    <>
                                        {items?.item_name && (<p>Name:<b>{items?.item_name}</b></p>)}
                                        {items?.item_price && (<p>Price:<b>{items?.item_price}</b></p>)}
                                        {items?.quantity && (<p>Quantity:<b>{items?.quantity}</b></p>)}

                                    </>
                                )
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}
export default EnrolleeEntryForm
