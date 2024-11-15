// Contact.tsx

"use client";

import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Common/Loader";

// Define TypeScript interfaces based on the API response
interface ContactDetails {
  address: string;
  phone: string;
  email: string;
}

interface DirectionData {
  direction_title: string;
  directions: string[];
}

interface Contact {
  title: string;
  contact_details: ContactDetails;
  direction_data: DirectionData;
}

interface FormData {
  title: string;
  name_placeholder: string;
  email_placeholder: string;
  phone_placeholder: string;
  study_mode: string[];
  courses: string[];
  hear_by: string[];
  message_placeholder: string;
  checkbox_placeholder: string;
}

interface ContactFormData {
  contact: Contact;
  form: FormData;
}

interface ContactFormResponse {
  status: boolean;
  data: ContactFormData;
}

// Define the shape of form values
interface FormValues {
  name: string;
  email: string;
  phone: string;
  study_mode: string;
  course: string;
  hear_by: string;
  message: string;
  accept_condition: boolean;
  contact_me: string;
}

const Contact: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData | null>(null); // To store fetched form data
  const [contactData, setContactData] = useState<Contact | null>(null); // To store fetched contact data
  const [apiLoading, setApiLoading] = useState<boolean>(true); // Loading state for API data

  // Fetch contact-form data from the API when the component mounts
  useEffect(() => {
    const fetchContactFormData = async () => {
      try {
        const response = await axios.get<ContactFormResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/contact-form`
        );
        if (response.data.status) {
          setFormData(response.data.data.form);
          setContactData(response.data.data.contact);
        } else {
          console.error("Failed to load contact form data");
        }
      } catch (error) {
        console.error("Error fetching contact form data:", error);
      } finally {
        setApiLoading(false);
      }
    };
    fetchContactFormData();
  }, []);

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number is not valid")
      .required("Phone is required"),
    study_mode: Yup.string().required("Please select a study mode"),
    course: Yup.string().required("Please select a course"),
    hear_by: Yup.string().required("Please select how you heard about us"),
    message: Yup.string()
      .max(1000, "Message can't be longer than 1000 characters")
      .nullable(),
    accept_condition: Yup.boolean().oneOf(
      [true],
      "You must accept the terms"
    ),
    contact_me: Yup.string().required(
      "Please choose how you want to be contacted"
    ),
  });

  // Initialize Formik with type-safe initial values and handlers
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      study_mode: "",
      course: "",
      hear_by: "",
      message: "",
      accept_condition: false,
      contact_me: "phone",
    },
    validationSchema,
    onSubmit: async (
      values: FormValues,
      { resetForm }: FormikHelpers<FormValues>
    ) => {
      setLoading(true);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/contact-us`,
          values
        );

        if (response.data.status) {
          toast.success("Your inquiry has been submitted successfully!");
          resetForm(); // Reset the form after successful submission
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error: any) {
        console.error(
          "Error during submission:",
          error.response?.data || error.message
        );
        toast.error("An error occurred while submitting the form.");
      } finally {
        setLoading(false);
      }
    },
  });

  if (apiLoading) {
    return (
      <section id="contact" className="relative py-10 md:py-[60px] bg-gray-100">
        <div className="container mx-auto px-4">
         <Loader />
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-10 md:py-[60px] bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left Side: Contact Info */}
          <div className="w-full lg:w-6/12 p-12 bg-tertiary text-white flex flex-col ">
            <div>
              <h3 className="text-3xl font-semibold mb-6">
                {contactData?.title || "Action Centre"}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="h-5 w-5" />
                  <p>
                    {contactData?.contact_details?.address ||
                      "3 The Mount, Acton, London, W3 9NW"}
                  </p>
                </li>
                <li className="flex items-start space-x-3">
                  <FaPhoneAlt className="h-5 w-5" />
                  <p>{contactData?.contact_details?.phone || "02089934500"}</p>
                </li>
                <li className="flex items-start space-x-3">
                  <FaEnvelope className="h-5 w-5" />
                  <p>{contactData?.contact_details?.email || "info@wizam.com"}</p>
                </li>
              </ul>
            </div>
            <hr className="h-px my-12 bg-gray-100 border-0 dark:bg-gray-700" />

            <div className="mb-3">
              <h4 className="text-3xl font-semibold mb-4">
                {contactData?.direction_data?.direction_title || "Direction"}
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {contactData?.direction_data?.directions?.map(
                  (direction: string, index: number) => (
                    <li key={index}>{direction}</li>
                  )
                ) || (
                  <>
                    <li>
                      We are centrally located in Acton High Street, Acton,
                      West London.
                    </li>
                    <li>
                      10-minute walk from Acton Town Underground Station / Acton
                      Main/Acton Central.
                    </li>
                    <li>25 minutes by tube from Piccadilly Circus.</li>
                    <li>Only 9 stops away from London Heathrow Airport.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right Side: Inquiry Form */}
          <div className="w-full lg:w-6/12 p-10">
            <h3 className="text-2xl font-bold text-gray-800 text-center">
              {formData?.title || "Quick Inquiry"}
            </h3>
            <hr className="h-px my-6 bg-gray-100 border-0 dark:bg-gray-700" />

            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Name */}
                <div className="col-span-1 sm:col-span-1">
                  <input
                    type="text"
                    name="name"
                    placeholder={formData?.name_placeholder || "Name*"}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-1">
                  <input
                    type="email"
                    name="email"
                    placeholder={formData?.email_placeholder || "Email Address*"}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="col-span-1">
                  <input
                    type="text"
                    name="phone"
                    placeholder={formData?.phone_placeholder || "Phone Number*"}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                {/* Study Mode */}
                <div className="col-span-1 sm:col-span-1">
                  <select
                    name="study_mode"
                    value={formik.values.study_mode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.study_mode && formik.errors.study_mode
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData?.study_mode?.map((mode: string, index: number) => (
                      <option key={index} value={mode === "Select Mode" ? "" : mode}>
                        {mode}
                      </option>
                    )) || (
                      <>
                        <option value="">Study Mode*</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                      </>
                    )}
                  </select>
                  {formik.touched.study_mode && formik.errors.study_mode && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.study_mode}
                    </p>
                  )}
                </div>

                {/* Course */}
                <div className="col-span-1 sm:col-span-1">
                  <select
                    name="course"
                    value={formik.values.course}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.course && formik.errors.course
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData?.courses?.map((course: string, index: number) => (
                      <option key={index} value={course === "Select Courses" ? "" : course}>
                        {course}
                      </option>
                    )) || (
                      <>
                        <option value="">Course*</option>
                        <option value="Dental Nursing">Dental Nursing</option>
                        <option value="English">English</option>
                        
                      </>
                    )}
                  </select>
                  {formik.touched.course && formik.errors.course && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.course}
                    </p>
                  )}
                </div>

                {/* How did you hear about us */}
                <div className="col-span-1 sm:col-span-1">
                  <select
                    name="hear_by"
                    value={formik.values.hear_by}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-full border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.hear_by && formik.errors.hear_by
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData?.hear_by?.map((hear: string, index: number) => (
                      <option key={index} value={hear === "Select Hear By" ? "" : hear}>
                        {hear}
                      </option>
                    )) || (
                      <>
                        <option value="">
                          How did you hear about us?*
                        </option>
                        <option value="Newspaper">Newspaper</option>
                        <option value="Radio">Radio</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                  {formik.touched.hear_by && formik.errors.hear_by && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.hear_by}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="col-span-1 sm:col-span-1">
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={
                      formData?.message_placeholder || "Your Message"
                    }
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full bg-white rounded-md border py-3 px-4 focus:ring-2 focus:ring-primary focus:border-white ${
                      formik.touched.message && formik.errors.message
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  ></textarea>
                  {formik.touched.message && formik.errors.message && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.message}
                    </p>
                  )}
                </div>

                {/* Checkbox */}
                <div className="col-span-1 sm:col-span-1 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="accept_condition"
                    checked={formik.values.accept_condition}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-secondary border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-white"
                  />
                  <p className="text-sm">
                    {formData?.checkbox_placeholder ||
                      "Yes, I agree to the processing of my personal data in line with the school's privacy policy."}
                  </p>
                </div>
                {formik.touched.accept_condition &&
                  formik.errors.accept_condition && (
                    <p className="col-span-1 text-red-500 text-sm">
                      {formik.errors.accept_condition}
                    </p>
                  )}

                {/* Radio Buttons: Contact Me */}
                <div className="col-span-1 sm:col-span-1 flex items-center space-x-4 mt-4">
                  <label className="block mb-2 text-sm font-medium">
                    Contact me:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact_me"
                      value="phone"
                      checked={formik.values.contact_me === "phone"}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-secondary border-gray-300 rounded-full focus:ring-2 focus:ring-secondary focus:border-white"
                    />
                    <label>By phone</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contact_me"
                      value="email"
                      checked={formik.values.contact_me === "email"}
                      onChange={formik.handleChange}
                      className="h-4 w-4 text-secondary border-gray-300 rounded-full focus:ring-2 focus:ring-secondary focus:border-white"
                    />
                    <label>By email</label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-1">
                  <button
                    type="submit"
                    className="w-full bg-primary text-secondary font-semibold py-3 px-6 rounded-full hover:bg-primary-dark transition duration-300"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Contact;
