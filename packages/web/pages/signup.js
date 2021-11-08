import { useMutation } from '@apollo/client';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import { Register } from '../graphql/mutations/register.graphql';

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [signUp, { data, error, loading }] = useMutation(Register);
  const [show, setShow] = useState(false);
  const { register, handleSubmit } = useForm();

  const handleEye = () => setShow(!show);

  const onSubmit = async data => {
    console.log(data);
    signUp({ variables: data });
  };

  useEffect(() => {
    if (data?.register) {
      setMessage(data.register[0]);
    }
  }, [data, error]);

  return (
    <div>
      <Header />
      <div className="m-32 flex">
        <div className="w-full max-w-sm m-auto bg-white rounded-lg border border-primaryBorder shadow-default drop-shadow-lg py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">Let's get started</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                id="name"
                placeholder="Full name"
                autoComplete="off"
                {...register('name')}
              />
              {message != null && message.path == 'name' && <p className="text-red-500 text-sm -mt-3">{message.message}</p>}
            </div>
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
              {message != null && message.path == 'email' && <p className="text-red-500 text-sm -mt-3">{message.message}</p>}
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm text-primary">
                  Password
                </label>
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
              {message != null && message.path == 'password' && <p className="text-red-500 text-sm -mt-3">{message.message}</p>}
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
                  Sign Up
                </button>
              )}
            </div>
            {message != null && message.path == 'Submit' && <p className="text-center text-green-500 text-sm mt-2">{message.message}</p>}

            <div>
              <p className="text-center text-sm text-primary mt-4">
                Already have an account?
                <button type="button" onClick={() => router.push('/signin')} className="text-primary ml-2 text-border-indigo-500">
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
