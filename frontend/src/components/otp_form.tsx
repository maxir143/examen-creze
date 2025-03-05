import { navigate } from 'astro:transitions/client'
import { Field, Form, Formik } from 'formik'
import { useAuth } from '@/utils/useAuth.ts'
import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'

export function OTPForm({
  fields = ['0', '1', '2', '3', '4', '5'],
}: {
  fields?: string[]
}) {
  const { verifyOTP, setToken } = useAuth()

  const initialValues: { [field: string]: string } = fields
    .map((field) => ({ [`_otp_${field}`]: '' }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})

  function handleChange(e: any, values: any, setValues: any, focus?: string) {
    if (e.target.value !== "") {
      const next_value = Math.max(0, Math.min(9, e.target.value))
      const single_digit = parseInt(next_value.toString().slice(0, 1))
      setValues({ ...values, [e.target.name]: single_digit })
    }
    focusElement(focus)
  }

  function focusElement(name?: string) {
    if (name) {
      document.getElementsByName(name)?.[0]?.focus()
    }
  }

  useEffect(() => {
    focusElement(`_otp_${fields[0]}`)
  }, [])

  return (
    <div className="flex flex-col gap-4 w-full h-1/3">
      <Formik
        validateOnChange
        validateOnBlur
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true)
          const { error, token } = await verifyOTP(
            Object.keys(initialValues).reduce(
              (prev, curr) => prev + values[curr],
              '',
            ),
          )
          if (!token) {
            toast.error(error || 'Invalid OTP, try again')
            setSubmitting(false)
            resetForm()
            focusElement('_otp_0')
            return
          }
          setToken(token)
          await navigate('/protected')
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, values, setValues, errors, resetForm }) => (
          <Form className="flex flex-col gap-4 justify-between h-full">
            <div className="grid grid-cols-6 gap-4 max-w-[500px] mx-auto">
              {Object.keys(initialValues).map((_, i) => (
                <Field
                  className={`input validator w-full text-center ${errors[`_otp_${i}`] ? 'input-error' : 'validator'}`}
                  required
                  placeholder="0"
                  type="number"
                  name={`_otp_${i}`}
                  key={`_otp_${i}`}
                  min="0"
                  max="9"
                  onChange={(e: any) => {
                    handleChange(e, values, setValues, `_otp_${i + 1}`)
                    if (i === fields.length - 1) {
                      focusElement('submit_button')
                    }
                  }

                  }
                  onSelect={(e: any) => (setValues({ ...values, [e.target.name]: '' }))}
                  onKeyUp={(e: any) => {
                    if (e.key === 'Backspace') {
                      if (i > 0) {
                        setValues({ ...values, [e.target.name]: '' })
                        handleChange(e, values, setValues, `_otp_${i - 1}`)
                      }
                    }
                  }}
                />
              ))}
            </div>
            <button
              className="btn w-full"
              name="submit_button"
              type="submit"
              disabled={isSubmitting}
              onKeyUp={(e: any) => {
                if (e.key === 'Backspace') {
                  resetForm()
                  focusElement(`_otp_${fields[0]}`)
                }
              }}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  )
}
