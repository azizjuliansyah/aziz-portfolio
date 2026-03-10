
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/features/authSlice";
import { Lock, Mail } from "lucide-react"; // Keep Lock and Mail as they are used
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader } from "@/components/ui/Card";

// Define types for the user and login response data
interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface LoginResponse {
  user: User;
  token: string;
  error?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json(); // Type the response data

      if (!res.ok) {
        throw new Error(data.error || "Login failed"); // Assuming data.error might exist on error
      }

      dispatch(loginSuccess({ user: data.user, token: data.token }));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md" noPadding>
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Sign in to access your dashboard</p>
        </CardHeader>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              icon={Mail}
              placeholder="admin@portfolio.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              icon={Lock}
              placeholder="••••••••"
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

