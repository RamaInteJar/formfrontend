'use client';
import React, { useState } from 'react';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/react';

type SignupType = {
  username: String;
  phone: String;
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  confirmpassword: String;
};

const SignupPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [signupData, setSignupData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmpassword: '',
  });

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: any) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const res = await register(
        signupData.first_name,
        signupData.last_name,
        signupData.email,
        signupData.username,
        signupData.phone,
        signupData.password,
        signupData.confirmpassword
      );
      router.push('/auth');
    } catch (error) {
      console.log(error);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex flex-col items-center justify-center px-6 ">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create your account
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-row gap-4 items-center justify-center">
              <div className="mb-5">
                <Input
                  label="First Name"
                  type="text"
                  size="sm"
                  name="first_name"
                  value={signupData.first_name || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5">
                <Input
                  label="Last Name"
                  name="last_name"
                  type="text"
                  size="sm"
                  value={signupData.last_name || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-5">
              <Input
                label="Email"
                type="text"
                size="sm"
                name="email"
                value={signupData.email || ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <Input
                label="Username"
                type="text"
                size="sm"
                name="username"
                value={signupData.username || ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <Input
                label="Phone"
                type="text"
                size="sm"
                name="phone"
                value={signupData.phone || ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <Input
                label="Password"
                size="sm"
                name="password"
                value={signupData.password || ''}
                onChange={handleChange}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashIcon className="h-6 w-6 text-blue-500" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-blue-500" />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
              />
            </div>
            <div className="mb-5">
              <Input
                label="Confirm Password"
                size="sm"
                name="confirmpassword"
                value={signupData.confirmpassword || ''}
                onChange={handleChange}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashIcon className="h-6 w-6 text-blue-500" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-blue-500" />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
              />
            </div>
            <Button
              type="submit"
              color="primary"
              variant="bordered"
              className="w-full"
            >
              Signup
            </Button>
            <div className="flex flex-row gap-2 items-center justify-center">
              <span className="text-gray-500 dark:text-gray-300">
                I have an account
              </span>
              <Link href="/auth">Signin</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
