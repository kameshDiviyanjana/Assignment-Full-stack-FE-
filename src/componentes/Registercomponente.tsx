import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../atomes/Button";
import { useRegister } from "../api/aut.api";

export const Registercomponente: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields.');
      return;
    }

    // Handle registration
    registerMutation.mutate(
      { firstName, lastName, email, password },
      {
        onSuccess: () => {
          navigate('/tasks');
        },
        onError: (err) => {
          const apiError = err as { response?: { data?: { message?: string } } };
          setError(apiError.response?.data?.message || 'Registration failed. Please try again.');
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </a>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                       Frist Name
                    </label>
                       <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />

                </div>
                <div className="col-span-1" >
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                       Last Name
                    </label>
                       <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="given-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />

                </div>
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Already have an account? Sign in
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button 
              btname={registerMutation.isPending ? 'Registering...' : 'Register'} 
              btcolor="bg-indigo-600" 
              btstyle="hover:bg-indigo-700 disabled:opacity-50"
              disabled={registerMutation.isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );


}