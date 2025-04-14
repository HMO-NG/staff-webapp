import { Field, Form, Formik } from 'formik'
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
import useDouments from '@/utils/customAuth/useDocumentAuth'
import { useLocalStorage } from '@/utils/localStorage'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import Card from '@/components/ui/Card'
import { FcImageFile } from 'react-icons/fc'
import axios from 'axios';

type PrivateCompany={
  id: string
  company_name: string
  business_type: string
  company_heaadquaters: string
  primary_contact_position: string
  primary_contact_email: string
  primary_contact_phonenumber:string
  user_id:string
  enrolled_by:string
}
const validationSchema = Yup.object().shape({
    company_name: Yup.string().required(' company_name Required'),
    business_type: Yup.string().required(' business_type Required'),
    company_heaadquaters: Yup.string().required(' company_heaadquater Required'),
    primary_contact_position: Yup.string().required('  primary_contact_position Required'),
    primary_contact_email: Yup.string().required(' primary_contact_email Required'),
    primary_contact_phonenumber: Yup.string().required('primary_contact_phonenumber Required'),

})

const CompanyInfo = () => {
  const {useGetCompanyAuth,useCreateCompanyAuth}=usePrivates()
  const {addDocumentAuth}=useDouments()
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
                formData.append('resource_type', 'raw')

                const response2 = await axios.post(
                  `https://api.cloudinary.com/v1_1/dtqdaogbn/raw/upload`,
                  formData
                );
                let client_data1:any =sessionStorage.getItem('client')
                let client_data2=JSON.parse(client_data1)
                let user_data = getItem('user')
                let data={
                  name:doc_name,
                  url:response2.data.secure_url,
                  user_type:'client',
                  linked_to_user:client_data2.profile_id,
                  created_by:user_data
                }
                if(response2.status==200){
               const result = await addDocumentAuth(data)
                }
              }
      const [successMessage, setSuccessMessage] = useTimeOutMessage()
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
                      resetForm()
                  }, 3000)
                  // navigate('/privates/viewclients')
                  openNotification(data.message,'success')
                  sessionStorage.setItem("client", JSON.stringify(data?.data));

              }

          }
          useEffect(()=>{
           const getclient=()=>{
            let client_data1:any =sessionStorage.getItem('client')
            let client_data2=JSON.parse(client_data1)
            if(client_data2){
            setregistered_company_data(client_data2)}
           }
           getclient()
          },[])
    return (
      <>

        <Formik
            initialValues={{
              company_name: "",
              business_type: "",
              company_heaadquaters: "",
              primary_contact_position: "",
              primary_contact_email: "",
              primary_contact_phonenumber: "",

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
                                 header="Registered Enrollee Details">
                                 <div>


                                   <div>
                                       {/* className=' flex grid-cols-{1}' */}
                                       {/* <p>first_name: {registered_company_data?.first_name}</p> */}
                                       <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                        {[
                                        { label: "company_name", value: registered_company_data?.company_name},
                                        { label: "business_type", value: registered_company_data?.business_type},
                                        { label: "company_heaadquaters", value: registered_company_data?.company_heaadquaters },

                                        ].map((item) => (
                                        <div key={item.label} className="flex items-center">
                                          <p className="font-medium heading-text min-w-[150px]">{item.label}:</p>
                                          <p className="flex-1 truncate">{item.value || "-"}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                        { label: "primary_contact_position", value: registered_company_data?.primary_contact_position },
                                        { label: "primary_contact_email", value: registered_company_data?.primary_contact_email },
                                        { label: "primary_contact_phonenumbe", value: registered_company_data?.primary_contact_phonenumber},

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
                           </Card>):
                    <FormContainer>
                      <h4>Create Company</h4>
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

                        <FormItem label="Company Heaadquaters"
                        invalid={errors.company_heaadquaters && touched.company_heaadquaters}
                        errorMessage={errors.company_heaadquaters}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="company_heaadquaters"
                                placeholder="Enter company heaadquaters"
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
                                type="txt"
                                autoComplete="off"
                                name="primary_contact_email"
                                placeholder="Enter primary_contact_email"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="Primary Contact Phonenumber"
                        invalid={errors.primary_contact_phonenumber && touched.primary_contact_phonenumber}
                        errorMessage={errors.primary_contact_phonenumber}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="primary_contact_phonenumber"
                                placeholder="Enter primary contact phonenumber"
                                component={Input}
                            />
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
              {open_add_doc &&(
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
                                 setis_upload_disabled(true)
                                 setopen_add_doc(false)
                                }}>Upload</Button>
                  </Card>)}
                </Form>
            )}
        </Formik>
        <div className='w-full flex justify-center'>
                   <Button
                         variant="twoTone"
                         type="button"
                         size="md"
                        className='mt-10 '
                        onClick={()=>{
                          // openNotification('exited enrollee entry form','info')
                          setopen_add_doc(true)

                        }}
                     >
                      Add Documents
                     </Button>
                   </div>
                   <div className='w-full flex justify-center'>
                   <Button
                         variant="twoTone"
                         type="button"
                         size="md"
                        className='mt-10 '
                        onClick={()=>{
                          navigate('/privates/enrollee/view')
                          openNotification('exited enrollee entry form','info')
                          sessionStorage.removeItem('client')

                        }}
                     >
                      finish
                     </Button>
                   </div>



        </>
    )
}
export default CompanyInfo
