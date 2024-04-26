import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { axisoInstance } from "@/utils/axiosInstance";

interface User {
  username: string;
  role?: string;
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
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    phone: string,
    password: string,
    confirmpassword: string
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
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      const userloged = getLoggedInuser(accessToken);
      setUser(userloged);
    }
  }, []);

  const register = async (
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    phone: string,
    password: string,
    confirmpassword: string
  ) => {
    try {
      const response = await axisoInstance.post<regiterType>(
        "/accounts/register",
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
        console.log("User registered successfull");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error)) {
        console.error("Registration failed:", error);
        if (error.response) {
          console.error("Server response:", error.response.data);
        }
      }
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axisoInstance.post<{
      access: string;
      refresh: string;
    }>("/accounts/token", {
      email,
      password,
    });
    setAccessToken(res.data.access);
    setRefreshToken(res.data.refresh);
    Cookies.set("accessToken", res.data.access);
    Cookies.set("refreshToken", res.data.refresh);
  };

  const getLoggedInuser = (token: string) => {
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const encodedPayload = tokenParts[1];
        const rawPayload = atob(encodedPayload);
        const payload = JSON.parse(rawPayload);
        const data = {
          username: payload.username,
          role: payload?.role,
        };
        return data;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    return null;
  };

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    router.push("/auth");
  }, [router]);

  const isTokenExpired = useCallback(() => {
    if (!accessToken) {
      return true;
    }
    const tokenParts = accessToken.split(".");
    if (tokenParts.length !== 3) {
      return true;
    }
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const payload = JSON.parse(rawPayload);
    const expirationTime = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now >= expirationTime;
  }, [accessToken]);

  useEffect(() => {
    // const requestInterceptor = axios.interceptors.request.use(
    //   (config) => {
    //     if (accessToken && !isTokenExpired()) {
    //       config.headers.Authorization = `Bearer ${accessToken}`;
    //     }
    //     return config;
    //   },
    //   async (error: AxiosError) => {
    //     const originalRequest = error.config;
    //     if (
    //       error.response?.status === 401 &&
    //       !(originalRequest as any)._retry &&
    //       refreshToken
    //     ) {
    //       (originalRequest as any)._retry = true;
    //       try {
    //         const refershResponse = await axios.post<{ access_token: string }>(
    //           `${baseUrl}` + "/accounts/refresh",
    //           {
    //             refresh_token: refreshToken,
    //           }
    //         );
    //         setAccessToken(refershResponse.data.access_token);
    //         if (originalRequest) {
    //           originalRequest.headers[
    //             "Authorization"
    //           ] = `Bearer ${refershResponse.data.access_token}`;
    //           return axios(originalRequest);
    //         }
    //       } catch (refreshError) {
    //         console.error("Token refersh failed", refreshError);
    //         logout();
    //         return Promise.reject(error);
    //       }
    //     }
    //     return Promise.reject(error);
    //   }
    // );

    const responseInterceptor = axisoInstance.interceptors.response.use(
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
            logout();
            // const refershResponse = await axios.post<{ access_token: string }>(
            //   `${baseUrl}` + "/accounts/refresh",
            //   {
            //     refresh_token: refreshToken,
            //   }
            // );
            // setAccessToken(refershResponse.data.access_token);
            // if (originalRequest) {
            //   originalRequest.headers['Authorization'] = `Bearer ${refershResponse.data.access_token}`;
            //   return axios(originalRequest);
            // }
          } catch (refreshError) {
            logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
    return () => {
      // axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, logout, refreshToken]);

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
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
