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
import { useLocalStorage } from '@/utils/localStorage'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

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
  const navigate = useNavigate()
  const { useCreateNhiaEnrolleeAuth,OnboardNhiaCompanyEnrolleesAuth } = useEnrollee()
  const [companyId, setcompanyId] = useState<{
    companyname:string,
    companyid:string

  }>({
    companyname:'',
    companyid:''
  })
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
      const beforeUpload = (files: FileList | null, fileList: File[]) => {
          let valid: string | boolean = true

          const allowedFileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']

          if (files) {
              for (const f of files) {
                  if (!allowedFileType.includes(f.type)) {
                      valid = 'Please upload a .xlsx or .xls file!'
                  }
              }
          }
          return valid
      }

      const handleFileUpload = async (files: File[], fileList: File[]) => {
        try {
          if (!files.length) return;

          const BATCH_SIZE = 100; // Adjust this for performance
          const file = files[0];

          // Convert File to ArrayBuffer using FileReader (React-friendly)
          const arrayBuffer = await file.arrayBuffer();

          // Parse the Excel file
          const workbook = XLSX.read(arrayBuffer, { type: "array" });

          // Extract data from the first sheet
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);


          console.log(jsonData);
          let response;
          for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
              const batch = jsonData.slice(i, i + BATCH_SIZE);
              response = await Promise.all(batch.map((item: any) => OnboardNhiaCompanyEnrolleesAuth(item)));
              console.log(response);
              // console.log(response);
          }
      } catch (error) {
          console.error("File upload error:", error);
      }


      };
      const [successMessage, setSuccessMessage] = useTimeOutMessage()
          const onCreateCompany = async (values: any,
              setSubmitting: (isSubmitting: boolean) => void,
              resetForm: () => void
          ) => {

              setSubmitting(true)

              const { getItem } = useLocalStorage()

              values.user_id = getItem("user")

              const data = await useCreateCompanyAuth(values)

              if (data?.data) {

                  setTimeout(() => {
                      setSuccessMessage(data.message)
                      setSubmitting(false)
                      resetForm()
                  }, 3000)

              }

          }
    return (
      <>
                  {/* <div className='my-5'>
                <Upload
                    beforeUpload={beforeUpload}
                    onChange={handleFileUpload}
                >
                    <Button variant="solid" icon={<HiCloudUpload />}>
                        Upload your file
                    </Button>
                </Upload>
            </div> */}
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

                // alert(`Company data is: ${JSON.stringify(values)}`)

            }}
        >
            {({ isSubmitting,errors ,touched,values}) => (
                <Form>
                    <FormContainer>
                        {/* <FormItem label="Company Email"
                        invalid={errors.company_email && touched.company_email}
                        errorMessage={errors.company_email}>
                            <Field
                                type="txt"
                                autoComplete="off"
                                name="company_email"
                                placeholder="Enter company email"
                                component={Input}
                            />
                        </FormItem> */}
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
                </Form>
            )}
        </Formik>
        {/* <p onClick={() => navigate(`http://localhost:5174/${company_name}/2b7e7421-2b82-421e-b56b-6f374bdeca5b/mainform`)}>hello</p> */}

        </>
    )
}
export default CompanyInfo
