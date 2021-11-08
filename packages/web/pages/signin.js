import { useMutation } from '@apollo/client';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import { Login } from '../graphql/mutations/login.graphql';
export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState(null);
  const [signIn, { data, error, loading }] = useMutation(Login);
  const [show, setShow] = useState(false);
  const { register, handleSubmit } = useForm();

  const handleEye = () => setShow(!show);

  const onSubmit = async data => {
    signIn({ variables: data });
  };

  useEffect(() => {
    if (data) {
      if (data?.login.errors) {
        setErrors(data.login.errors[0]);
      } else if (data?.login.sessionId) {
        router.push('/');
      }
    }
  }, [data, error]);

  return (
    <div>
      <Header />
      <div className="m-32 flex">
        <div className="w-full max-w-sm m-auto bg-white rounded-lg border border-primaryBorder shadow-default drop-shadow-lg py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">Welcome Back</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                type="text"
                name="email"
                className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                id="email"
                placeholder="Email"
                autoComplete="off"
                {...register('email')}
              />
              {errors != null && errors.path == 'email' && <p className="text-red-500 text-sm -mt-3">{errors.message}</p>}
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm text-primary">
                  Password
                </label>
                <button type="button" onClick={() => router.push('/forgot-password')} className="text-xs">
                  Forgot Password?
                </button>
              </div>
              <div className="flex items-center">
                <input
                  type={show ? 'text' : 'password'}
                  className={`w-full p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 flex-1`}
                  id="password"
                  placeholder="Password"
                  autoComplete="off"
                  name="password"
                  {...register('password')}
                />
                <button className="absolute mb-4 ml-52 flex items-center pl-2" onClick={handleEye}>
                  {show ? <EyeIcon className="h-4 w-4 mr-2 text-gray-700" /> : <EyeOffIcon className="h-4 w-4 mr-2 text-gray-700" />}
                </button>
              </div>
              {errors != null && errors.path == 'password' && <p className="text-red-500 text-sm -mt-3">{errors.message}</p>}
            </div>

            <div className="flex justify-center items-center mt-6">
              {loading ? (
                <button
                  className={`bg-indigo-500 py-2 px-24 text-sm text-white rounded border border-indigo-500 focus:outline-none focus:border-indigo-700`}
                >
                  Loading...
                </button>
              ) : (
                <button
                  type="submit"
                  className={`bg-indigo-500 py-2 px-24 text-sm text-white rounded border border-indigo-500 focus:outline-none focus:border-indigo-700`}
                >
                  Login
                </button>
              )}
            </div>

            <div>
              <p className="text-center text-sm text-primary mt-4">
                Don't have an account?
                <button type="button" onClick={() => router.push('/signup')} className="text-primary ml-2 text-border-indigo-500">
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
