import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import Upload from '@/components/ui/Upload'
import * as XLSX from 'xlsx'
import { HiCheckCircle, HiCloudUpload } from 'react-icons/hi'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useEnrollee from '@/utils/customAuth/useEnrolleeAuth'
import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import usePrivates from '@/utils/customAuth/usePrivatesAuth'
import type { PrivateCompany } from '@/utils/customAuth/usePrivatesAuth'
import useDouments from '@/utils/customAuth/useDocumentAuth'
import { useLocalStorage } from '@/utils/localStorage'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import Card from '@/components/ui/Card'
import { FcImageFile } from 'react-icons/fc'
import axios from 'axios';
import DatePicker from '@/components/ui/DatePicker'
import Select from '@/components/ui/Select'
import { SingleValue } from 'react-select'
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth'
import { healthPlan,PlanCategory } from '@/utils/customAuth/useHealthPlanAuth'
import Loading from '@/components/shared/Loading'
import DocumentViewer from '@/components/custom/document_viewer'
import Dropdown from '@/components/ui/Dropdown'
import type { SyntheticEvent } from 'react'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

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
const select_payment_type=[
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly'},
  { value: 'quaterly', label: 'Quaterly'},
  { value: 'yearly', label: 'Yearly'},
  { value: 'bi-annually', label: 'Bi-annually'},
  { value: 'capitation', label: 'Capitation'},
]

const validationSchema = Yup.object().shape({
    company_name: Yup.string().required(' company name Required'),
    business_type: Yup.string().required(' business type Required'),
    company_headquarters: Yup.string().required(' company headquaters Required'),
    primary_contact_position: Yup.string().required('  primary contact position Required'),
    primary_contact_email: Yup.string().required(' primary contact email Required'),
    primary_contact_phonenumber: Yup.string().required('primary contact phonenumber Required'),

})

const CompanyInfo = () => {
      const {useGetCompanyAuth,useCreateCompanyAuth,useGetCompanyByIdAuth}=usePrivates()
      const {addDocumentAuth,
             uploadRawFilesTocloudinaryAuth,
             uploadImagesTocloudinaryAuth,
             uploadDocumentsAndSaveInDBAuth}=useDouments()
      const { useGetHealthPlanAuth,useGetHealthPlanCategoryAuth } = useHealthPlan()
      const navigate = useNavigate()
      const { getItem,setItem,removeItem } = useLocalStorage()
      const [companyId, setcompanyId] = useState<{
    companyname:string,
    companyid:string

      }>({
    companyname:'',
    companyid:''
      })
      const [files, setFiles] = useState<File[]>([]);
      const [doc_name, setdoc_name] = useState("")
      const [is_upload_disabled, setis_upload_disabled] = useState<boolean>(true)
      const [registered_company_data, setregistered_company_data] = useState<PrivateCompany | undefined>(undefined)
      const [open_add_doc, setopen_add_doc] = useState<boolean>(false)
      const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
      const [healthPlan, setHealthPlan] = useState<healthPlan[]>([])
      const [successMessage, setSuccessMessage] = useTimeOutMessage()
      const [isLoading, setIsLoading] = useState(false)
      const [previewUrl, setPreviewUrl] = useState('New NHIA tarrif only service.xlsx');
      const [openDoc, setOpenDoc] = useState<boolean>(false)
      const [docData, setDocData] = useState<any>()

      const dd =[{
        "uri":"https://res.cloudinary.com/dtqdaogbn/raw/upload/v1750892175/New%20NHIA%20tarrif%20only%20drug.xlsx",
        "FileType":"xlsx",
        "FileName":"New NHIA tarrif only drug.xlsx"}]

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
       const getclient=async()=>{
                 let client_data1:any =sessionStorage.getItem('client')
                 let client_data2=JSON.parse(client_data1)
                 if(client_data2){
                   const response=await useGetCompanyByIdAuth(client_data2.id)
                   if (response.status === 'success' && response.data) {
                       setregistered_company_data(response.data)
                   }else if (response.status === 'failed') {
                       openNotification(response.message, 'danger')
                   }
                 }
           }
      const handle_doc_name_change =(e:React.ChangeEvent<HTMLInputElement>)=>{
            console.log('nameee',e.target.value)
            setdoc_name(e.target.value);
            if(doc_name.length >= 1){
                setis_upload_disabled(false)
            }
      }

      const upload_to_cloudinary= async()=>{
                setIsLoading(true)
                let user_data = getItem('user')
                const formData = new FormData();
                      formData.append('file', files[0]);
                      formData.append('user_type', 'client');
                      formData.append('user_id', registered_company_data?.profile_id || '');
                      formData.append('created_by', user_data)

                const upload_response= await uploadDocumentsAndSaveInDBAuth(formData)

                if (upload_response.status === 'success'){
                  openNotification(upload_response.message,'success')
                  setopen_add_doc(false)
                  setIsLoading(false)
                  getclient()
                  setFiles([])
                }else if (upload_response.status === 'failed'){
                  openNotification(upload_response.message,'danger')
                  setIsLoading(false)
                }
        }

      const onCreateCompany = async (values: any,
              setSubmitting: (isSubmitting: boolean) => void,
              resetForm: () => void
            ) => {

              setSubmitting(true)
              const { getItem } = useLocalStorage()
              values.user_id = getItem("user")

              const data = await useCreateCompanyAuth(values)

              if (data) {
                  setTimeout(() => {
                      setSuccessMessage(data.message)
                      setSubmitting(false)

                  }, 3000)
                  if (data.status=='success'){
                      openNotification(data.message,'success')
                      sessionStorage.setItem("client", JSON.stringify(data?.data.id));
                      setregistered_company_data(data?.data)
                      resetForm()
                  }
                  else if (data.status=='failed'){
                          openNotification(data.message,'danger')
                  }



              }

          }
      const onDropdownItemClick = (eventKey: any, e: SyntheticEvent) => {
        console.log('Dropdown Item Clicked', eventKey, e)
        setOpenDoc(true)
        setDocData(JSON.parse(eventKey))

      }

      useEffect(()=>{


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
          getclient()
      },[])
    return (
      <>

        <Formik
            initialValues={{
              company_name: "",
              business_type: "",
              company_headquarters: "",
              primary_contact_position: "",
              primary_contact_email: "",
              primary_contact_phonenumber: "",

              number_of_enrollees: "",
              payment_start_date: "",
              payment_end_date: "",
              payment_type: "",
              health_plan_id: "",

               }}
               validationSchema={validationSchema}
               onSubmit={(values, { setSubmitting, resetForm }) => {
                       onCreateCompany(values, setSubmitting, resetForm)
                       console.log(`Company data is:`, values)

               }}
               >
              {({ isSubmitting,errors ,touched,values}) => (
                  <Form>
                      {registered_company_data ?(
                          <Card
                              className='m-7'
                              header="Registered Client Details"
                          >
                                 <div>
                                   <div>
                                       <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                                       <div className="space-y-2">
                                        {[
                                        { label: "Company Name", value: registered_company_data?.company_name},
                                        { label: "Business Type", value: registered_company_data?.business_type},
                                        { label: "Company Headquarters", value: registered_company_data?.company_headquarters },

                                        ].map((item) => (
                                        <div key={item.label} className="flex items-center">
                                          <p className="font-light text-gray-700 min-w-[150px]">{item.label}:</p>
                                          <p className="font-semibold text-gray-900 flex-1 truncate">{item.value || "-"}</p>
                                        </div>
                                      ))}
                                     </div>
                                    <div className="space-y-2">
                                        {[
                                        { label: "Primary Contact Position", value: registered_company_data?.primary_contact_position },
                                        { label: "Primary Contact Email", value: registered_company_data?.primary_contact_email },
                                        { label: "Primary Contact Phone Number", value: registered_company_data?.primary_contact_phonenumber},

                                        ].map((item) => (
                                        <div key={item.label} className="flex items-center">
                                          <p className="font-light text-gray-700 min-w-[150px]">{item.label}:</p>
                                          <p className="font-semibold text-gray-900 flex-1 truncate">{item.value || "-"}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="space-y-2">
                                       <Dropdown title="Documents" >
                                           {registered_company_data?.documents?.map((item) => (
                                               <Dropdown.Item
                                                   key={item.id}
                                                   eventKey={JSON.stringify([{
                                                                uri: item.url,
                                                                FileType: item.doc_type,
                                                                FileName: item.name
                                                              }])
                                                            }
                                                   onSelect={onDropdownItemClick}
                                               >
                                                   {item.name}
                                               </Dropdown.Item>
                                           ))}
                                        </Dropdown>
                                     </div>



                                   </div>




                                   </div>
                               </div>
                          </Card>):
                          <FormContainer>
                               <h4 className='mb-4'>Create Company</h4>
                                <FormItem label="Company Name"
                                          invalid={errors.company_name && touched.company_name}
                                          errorMessage={errors.company_name}>
                                          <Field
                                              type="txt"
                                              autoComplete="off"
                                              name="company_name"
                                              placeholder="Enter company name"
                                              component={Input}
                                          />
                                </FormItem>

                                <FormItem label="Business Type"
                                          invalid={errors.business_type && touched.business_type}
                                          errorMessage={errors.business_type}>
                                         <Field
                                             type="txt"
                                             autoComplete="off"
                                             name="business_type"
                                             placeholder="Enter business type"
                                             component={Input}
                                          />
                                </FormItem>

                                <FormItem label="Company Headquaters"
                                          invalid={errors.company_headquarters && touched.company_headquarters}
                                          errorMessage={errors.company_headquarters}>
                                          <Field
                                              type="txt"
                                              autoComplete="off"
                                              name="company_headquarters"
                                              placeholder="Enter Company Address"
                                              component={Input}
                                           />
                                </FormItem>

                                <FormItem label="Primary Contact Position"
                                          invalid={errors.primary_contact_position && touched.primary_contact_position}
                                          errorMessage={errors.primary_contact_position}>
                                          <Field
                                             type="txt"
                                             autoComplete="off"
                                             name="primary_contact_position"
                                             placeholder="Enter primary contact position"
                                             component={Input}
                                           />
                                </FormItem>

                                <FormItem label="Primary Contact Email"
                                          invalid={errors.primary_contact_email && touched.primary_contact_email}
                                          errorMessage={errors.primary_contact_email}>
                                          <Field
                                             type="email"
                                             autoComplete="off"
                                             name="primary_contact_email"
                                             placeholder="Enter Primary Contact Email"
                                             component={Input}
                                           />
                                </FormItem>
                                <FormItem label="Primary Contact Phonenumber"
                                          invalid={errors.primary_contact_phonenumber && touched.primary_contact_phonenumber}
                                          errorMessage={errors.primary_contact_phonenumber}>
                                          <Field
                                             type="number"
                                             autoComplete="off"
                                             name="primary_contact_phonenumber"
                                             placeholder="Enter primary contact phonenumber"
                                             component={Input}
                                           />
                                </FormItem>

                                <FormItem label="Number Of Enrollees"
                                          invalid={errors.number_of_enrollees && touched.number_of_enrollees}
                                          errorMessage={errors.number_of_enrollees}>
                                          <Field
                                             type="number"
                                             autoComplete="off"
                                             name="number_of_enrollees"
                                             placeholder="Enter Number Of Enrollees"
                                             component={Input}
                                          />
                                </FormItem>

                                <FormItem label="Payment Start Date"
                                          invalid={errors.payment_start_date && touched.payment_start_date}
                                          errorMessage={errors.payment_start_date}>
                                         <Field name="payment_start_date">
                                               {({
                                                 field,form
                                               }: FieldProps<FormModel>) => (
                                               <DatePicker placeholder="Enter Encounter Date"
                                                            onChange={(value)=>{
                                                             form.setFieldValue(field.name,value)
                                                           }}
                                                />
                                   )}
                                         </Field>
                                </FormItem>

                                <FormItem label="Payment End Date"
                                          invalid={errors.payment_end_date && touched.payment_end_date}
                                          errorMessage={errors.payment_end_date}>
                                            <Field name="payment_end_date">
                                                    {({
                                                      field,form
                                                    }: FieldProps<FormModel>) => (
                                                      <DatePicker placeholder="Enter Payment End Date"
                                                                   onChange={(value)=>{
                                                                    form.setFieldValue(field.name,value)
                                                                  }}
                                                         />
                                                      )}
                                            </Field>
                                </FormItem>

                                <FormItem label="Payment Type"
                                          invalid={errors.payment_type && touched.payment_type}
                                          errorMessage={errors.payment_type}>

                                          <Field name="payment_type">
                                            {({
                                               field,
                                               form,
                                            }: FieldProps<FormModel>) => (
                                               <Select
                                                   options={select_payment_type}
                                                   onChange={(option: SingleValue<Select_Type>,) => {
                                                       // Update both Formik and any external state if needed
                                                       form.setFieldValue(field.name,option?.value,)

                                                   }}
                                                   isSearchable={true}
                                                   placeholder="Select Payment Type..."
                                               />
                                            )}
                                        </Field>
                                </FormItem>

                                <FormItem label="Health Plan"
                                          invalid={errors.health_plan_id && touched.health_plan_id}
                                          errorMessage={errors.health_plan_id}>
                                          <Field name="health_plan_id">
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
                                </FormItem>

                                <FormItem>
                                     <Button
                                         variant="solid"
                                         type="submit"
                                         loading={isSubmitting}
                                     >
                                         {isSubmitting
                                             ? 'Saving...'
                                             : 'Add company '}
                                     </Button>
                                </FormItem>
                          </FormContainer>

                      }
            {/* UPLOAD DOCUMENTS */}
              {open_add_doc &&(
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
                                 upload_to_cloudinary()
                                }}>Upload</Button>


                  </Card>
                   </Loading>
                  )}
            {/* UPLOAD DOCUMENTS */}
                </Form>
            )}
        </Formik>
        {openDoc && (
           <DocViewer documents={docData} pluginRenderers={DocViewerRenderers} style={{ width: '100%', height: 700 }} />
        )}

        {registered_company_data &&(<>
        <div className='w-full flex justify-center'>
                   <Button
                         variant="twoTone"
                         type="button"
                         size="md"
                         className='mt-10 '
                        //  disabled={setopen_add_doc}
                         onClick={()=>{
                          setopen_add_doc(true)
                         }}
                    >
                      Add Documents
                    </Button>
        </div>
        <div className='w-full flex justify-center'>
                   <Button
                         variant="solid"
                         type="button"
                         size="md"
                         className='mt-10 '
                         onClick={()=>{
                            navigate('/privates/enrollee/view')
                            openNotification('exited create client form','info')
                            sessionStorage.removeItem('client')

                         }}
                     >
                      finish
                    </Button>
        </div></>
      )}



        </>
    )
}
export default CompanyInfo
