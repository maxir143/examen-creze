import { Field, Form, Formik } from 'formik';

export function LoginForm() {
  return <div className='flex flex-col gap-4 w-full p-4'>
    <h1 className='text-2xl'>Login form!</h1>
    <Formik
      validateOnChange
      validateOnBlur
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form className='grid grid-cols-1 gap-4'>
          <Field className={`input validator w-full ${errors.email && 'input-error'}`} type="email" name="email" minLength={5} placeholder="Email" />
          <Field className='input validator w-full' type="password" name="password" minLength={8} placeholder="Password" />
          <button className='btn w-full' type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
}