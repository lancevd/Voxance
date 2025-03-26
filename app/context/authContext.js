"use client";
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const checkUserLoggedIn = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/auth/check`);
      if (response.status === 401) {
        router.push("/login");
        setLoading(false)
      }
      console.log(response.data.message);
      setUser(response.data.user);
        setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const register =  async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/auth/register`, data);
      console.log(response.data.message);
      setUser(response.data.user);
      setLoading(false);
      toast.success(response.data.message);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setLoading(false)
      toast.error(error.response.data.message);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, checkUserLoggedIn, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
