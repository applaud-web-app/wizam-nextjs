"use client";
import { useEffect,useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios"; // Axios for API calls
import { FiEye, FiEyeOff, FiCamera, FiUpload } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// TypeScript interfaces for form values
interface ProfileFormValues {
  fullname: string;
  mobile: string;
  email: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserProfile {
  id: number;
  title: string | null;
  name: string;
  email: string;
  phone_number: string;
}

// Validation schemas using Yup
const profileValidationSchema = Yup.object({
  fullname: Yup.string().required("Full name is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function UserProfile() {
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  // State for the profile image preview
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Handle image selection and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initial values for both forms
  const profileInitialValues: ProfileFormValues = {
    fullname: "",
    mobile: "",
    email: "",
  };

  const passwordInitialValues: PasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };


   // Function to fetch profile data
   const fetchProfileData = async () => {
    const jwt = Cookies.get("jwt");
    if (!jwt) {
      // If there is no JWT, redirect to signin immediately
      router.push("/signin");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.status === 200 && response.data.status === true) {
        setUserProfile(response.data.user);
      } else if (response.data.status === false && response.data.message === "Unauthorized") {
         router.push("/signin");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
       router.push("/signin");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Update Details Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold ">Update Details</h2>

        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

        <Formik
          initialValues={profileInitialValues}
          validationSchema={profileValidationSchema}
          onSubmit={(values) => {
            console.log("Profile Updated", values);
          }}
        >
          {() => (
            <Form>
              {/* Profile Image */}
              <div className="mb-6 flex items-center space-x-6">
                {/* Profile Image Container */}
                <div className="relative w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-lg">
                  {/* Profile image preview or placeholder */}
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <FiCamera className="text-gray-500 text-3xl" />
                  )}
                  {/* File Upload Overlay */}
                  <label htmlFor="profileImage" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <FiUpload className="text-white text-2xl" />
                  </label>
                </div>
                {/* Hidden File Input */}
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {/* Upload Label */}
                <div className="flex flex-col justify-center">
                  <label className="text-sm font-medium text-gray-700">
                    Profile Image <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => document.getElementById("profileImage")?.click()}
                    className="mt-2 bg-gray-700 text-white flex items-center space-x-2 py-1 px-3 text-sm rounded-md hover:bg-gray-900 transition"
                  >
                    <FiUpload />
                    <span>Change Image</span>
                  </button>
                </div>
              </div>

              {/* Form Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                {/* First Name */}
                <div className="col-span-1">
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="fullname"
                    name="fullname" value={userProfile?.name}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                  <ErrorMessage name="fullname" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Mobile Number */}
                <div className="col-span-1">
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="mobile"
                    name="mobile" value={userProfile?.phone_number}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                  <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Email */}
                <div className="col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email" value={userProfile?.email}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className="mt-6">
                <button type="submit" className="bg-primary text-white py-3 px-5 rounded-md hover:bg-primary-dark">
                  Update Details
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Update Password Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold ">Update Password</h2>
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

        <Formik
          initialValues={passwordInitialValues}
          validationSchema={passwordValidationSchema}
          onSubmit={(values) => {
            console.log("Password Updated", values);
          }}
        >
          {() => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Current Password */}
                <div className="col-span-1">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                  <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm" />
                </div>

                {/* New Password */}
                <div className="col-span-1 relative">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Confirm Password */}
                <div className="col-span-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className="mt-6">
                <button type="submit" className="bg-primary text-white py-3 px-5 rounded-md hover:bg-primary-dark">
                  Update Password
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Logout Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Logout</h2>
        <p className="mb-4 text-gray-600">You can log out from your account if you no longer want to stay signed in.</p>
        <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
}
