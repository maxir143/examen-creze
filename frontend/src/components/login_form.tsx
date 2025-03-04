import { navigate } from 'astro:transitions/client'
import { Field, Form, Formik } from 'formik'
import { useAuth } from '../utils/useAuth';

export function LoginForm() {

  const { login, setToken } = useAuth();

  return <div className='flex flex-col gap-4 w-full h-1/3'>
    <h1 className='text-2xl'>Login form!</h1>
    <Formik
      validateOnChange
      validateOnBlur
      initialValues={{ email: '', password: '' }}
      validate={values => {
        const errors: { [field: string]: string } = {}
        if (!values.email) {
          errors.email = 'Required'
        }
        if (!values.password || values.password.length < 8) {
          errors.password = 'Required'
        }
        return errors
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true)
        const { token, error } = await login({
          email: values.email,
          password: values.password
        })
        if (!token) {
          alert(error || "Error logging in, refresh and try again")
          setSubmitting(false)
          return
        }
        setToken(token)
        await navigate('/protected')
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form className='flex flex-col gap-4 justify-between h-full'>
          <div className='flex flex-col gap-4'>
            <Field className={`input w-full ${errors.email ? 'input-error' : 'validator'}`} type="email" name="email" placeholder="Email" />
            <Field className={`input w-full ${errors.password ? 'input-error' : 'validator'}`} name="password" minLength={8} placeholder="Password" />
          </div>
          <button className='btn w-full' type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
}