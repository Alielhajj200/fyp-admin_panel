"use client"
import { useState,useEffect } from "react";
import { FaFacebookF, FaLinkedinIn, FaGoogle, FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { redirect } from 'next/navigation';
import { Alert } from "@mui/material";
export default function Home() {
  const { onLogin } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [Globaltoken, setToken] = useState<string | null>("")
  const [loading, setLoading] = useState(false);
  const TOKEN_KEY = 'abcd123';

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
       setToken(token);
       console.log(Globaltoken);

      if(Globaltoken){
        window.location.href='/dashboard'
      }
      else{
        console.log('not logged in');
      }
  }, [Globaltoken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
console.log(email);
console.log(password)
    try {
      const result = await onLogin(email, password);

      
        console.log("Login successful");
        window.location.href='/dashboard'
      
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center relative login-item">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-secondary">Work</span>fit
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-primary mb-2">Sign in to Account</h2>
              <div className="border-2 w-10 border-secondary inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <a href="/socialLogin" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                  <FaFacebookF className="text-sm" />
                </a>
                <a href="socialLogin" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                  <FaLinkedinIn className="text-sm" />
                </a>
                <a href="socialLogin" className="border-2 border-gray-200 rounded-full p-3 mx-1">
                  <FaGoogle className="text-sm" />
                </a>
              </div>
              <p className="text-gray-400 my-3">or use your email account</p>

              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                  <FaRegEnvelope className="text-gray-400 m-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="bg-gray-100 outline-none text-sm flex-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                  <MdLockOutline className="text-gray-400 m-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="bg-gray-100 outline-none text-sm flex-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex justify-between w-64 mb-5">
                  <label className="flex items-center text-xs">
                    <input type="checkbox" name="remember" className="mr-2" />
                    remember me
                  </label>
                  <a href="#" className="text-xs">
                    Forget Password
                  </a>
                </div>
                <button
                  type="submit"
                  className="border-2 border-primary rounded-full px-12 py-2 inline-block font-semibold hover:bg-secondary hover:text-black"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
                {message && <p className="text-red-500 mt-3">{message}</p>}
              </div>
            </div>
          </div>
          <div className="w-2/5 bg-primary text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">hello friends</h2>
            <div className="border-2 w-10 border-secondary inline-block mb-2"></div>
            <p className="mb-10">Fill up personal information and start journey with us .</p>
          </div>
        </form>
      </main>
    </div>
  );
}
