import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import { sendForgotPasswordEmail } from '../graphql/mutations/forgotPassword.graphql';
export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [reset, { data, error, loading }] = useMutation(sendForgotPasswordEmail);
  const { register, handleSubmit } = useForm();

  const onSubmit = async data => {
    reset({ variables: data });
  };

  useEffect(() => {
    console.log(data);
    if (data) {
      setMessage(data);
    }
  }, [data, error]);

  return (
    <div>
      <Header />
      <div className="m-32 flex">
        <div className="w-full max-w-sm m-auto bg-white rounded-lg border border-primaryBorder shadow-default drop-shadow-lg py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">Reset Password</h1>

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
              {message != null && <p className="text-red-500 text-sm -mt-3">{message.sendForgotPasswordEmail}</p>}
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
                  className={`flex bg-indigo-500 py-2 px-10 text-sm text-white rounded border border-indigo-500 focus:outline-none focus:border-indigo-700`}
                >
                  Send Password Reset Link
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
