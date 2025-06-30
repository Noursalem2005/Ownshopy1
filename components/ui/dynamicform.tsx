/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Button } from "./button";
import axios from "../../utils/axiosInstance"; 
import { toast } from "sonner"; // Import the toast function
import axiosInstance from "../../utils/axiosInstance";
type Field = {
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
};
type DynamicFormProps = {
  fields: Field[];
  onSubmit: (formData: Record<string, string>) => void;
  isSubmitting?: boolean;
  isSignUp?: boolean;
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  isSubmitting,
  isSignUp,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const checkPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };
  const getStrengthColor = (strength: number): string => {
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.placeholder}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            onChange={handleChange}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
          />
          {field.type === "password" && formData[field.name] && isSignUp && (
            <div className="mt-2">
              <div className="flex justify-between space-x-1">
                {/* Part 1 */}
                <div
                  className={`h-2 flex-1 rounded ${
                    passwordStrength >= 1
                      ? getStrengthColor(passwordStrength)
                      : "bg-gray-300"
                  } transition-all duration-500 ease-in-out`}
                ></div>
                {/* Part 2 */}
                <div
                  className={`h-2 flex-1 rounded ${
                    passwordStrength >= 2
                      ? getStrengthColor(passwordStrength)
                      : "bg-gray-300"
                  } transition-all duration-500 ease-in-out`}
                ></div>
                {/* Part 3 */}
                <div
                  className={`h-2 flex-1 rounded ${
                    passwordStrength >= 3
                      ? getStrengthColor(passwordStrength)
                      : "bg-gray-300"
                  } transition-all duration-500 ease-in-out`}
                ></div>
                {/* Part 4 */}
                <div
                  className={`h-2 flex-1 rounded ${
                    passwordStrength >= 4
                      ? getStrengthColor(passwordStrength)
                      : "bg-gray-300"
                  } transition-all duration-500 ease-in-out`}
                ></div>
              </div>
              <p className="text-xs mt-1 text-gray-400">
                {passwordStrength === 1 && "Weak"}
                {passwordStrength === 2 && "Medium"}
                {passwordStrength === 3 && "Strong"}
                {passwordStrength === 4 && "Very Strong"}
              </p>
            </div>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between flex-row flex-nowrap space-x-2">
      <Button
        type="submit"
        className={`px-4 py-2 rounded-md cursor-pointer transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:ring-opacity-50
        focus:ring-offset-2
        focus:ring-offset-gray-800

           ${
          isSubmitting
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Submitting...</span>
          </div>
        ) : (
          <span>Submit</span>
        )}
      </Button>
      {!isSignUp &&
      <p className="text-sm text-gray-200">
      Forget password?{" "}
      <a
        href="/forgot-password"
        className="text-blue-500 hover:underline"
      >
        Reset it here
      </a>
    </p>
}
      </div>
    </form>
  );
};

export default DynamicForm;
