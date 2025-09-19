import usePrivates from '@/utils/customAuth/usePrivatesAuth'
import type {PrivateEnrollee} from '@/utils/customAuth/usePrivatesAuth'
import { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import { useParams } from "react-router-dom";
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, FieldArray } from 'formik'
import type { FieldProps } from 'formik'
import Select from '@/components/ui/Select'
import { SingleValue } from 'react-select'
import * as Yup from 'yup'
import Avatar from '@/components/ui/Avatar'
import { HiOutlineUser } from 'react-icons/hi'
import Tag from '@/components/ui/Tag'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { devNull } from 'os';

const EnrolleeProfile = () => {
  const {
    useGetPrivateEnrolleeAuth,
    usegetSinglePrivateEnrolleeAuth,
    updatePrivateEnrolleeAuth,
    }=usePrivates()
  const {enrollee_id}=useParams();

  const [enrolleeData, setEnrolleeData] = useState<PrivateEnrollee>()

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
               <h5>{enrolleeData?.first_name}</h5>
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
  const onUpdateEnrollee=async (values: any,
    setSubmitting: (isSubmitting: boolean) => void,resetForm: () => void) =>{
    setSubmitting(true)

    const response=await updatePrivateEnrolleeAuth(enrollee_id || '', values)
     if (response) {
         setTimeout(() => {
          if (response.status === 'success') {
             setSubmitting(false)
             resetForm()
             openNotification(response.message,'success')
          }
          else if (response.status === 'failed') {
             setSubmitting(false)
             openNotification(response.message,'danger')
          }
         }, 3000)

       }

  }


  useEffect(()=>{
    const getEnrollee=async()=>{
      const enr= await usegetSinglePrivateEnrolleeAuth(enrollee_id || '')
      if (enr){
        setEnrolleeData(enr.data)
      }
    }
    getEnrollee()

  },[enrollee_id]);

  return(
    <>
    <h4 className='mb-10'>Enrollee Details</h4>
       <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1'>
          <Card
             header={profileHeader}
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
          </Card>
        </div>
        <div className='col-span-3'>

            <Formik
              initialValues={{
                first_name: enrolleeData?.first_name || null,
                last_name: enrolleeData?.last_name || null,
                email: enrolleeData?.email || null,
                phone_number: enrolleeData?.phone_number || null,
                sex: enrolleeData?.sex || null,
                dob: enrolleeData?.dob || undefined,
                beneficiary_type: enrolleeData?.beneficiary_type || null,

                enrollee_type: enrolleeData?.enrollee_type || null,
                family_size: enrolleeData?.family_size || null,
                state: enrolleeData?.state || null,
                city: enrolleeData?.city || null,
                address: enrolleeData?.address || null,
                is_active: enrolleeData?.is_active || null,
                provider_name: enrolleeData?.provider_name || null,

                blood_group: enrolleeData?.medical_data?.blood_group || null,
                genotype: enrolleeData?.medical_data?.genotype || null,
                allergies: enrolleeData?.medical_data?.allergies || null,
                pre_existing_conditions: enrolleeData?.medical_data?.pre_existing_conditions || null,
                past_surgeries: enrolleeData?.medical_data?.past_surgeries || null,
                family_medical_history: enrolleeData?.medical_data?.family_medical_history || null,
              }}
              enableReinitialize

              onSubmit={(values , { setSubmitting, resetForm }) => {
                onUpdateEnrollee(values, setSubmitting, resetForm)
                console.log(values);
              }}
            >
              {({ isSubmitting, errors, touched, values }) => (
                <Form >
                   <Card header='Personal Details'>
                  <FormContainer className='grid lg:grid-cols-3 md:grid-cols-2 gap-4'>
                    <FormItem label="First Name">
                      <Field
                           name="first_name"
                           type="txt"
                           component={Input}
                            />
                    </FormItem>
                    <FormItem label="Last Name">
                      <Field name="last_name" component={Input} />
                    </FormItem>
                    <FormItem label="Email">
                      <Field name="email" component={Input} />
                    </FormItem>
                    <FormItem label="Phone Number">
                      <Field name="phone_number" component={Input} />
                    </FormItem>

                    <FormItem label="Sex">
                      <Field
                           name="sex"
                           type="txt"
                           component={Input}
                            />
                    </FormItem>
                    <FormItem label="Date of Birth">
                      <Field type='date' name="dob" component={Input} />
                    </FormItem>
                    <FormItem label="state">
                      <Field name="state" component={Input} />
                    </FormItem>
                    <FormItem label="City">
                      <Field name="city" component={Input} />
                    </FormItem>
                    <FormItem label="Address">
                      <Field name="address" component={Input} />
                    </FormItem>
                  </FormContainer>
                   </Card>
                   {/* Medical Data */}
                   <Card header='Medical Data'
                         className='mt-5'
                   >
                       <FormContainer className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4'>

                         <FormItem label="Blood Group">
                           <Field name="blood_group" component={Input} />
                         </FormItem>
                         <FormItem label="Genotype">
                           <Field name="genotype" component={Input} />
                         </FormItem>
                         <FormItem label="Allergies">
                           <Field name="allergies" component={Input} />
                         </FormItem>

                         <FormItem label="Pre existing Conditions">
                           <Field name="pre_existing_conditions"
                                type="txt"
                                component={Input}
                                 />
                         </FormItem>

                         <FormItem label="Past Surgeries">
                           <Field name="past_surgeries" component={Input} />
                         </FormItem>
                         <FormItem label="Family Medical History">
                           <Field name="family_medical_history" component={Input} />
                         </FormItem>

                       </FormContainer>
                   </Card>
                   {/* Medical Data */}
                   <FormItem
                          className='w-full flex justify-center mt-10'>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : 'Save '}
                            </Button>
                  </FormItem>
                </Form>
              )}
            </Formik>

        </div>
       </div>
    </>
  )
}

export default EnrolleeProfile;
