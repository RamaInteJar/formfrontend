'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { baseUrl } from '@/config/apiConfig';

interface User {
  id: number;
  username: string;
}

type regiterType = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
  phone: string;
};

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  register: (
    first_name:string,
    last_name:string,
    email:string,
    username:string,
    phone:string,
    password:string,
    confirmpassword:string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    }
  }, []);

  const register = async (
    first_name,
    last_name,
    email,
    username,
    phone,
    password,
    confirmpassword
  ) => {
    try {
      const response = await axios.post<regiterType>(
        `${baseUrl}` + '/accounts/register',
        {
          first_name,
          last_name,
          email,
          username,
          phone,
          password,
          confirmpassword,
        }
      );
      if (response.status == 201) {
        console.log('User registered successfull');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post<{
        access: string;
        refresh: string;
      }>(`${baseUrl}` + '/accounts/token', {
        email,
        password,
      });
      setAccessToken(res.data.access);
      setRefreshToken(res.data.refresh);
      Cookies.set('accessToken', res.data.access);
      Cookies.set('refreshToken', res.data.refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !(originalRequest as any)._retry &&
          refreshToken
        ) {
          (originalRequest as any)._retry = true;
          try {
            const refershResponse = await axios.post<{ access_token: string }>(
              `${baseUrl}` + '/accounts/refresh',
              {
                refresh_token: refreshToken,
              }
            );
            setAccessToken(refershResponse.data.access_token);
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${refershResponse.data.access_token}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refersh failed', refreshError);
            logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
