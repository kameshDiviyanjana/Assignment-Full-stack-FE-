import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../atomes/Button";
import { useRegister } from "../api/aut.api";
import { CommonModal } from "../atomes/CommonModal";
import { registerSchema } from "../util/Formvalidation";



type AdminUserRegisterProps = {
  isModalOpen: boolean;
  handleClose: () => void;
};

export const AdminUserRegister: React.FC<AdminUserRegisterProps> = ({
  isModalOpen,
  handleClose,
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  // Validation/Server error messaging
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationResult = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
    });


if (!validationResult.success) {
  const formattedErrors = validationResult.error.format();
  setError(formattedErrors.firstName?._errors[0] || "Validation failed.");
  return;
}
    registerMutation.mutate(
      { firstName, lastName, email, password },
      {
        onSuccess: () => {
          handleClose();
          navigate("/tasks");
        },
        onError: (err: any) => {
          setError(
            err.response?.data?.message || "Registration failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <CommonModal
      isOpen={isModalOpen}
      title="Create User Account"
      onClose={handleClose}
      position="right"
    >
      <div className="w-full max-w-md mx-auto space-y-6 bg-white p-2">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Provide system credentials to initialize the target user profile.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200 transition-all">
            ⚠️ {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="John"
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email-address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <Button
              btname={registerMutation.isPending ? "Registering..." : "Register Account"}
              btcolor="bg-indigo-600 w-full"
              btstyle="hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg"
              disabled={registerMutation.isPending}
            />
          </div>
        </form>
      </div>
    </CommonModal>
  );
};