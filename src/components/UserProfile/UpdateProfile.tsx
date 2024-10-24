"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiCamera, FiUpload } from "react-icons/fi";

// Validation schema for profile form
const profileValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  fullname: Yup.string().required("Full name is required"),
  mobile: Yup.string().required("Mobile number is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  dob: Yup.date().required("Date of birth is required"),
});

interface ProfileFormValues {
  title: string;
  fullname: string;
  mobile: string;
  email: string;
  dob: string;
  image: File | null;
}

interface UpdateProfileProps {
  profileInitialValues: ProfileFormValues;
  profileImage: string | null;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (values: ProfileFormValues) => void;
}

export default function UpdateProfile({
  profileInitialValues,
  profileImage,
  handleImageChange,
  onSubmit,
}: UpdateProfileProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold">Update Details</h2>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

      <Formik
        initialValues={profileInitialValues}
        validationSchema={profileValidationSchema}
        onSubmit={onSubmit} // Submitting only the `values`
      >
        {({ setFieldValue }) => (
          <Form>
            {/* Profile Image */}
            <div className="mb-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-lg">
                <img
                  src={profileImage || "/images/default-user.png"}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
                <label htmlFor="profileImage" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <FiUpload className="text-white text-2xl" />
                </label>
              </div>

              {/* Hidden File Input */}
              <input
                id="profileImage"
                name="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(event) => {
                  handleImageChange(event);
                  setFieldValue("image", event.target.files?.[0] || null);
                }}
              />

              {/* Change Image Button */}
              <div className="flex flex-col justify-center">
                <label className="text-sm font-medium text-gray-700">Profile Image</label>
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

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                <Field as="select" id="title" name="title" className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition">
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                </Field>
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="col-span-1">
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <Field id="fullname" name="fullname" className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition" />
                <ErrorMessage name="fullname" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="col-span-1">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                <Field id="mobile" name="mobile" className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition" />
                <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                <Field id="email" name="email" type="email" className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="col-span-1">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                <Field id="dob" name="dob" type="date" className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-defaultcolor focus:border-defaultcolor transition" />
                <ErrorMessage name="dob" component="div" className="text-red-500 text-sm" />
              </div>
            </div>

            <div className="mt-6">
              <button type="submit" className="bg-defaultcolor text-white py-3 px-5 rounded-md hover:bg-defaultcolor-dark">
                Update Details
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
