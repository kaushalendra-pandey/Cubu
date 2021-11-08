import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header';
import { forgotPasswordChange } from '../../graphql/mutations/forgotPasswordChange.graphql';
export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState(null);
  const [password, { data, error, loading }] = useMutation(forgotPasswordChange);
  const { register, handleSubmit } = useForm();

  const onSubmit = async data => {
    password({
      variables: {
        newPassword: data.password,
        key: router.query.key
      }
    });
  };

  useEffect(() => {
    if (data) {
      setErrors(data.forgotPasswordChange[0]);
    }
  }, [data, error]);

  return (
    <div>
      <Header />
      <div className="m-32 flex">
        <div className="w-full max-w-sm m-auto bg-white rounded-lg border border-primaryBorder shadow-default drop-shadow-lg py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">Change your password</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm text-primary">
                  Password
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="password"
                  className={`w-full p-2 border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 flex-1`}
                  id="password"
                  placeholder="New Password"
                  autoComplete="off"
                  name="password"
                  {...register('password')}
                />
              </div>
              {errors != null && errors.path == 'newPassword' && <p className="text-red-500 text-sm -mt-3">{errors.message}</p>}
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
                  className={`bg-indigo-500 py-2 px-16 text-sm text-white rounded border border-indigo-500 focus:outline-none focus:border-indigo-700`}
                >
                  Change Password
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
