import { Field, Form, Formik } from 'formik'
import { useAuth } from '../utils/useAuth';
import { navigate } from 'astro:transitions/client';

export function RegisterForm() {

  const { signUp } = useAuth();

  return <div className='flex flex-col gap-4 w-full  h-1/3'>
    <h1 className='text-2xl'>Sign up form!</h1>
    <Formik
      validateOnChange
      validateOnBlur
      initialValues={{ email: '', password: '', confirmPassword: '' }}
      validate={values => {
        const errors: { [field: string]: string } = {}
        if (!values.email) {
          errors.email = 'Required'
        }
        if (!values.password || values.password.length < 8) {
          errors.password = 'Required'
        }
        if (!values.confirmPassword || values.confirmPassword.length < 8) {
          errors.confirmPassword = 'Required'
        }
        if (values.password !== values.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match'
        }
        return errors
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {

        const { error, success } = await signUp({
          email: values.email,
          password: values.password
        })

        if (!success) {
          setSubmitting(false)
          alert(error || "Error signing up, refresh and try again")
          return
        }
        resetForm()
        await navigate('/login')
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form className='flex flex-col gap-4 justify-between h-full'>
          <div className='flex flex-col gap-4'>
            <Field className={`input validator w-full ${errors.email ? 'input-error' : 'validator'}`} type="email" name="email" minLength={5} placeholder="Email" />
            <Field className={`input  w-full ${errors.password ? 'input-error' : 'validator'}`} name="password" minLength={8} placeholder="Password" />
            <Field className={`input  w-full ${errors.confirmPassword ? 'input-error' : 'validator'}`} name="confirmPassword" minLength={8} placeholder="Confirm password" />
          </div>
          <button className='btn w-full' type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
}