'use client';

import React, { useState } from 'react';
import { Button, Checkbox, Input, Select, SelectItem } from '@nextui-org/react';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: val,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    login(formData.email, formData.password);

    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 ">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <Input
              name="email"
              isRequired
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
            />
            <Input
              name="password"
              isRequired
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  {/* <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""> */}
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              color="primary"
              variant="bordered"
              className="w-full"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
