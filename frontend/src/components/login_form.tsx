import { navigate } from 'astro:transitions/client'
import { Field, Form, Formik } from 'formik'
import { useAuth } from '../utils/useAuth';
import { ToastContainer, toast } from 'react-toastify';

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
          errors.email = 'Email is required'
        }
        if (!values.email.includes('@') || !values.email.includes('.')) {
          errors.email = 'Email is invalid'
        }
        if (!values.password) {
          errors.password = 'Password is required'
        }
        if (values.password.length < 8) {
          errors.password = 'Password must be at least 8 characters long'
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
          toast.error(error || "Error logging in, refresh and try again")
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
            <label className={`input validator w-full pe-0 ${errors.email ? 'input-error' : 'validator'}`}>
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
              <Field className='ps-2' type="email" name="email" minLength={5} placeholder="Email" />
            </label>
            <label className={`input validator w-full pe-0 ${errors.password ? 'input-error' : 'validator'}`}>
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
              <Field className='ps-2' type="password" name="password" minLength={8} placeholder="Password" />
            </label>
          </div>
          <div>
            {errors.email && <small className='text-error'>{errors.email}</small>}
            {errors.password && <small className='text-error'>{errors.password}</small>}
          </div>
          <button className='btn w-full' type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
    <ToastContainer />
  </div>
}