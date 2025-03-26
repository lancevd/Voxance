"use client";
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/utils/axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const checkUserLoggedIn = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/auth/check`);
      console.log("RESPONSE RE OOO", response)
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
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, checkUserLoggedIn, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
