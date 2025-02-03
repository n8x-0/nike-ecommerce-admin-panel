"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

const validateInput = (name: string, password: string) => {
  if (!name) {
    throw new Error("Name is required.");
  } else if (name.length > 18) {
    throw new Error("Name cannot exceed 18 characters.");
  }

  if (!password) {
    throw new Error("Password is required.");
  } else if (password.length > 18) {
    throw new Error("Password cannot exceed 18 characters.");
  }
};

const AdminLogin = () => {
  const router = useRouter()
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [laoding, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      validateInput(name, password);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }
      console.log("Login successful!", data);
      setLoading(false)
      router.push("/admin")

    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        setLoading(false)
        setError(err.message as string);
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          Admin Login
        </h1>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border ${error === "Name is required." || error === "Name cannot exceed 18 characters."
              ? "border-red-500"
              : "border-gray-300"
              }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && (error === "Name is required." || error === "Name cannot exceed 18 characters.") && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border ${error === "Password is required." || error === "Password cannot exceed 18 characters."
              ? "border-red-500"
              : "border-gray-300"
              }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (error === "Password is required." || error === "Password cannot exceed 18 characters.") && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >

          {laoding ?
            <div className="m-auto w-6 h-6 border-2 border-t-blue-200 border-blue-800 rounded-full animate-spin">

            </div>
            : "Login"}
        </button>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
