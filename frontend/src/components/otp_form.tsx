import { navigate } from 'astro:transitions/client'
import { Field, Form, Formik } from 'formik'
import { useAuth } from '../utils/useAuth';
import { use, useEffect } from 'react';

export function OTPForm({ fields = ["0", "1", "2", "3", "4", "5"] }: { fields: string[] }) {
  const { verifyOTP, setToken } = useAuth();

  const initialValues: { [field: string]: string } = fields.map((field) => ({ [`_otp_${field}`]: "" })).reduce((prev, curr) => ({ ...prev, ...curr }), {})


  function handleChange(e: any, values: any, setValues: any, focus?: string) {
    const next_value = Math.max(0, Math.min(9, e.target.value))
    setValues({ ...values, [e.target.name]: next_value })
    focusElement(focus)
  }

  function focusElement(name?: string) {
    if (name) {
      document.getElementsByName(name)?.[0]?.focus()
    }
  }

  useEffect(() => {
    focusElement("_otp_0")
  }, [])

  return <div className='flex flex-col gap-4 w-full p-4 h-1/3'>
    <Formik
      validateOnChange
      validateOnBlur
      isInitialValid
      initialValues={initialValues}
      validate={() => {
        const fileds = Object.keys(initialValues)
        const errors = fileds.reduce((prev, curr) => ({ ...prev, [curr]: "Required" }), {})
        return errors
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true)
        const fileds = Object.keys(initialValues)
        const otp: string = fileds.reduce((prev, curr) => (prev + values[curr]), "")
        const token = await verifyOTP(parseInt(otp))
        console.log(token)
        if (!token) {
          alert('OTP is not valid')
          setSubmitting(false)
          resetForm()
          focusElement("_otp_0")
          return
        }
        setToken(token)
        await navigate('/protected')
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, values, setValues, errors }) => (
        <Form className='flex flex-col gap-4 justify-between h-full'>
          <input />
          <div className='grid grid-cols-6 gap-4'>
            {
              Object.keys(initialValues).map((name, i) => (
                <Field
                  className={`input validator w-full ${errors[`_otp_${i}`] ? 'input-error' : 'validator'}`} required
                  placeholder="0"
                  type="number"
                  name={`_otp_${i}`}
                  min="0"
                  max="9"
                  onChange={(e: any) => handleChange(e, values, setValues, `_otp_${i + 1}`)}
                  onClick={(e: any) => e.target.value = ""}
                />

              ))
            }
          </div>
          <button className='btn w-full' name={`_otp_${fields.length}`} type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div >
}