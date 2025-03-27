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
        setLoading(false);
      }
      console.log(response.data.message);
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/auth/register`, data);
      setUser(response.data.user);
      toast.success(response.data.message);
      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const response = await axiosInstance.post("/auth/login", data);
      if (!response.data)
        toast.error(
          "An error ocurred. Try again later or reach out to our support"
        );
      setUser(response.data.user);
      setLoading(false);
      toast.success(response.data.message);
      router.push("/dashboard");
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response =  await axiosInstance.post('/auth/logout')
      toast.success(response.data.message)
      router.push('/login')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, checkUserLoggedIn, register, login, loading,logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
