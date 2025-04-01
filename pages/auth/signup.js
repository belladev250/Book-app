import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import { useAuthToken } from '@/hooks/auth.hooks'

// GraphQL

const SignUpMutation = gql`
  mutation SignUpMutation(
    $name: String!
    $username: String!
    $password: String!
  ) {
    signup(
      name: $name
      username: $username
      password: $password
    ) {
      token
      user {
        name
        username
        userId
      }
    }
  }
`

export default function Signup() {
  const router = useRouter()
  const { setAuthToken, setUserData } = useAuthToken()

  // Form validation schema using Yup
  const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is mandatory'),
    username: Yup.string()
      .lowercase()
      .trim()
      .required('Username is mandatory')
      .min(3, 'Username must be at least 3 characters long'),
    password: Yup.string()
      .required('Password is mandatory')
      .min(3, 'Password must be at least 3 characters long'),
    confirmPwd: Yup.string()
      .required('Password is mandatory')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),
  })

  const formOptions = {
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      confirmPwd: '',
    },
  }

  // React Hook Form setup
  const { control, handleSubmit, reset, formState } = useForm(formOptions)
  const { errors } = formState

  // Apollo mutation hook
  const [signup, { loading, error }] = useMutation(SignUpMutation, {
    onCompleted: (data) => {
      reset() // Reset form fields on successful signup
      setAuthToken(data?.signup.token) // Set auth token
      setUserData(JSON.stringify(data?.signup.user)) // Set user data
      router.push('/want-to-read') // Redirect after successful signup
    },
  })

  // Form submit handler
  const onSubmit = (data) => {
    const { name, username, password } = data
    const variables = { name, username, password }

    try {
      toast.promise(signup({ variables }), {
        loading: 'Signing up...',
        success: 'Signup successfully! 🎉',
        error: 'Something went wrong 😥 Please try again',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <Toaster />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up
            </h1>
            <span className="text-md text-red-600">{error?.message}</span>
            {loading && <p>Loading...</p>} {/* Show loading text */}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Name field */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your name
                </label>
                <Controller
                  name="name"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John"
                    />
                  )}
                />
                <span className="text-sm text-red-600">{errors.name?.message}</span>
              </div>

              {/* Username field */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your username
                </label>
                <Controller
                  name="username"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      name="username"
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="example"
                    />
                  )}
                />
                <span className="text-sm text-red-600">{errors.username?.message}</span>
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <Controller
                  name="password"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  )}
                />
                <span className="text-sm text-red-600">{errors.password?.message}</span>
              </div>

              {/* Confirm Password field */}
              <div>
                <label
                  htmlFor="confirmPwd"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <Controller
                  name="confirmPwd"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      id="confirmPwd"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  )}
                />
                <span className="text-sm text-red-600">{errors.confirmPwd?.message}</span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                disabled={loading} // Disable button while loading
              >
                Create Account
              </button>

              {/* Login link */}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
