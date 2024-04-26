"use client";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useAuth } from "@/providers/authProvider";
import { getUser } from "@/utils/apiCalls";
import { useParams } from "next/navigation";

interface IUser {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  last_login: string;
  role: string;
  start_date: string;
  phone: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  groups: any[];
  user_permissions: any[];
}

const UserDetailsPage = () => {
  const [user, setUser] = useState<IUser | null>(null);

  const { accessToken } = useAuth();
  const { user_id } = useParams();

  const fetchUser = async () => {
    if (accessToken) {
      const response = await getUser(accessToken, user_id as string);
      setUser(response);
    }
    return null;
  };

  useEffect(() => {
    fetchUser();
  }, [accessToken]);

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
                  // value={user?.first_name ?? ""}
                  //   onChange={handleChange}
                />
              </div>
              <div className="mb-5">
                <Input
                  label="Last Name"
                  name="last_name"
                  type="text"
                  size="sm"
                  // value={user?.last_name ?? ""}
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
