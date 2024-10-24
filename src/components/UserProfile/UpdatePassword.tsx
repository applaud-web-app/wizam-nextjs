"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Validation schema for password form
const passwordValidationSchema = Yup.object({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("New password is required"),
  new_password_confirmation: Yup.string()
    .oneOf([Yup.ref("new_password")], "Passwords must match")
    .required("Confirm password is required"),
});

interface PasswordFormValues {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

interface UpdatePasswordProps {
  initialValues: PasswordFormValues;
  onSubmit: (values: PasswordFormValues) => Promise<void>;
}

export default function UpdatePassword({
  initialValues,
  onSubmit,
}: UpdatePasswordProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleCurrentPasswordVisibility = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold">Update Password</h2>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

      <Formik
        initialValues={initialValues}
        validationSchema={passwordValidationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div className="col-span-1 relative">
                <label
                  htmlFor="current_password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password <span className="text-red-500">*</span>
                </label>
                <Field
                  id="current_password"
                  name="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                />
                <button
                  type="button"
                  onClick={toggleCurrentPasswordVisibility}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <ErrorMessage
                  name="current_password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* New Password */}
              <div className="col-span-1 relative">
                <label
                  htmlFor="new_password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password <span className="text-red-500">*</span>
                </label>
                <Field
                  id="new_password"
                  name="new_password"
                  type={showNewPassword ? "text" : "password"}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showNewPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <ErrorMessage
                  name="new_password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div className="col-span-1 relative">
                <label
                  htmlFor="new_password_confirmation"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Field
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <ErrorMessage
                  name="new_password_confirmation"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-defaultcolor text-white py-3 px-5 rounded-md hover:bg-defaultcolor-dark"
              >
                Update Password
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
