'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { useAuth } from '@/providers/authProvider';
import { getUser } from '@/utils/apiCalls';
import { useParams } from 'next/navigation';

const UserDetailsPage = () => {
  const [user, setUser] = useState([]);

  const { accessToken } = useAuth();
  const { user_id } = useParams();

  const fetchUser = async () => {
    if (accessToken) {
      const response = await getUser(accessToken, user_id);
      setUser(response);
    }
    return null;
  };

  useEffect(() => {
    fetchUser();
  }, [accessToken]);

  console.log(user);

  return (
    <div className="flex flex-col items-center justify-center px-6 ">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Edit User
          </h1>
          <form>
            <div className="flex flex-row gap-4 items-center justify-center">
              <div className="mb-5">
                <Input
                  label="First Name"
                  type="text"
                  size="sm"
                  name="first_name"
                  //   value={signupData.first_name || ''}
                  //   onChange={handleChange}
                />
              </div>
              <div className="mb-5">
                <Input
                  label="Last Name"
                  name="last_name"
                  type="text"
                  size="sm"
                  //   value={signupData.last_name || ''}
                  //   onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-5">
              <Input
                label="Email"
                type="text"
                size="sm"
                name="email"
                // value={signupData.email || ''}
                // onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <Input
                label="Username"
                type="text"
                size="sm"
                name="username"
                // value={signupData.username || ''}
                // onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <Input
                label="Phone"
                type="text"
                size="sm"
                name="phone"
                // value={signupData.phone || ''}
                // onChange={handleChange}
              />
            </div>
            <div className="mb-5">
              <Input
                label="Password"
                size="sm"
                name="password"
                // value={signupData.password || ''}
                // onChange={handleChange}

                type="password"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
